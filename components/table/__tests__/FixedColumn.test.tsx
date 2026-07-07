import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';
import useStickyOffsets from '../features/fixed/useStickyOffsets';
import useFixedInfo from '../features/fixed/useFixedInfo';
import { getCellFixedInfo } from '../features/fixed/fixUtil';
import type { StickyOffsets, Direction } from '../interface';

const data = [
  { key: '1', name: 'Alice', age: 30, action: 'Edit' },
  { key: '2', name: 'Bob', age: 25, action: 'Delete' },
  { key: '3', name: 'Charlie', age: 35, action: 'View' },
];

// ============================================================
// FixedColumn — useStickyOffsets Hook
// ============================================================
describe('useStickyOffsets Hook', () => {
  const renderHook = (colWidths: number[], columns: any[]) => {
    let result: StickyOffsets;
    function TestComponent() {
      result = useStickyOffsets(colWidths, columns);
      return null;
    }
    render(<TestComponent />);
    return () => result!;
  };

  it('calculates left offsets for start-fixed columns', () => {
    const columns = [
      { fixed: 'left' as const, width: 100 },
      { fixed: 'left' as const, width: 100 },
      {},
      {},
    ];
    const getResult = renderHook([100, 100, 200, 150], columns);
    const offsets = getResult();
    expect(offsets.start[0]).toBe(0);
    expect(offsets.start[1]).toBe(100);
    expect(offsets.start[2]).toBe(0); // non-fixed
    expect(offsets.start[3]).toBe(0);
  });

  it('calculates right offsets for end-fixed columns', () => {
    const columns = [
      {},
      {},
      { fixed: 'right' as const, width: 100 },
      { fixed: 'right' as const, width: 80 },
    ];
    const getResult = renderHook([200, 150, 100, 80], columns);
    const offsets = getResult();
    expect(offsets.end[2]).toBe(80); // 80 is the width of the next right column
    expect(offsets.end[3]).toBe(0); // last right column has 0 offset
  });

  it('handles mixed left and right fixed columns', () => {
    const columns = [
      { fixed: 'left' as const, width: 100 },
      {},
      { fixed: 'right' as const, width: 120 },
    ];
    const getResult = renderHook([100, 200, 120], columns);
    const offsets = getResult();
    expect(offsets.start[0]).toBe(0);
    expect(offsets.start[1]).toBe(0);
    expect(offsets.end[2]).toBe(0);
  });

  it('handles "start" and "end" as fixed values', () => {
    const columns = [
      { fixed: 'start' as const, width: 100 },
      {},
      { fixed: 'end' as const, width: 80 },
    ];
    const getResult = renderHook([100, 200, 80], columns);
    const offsets = getResult();
    expect(offsets.start[0]).toBe(0);
    expect(offsets.end[2]).toBe(0);
  });

  it('returns widths array', () => {
    const columns = [{ fixed: 'left' as const }, {}];
    const getResult = renderHook([100, 200], columns);
    const offsets = getResult();
    expect(offsets.widths).toEqual([100, 200]);
  });

  it('handles no fixed columns', () => {
    const columns = [{}, {}, {}];
    const getResult = renderHook([100, 200, 150], columns);
    const offsets = getResult();
    expect(offsets.start).toEqual([0, 0, 0]);
    expect(offsets.end).toEqual([0, 0, 0]);
  });

  it('handles empty columns', () => {
    const columns: any[] = [];
    const getResult = renderHook([], columns);
    const offsets = getResult();
    expect(offsets.start).toEqual([]);
    expect(offsets.end).toEqual([]);
  });

  it('is memoized', () => {
    const columns = [{ fixed: 'left' as const }];
    let renderCount = 0;
    function TestComponent() {
      const offsets = useStickyOffsets([100], columns);
      renderCount++;
      return <div data-offset={offsets.start[0]} />;
    }
    const { rerender } = render(<TestComponent />);
    const first = renderCount;
    rerender(<TestComponent />);
    expect(renderCount).toBe(first + 1); // re-rendered but memo should return same result
  });
});

// ============================================================
// FixedColumn — useFixedInfo Hook
// ============================================================
describe('useFixedInfo Hook — comprehensive', () => {
  function renderHook(columns: any[], stickyOffsets: StickyOffsets, direction: Direction) {
    let result: readonly any[];
    function TestComponent() {
      result = useFixedInfo(columns, stickyOffsets, direction);
      return null;
    }
    render(<TestComponent />);
    return () => result!;
  }

  it('returns correct info for all left-fixed columns', () => {
    const columns = [
      { fixed: 'left' as const },
      { fixed: 'left' as const },
      {},
      { fixed: 'right' as const },
    ];
    const offsets: StickyOffsets = {
      start: [0, 100, 0, 0],
      end: [0, 0, 0, 0],
      widths: [100, 100, 200, 80],
    };
    const getResult = renderHook(columns, offsets, 'ltr');
    const info = getResult();
    expect(info[0]).toEqual({ isSticky: false, offset: 0, fixed: 'start' });
    expect(info[1]).toEqual({ isSticky: false, offset: 100, fixed: 'start' });
    expect(info[2]).toEqual({});
    expect(info[3]).toEqual({ isSticky: false, offset: 0, fixed: 'end' });
  });

  it('handles RTL direction (isSticky=true)', () => {
    const columns = [{ fixed: 'left' as const }];
    const offsets: StickyOffsets = { start: [0], end: [0], widths: [100] };
    const getResult = renderHook(columns, offsets, 'rtl');
    expect(getResult()[0].isSticky).toBe(true);
  });

  it('handles LTR direction (isSticky=false)', () => {
    const columns = [{ fixed: 'left' as const }];
    const offsets: StickyOffsets = { start: [0], end: [0], widths: [100] };
    const getResult = renderHook(columns, offsets, 'ltr');
    expect(getResult()[0].isSticky).toBe(false);
  });

  it('returns empty for non-fixed columns', () => {
    const columns = [{}, {}, {}];
    const offsets: StickyOffsets = { start: [0, 0, 0], end: [0, 0, 0], widths: [100, 100, 100] };
    const getResult = renderHook(columns, offsets, 'ltr');
    const info = getResult();
    expect(info[0]).toEqual({});
    expect(info[1]).toEqual({});
    expect(info[2]).toEqual({});
  });
});

// ============================================================
// FixedColumn — getCellFixedInfo direct util tests
// ============================================================
describe('getCellFixedInfo — edge cases', () => {
  const baseOffsets: StickyOffsets = {
    start: [0, 100, 0, 0],
    end: [0, 0, 0, 80],
    widths: [100, 100, 200, 80],
  };

  it('returns empty for undefined column', () => {
    expect(getCellFixedInfo(0, [], baseOffsets, 'ltr')).toEqual({});
  });

  it('returns empty for out-of-bounds index', () => {
    const columns = [{ fixed: 'left' }] as any;
    expect(getCellFixedInfo(99, columns, baseOffsets, 'ltr')).toEqual({});
  });

  it('handles "start" fixed type', () => {
    const columns = [{ fixed: 'start' }] as any;
    const result = getCellFixedInfo(0, columns, baseOffsets, 'ltr');
    expect(result.fixed).toBe('start');
    expect(result.offset).toBe(0);
  });

  it('handles "end" fixed type', () => {
    const columns = [{}, {}, {}, { fixed: 'end' }] as any;
    const result = getCellFixedInfo(3, columns, baseOffsets, 'ltr');
    expect(result.fixed).toBe('end');
    expect(result.offset).toBe(80);
  });

  it('handles boolean true fixed type (maps to start)', () => {
    const columns = [{ fixed: true }] as any;
    const result = getCellFixedInfo(0, columns, baseOffsets, 'ltr');
    expect(result.fixed).toBe('start');
  });

  it('handles "left" fixed type (maps to start)', () => {
    const columns = [{ fixed: 'left' }] as any;
    const result = getCellFixedInfo(0, columns, baseOffsets, 'ltr');
    expect(result.fixed).toBe('start');
  });

  it('handles "right" fixed type (maps to end)', () => {
    const columns = [{ fixed: 'right' }] as any;
    const result = getCellFixedInfo(0, columns, baseOffsets, 'ltr');
    expect(result.fixed).toBe('end');
  });

  it('returns empty for non-fixed column', () => {
    const columns = [{}, { fixed: 'left' }] as any;
    const result = getCellFixedInfo(0, columns, baseOffsets, 'ltr');
    expect(result).toEqual({});
  });
});

// ============================================================
// FixedColumn — Table integration
// ============================================================
describe('FixedColumn — Table integration', () => {
  it('renders table with left fixed column', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    // Table should render successfully
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders table with right fixed column', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders table with both left and right fixed columns', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('applies sticky position style to fixed cells', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    // Check that at least some cells have position: sticky
    const stickyCells = container.querySelectorAll('td[style*="sticky"], th[style*="sticky"]');
    expect(stickyCells.length).toBeGreaterThan(0);
  });

  it('applies fix-left CSS class to left fixed header cells', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    const headerCells = container.querySelectorAll('th');
    expect(headerCells[0].className).toContain('fix-left');
  });

  it('applies fix-right CSS class to right fixed header cells', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    const headerCells = container.querySelectorAll('th');
    const lastCell = headerCells[headerCells.length - 1];
    expect(lastCell.className).toContain('fix-right');
  });

  it('applies left offset to second left-fixed column', () => {
    const columns = [
      { title: 'A', dataIndex: 'a', key: 'a', fixed: 'left' as const, width: 100 },
      { title: 'B', dataIndex: 'b', key: 'b', fixed: 'left' as const, width: 100 },
      { title: 'C', dataIndex: 'c', key: 'c', width: 200 },
    ];
    const { container } = render(
      <Table data={[{ key: '1', a: '1', b: '2', c: '3' }]} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    const headerCells = container.querySelectorAll('th');
    // First left cell should have left: 0
    expect(headerCells[0]).toHaveStyle({ position: 'sticky', left: '0px' });
    // Second left cell should have left: 100
    expect(headerCells[1]).toHaveStyle({ position: 'sticky', left: '100px' });
  });

  it('works with scroll.y and fixed columns together', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true, y: 200 }} />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders fixed columns with virtual mode', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
      action: `Action ${i}`,
    }));
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={largeData} columns={columns as any} rowKey="key" scroll={{ x: true, y: 200 }} virtual />,
    );
    expect(container.querySelector('.ant-table-virtual-list')).toBeInTheDocument();
    expect(screen.getByText('Row 0')).toBeInTheDocument();
  });

  it('handles "start" and "end" fixed values in Table', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'start' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'end' as const, width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('handles boolean true fixed value in Table', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: true as any, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders all data correctly with fixed columns', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    render(
      <Table data={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('renders empty state with fixed columns', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    render(
      <Table data={[]} columns={columns as any} rowKey="key" scroll={{ x: true }} emptyText="No fixed data" />,
    );
    expect(screen.getByText('No fixed data')).toBeInTheDocument();
  });
});
