import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';
import useStickyOffsets from '../features/fixed/useStickyOffsets';
import useFixedInfo from '../features/fixed/useFixedInfo';
import { getCellFixedInfo } from '../features/fixed/fixUtil';
import type { StickyOffsets } from '../interface';

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
      { fixed: 'start' as const, width: 100 },
      { fixed: 'start' as const, width: 100 },
      {},
      {},
    ];
    const getResult = renderHook([100, 100, 200, 150], columns);
    const offsets = getResult();
    expect(offsets.start[0]).toBe(0);
    expect(offsets.start[1]).toBe(100);
    // Non-fixed columns still get the accumulated offset from previous fixed columns
    expect(offsets.start[2]).toBe(200);
  });

  it('calculates right offsets for end-fixed columns', () => {
    const columns = [
      {},
      {},
      { fixed: 'end' as const, width: 100 },
      { fixed: 'end' as const, width: 80 },
    ];
    const getResult = renderHook([200, 150, 100, 80], columns);
    const offsets = getResult();
    expect(offsets.end[2]).toBe(80);
    expect(offsets.end[3]).toBe(0);
  });

  it('handles mixed start and end fixed columns', () => {
    const columns = [
      { fixed: 'start' as const, width: 100 },
      {},
      { fixed: 'end' as const, width: 120 },
    ];
    const getResult = renderHook([100, 200, 120], columns);
    const offsets = getResult();
    expect(offsets.start[0]).toBe(0);
    // Non-fixed column gets offset from previous fixed (100)
    expect(offsets.start[1]).toBe(100);
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
    const columns = [{ fixed: 'start' as const }, {}];
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

  it('returns default values for non-fixed column', () => {
    const columns = [{}] as any;
    const result = getCellFixedInfo(0, 0, columns, baseOffsets);
    expect(result.fixStart).toBeNull();
    expect(result.fixEnd).toBeNull();
  });

  it('handles "start" fixed type', () => {
    const columns = [{ fixed: 'start' }] as any;
    const result = getCellFixedInfo(0, 0, columns, baseOffsets);
    expect(result.fixStart).toBe(0);
    expect(result.fixEnd).toBeNull();
  });

  it('handles "end" fixed type', () => {
    const columns = [{}, {}, {}, { fixed: 'end' }] as any;
    const result = getCellFixedInfo(3, 3, columns, baseOffsets);
    expect(result.fixStart).toBeNull();
    expect(result.fixEnd).toBe(80);
  });

  it('returns null fixStart/fixEnd for non-fixed column', () => {
    const columns = [{}, { fixed: 'start' }] as any;
    const result = getCellFixedInfo(0, 0, columns, baseOffsets);
    expect(result.fixStart).toBeNull();
    expect(result.fixEnd).toBeNull();
  });
});

// ============================================================
// FixedColumn — useFixedInfo Hook
// ============================================================
describe('useFixedInfo Hook', () => {
  function renderHook(columns: any[], stickyOffsets: StickyOffsets) {
    let result: readonly any[];
    function TestComponent() {
      result = useFixedInfo(columns, stickyOffsets);
      return null;
    }
    render(<TestComponent />);
    return () => result!;
  }

  it('returns info for all columns', () => {
    const columns = [
      { fixed: 'start' as const },
      { fixed: 'start' as const },
      {},
      { fixed: 'end' as const },
    ];
    const offsets: StickyOffsets = {
      start: [0, 100, 200, 200],
      end: [80, 80, 80, 0],
      widths: [100, 100, 200, 80],
    };
    const getResult = renderHook(columns, offsets);
    const info = getResult();
    expect(info).toHaveLength(4);
    expect(info[0].fixStart).toBe(0);
    expect(info[1].fixStart).toBe(100);
    expect(info[2].fixStart).toBeNull();
    expect(info[3].fixEnd).toBe(0);
  });

  it('returns null fixStart/fixEnd for non-fixed columns', () => {
    const columns = [{}, {}, {}];
    const offsets: StickyOffsets = { start: [0, 0, 0], end: [0, 0, 0], widths: [100, 100, 100] };
    const getResult = renderHook(columns, offsets);
    const info = getResult();
    expect(info[0].fixStart).toBeNull();
    expect(info[0].fixEnd).toBeNull();
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
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
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
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
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
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('applies fix-start CSS class to left fixed header cells', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    const headerCells = container.querySelectorAll('th');
    // Implementation uses fix-start/fix-end instead of fix-left/fix-right
    expect(headerCells[0].className).toContain('fix-start');
  });

  it('applies fix-end CSS class to right fixed header cells', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    const headerCells = container.querySelectorAll('th');
    const lastCell = headerCells[headerCells.length - 1];
    expect(lastCell.className).toContain('fix-end');
  });

  it('works with scroll.y and fixed columns together', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'right' as const, width: 100 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true, y: 200 }} />,
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
    render(
      <Table dataSource={largeData} columns={columns as any} rowKey="key" scroll={{ x: true, y: 200 }} virtual />,
    );
    expect(screen.getByText('Row 0')).toBeInTheDocument();
  });

  it('handles "start" and "end" fixed values in Table', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'start' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 100 },
      { title: 'Action', dataIndex: 'action', key: 'action', fixed: 'end' as const, width: 100 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
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
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
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
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
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
      <Table dataSource={[]} columns={columns as any} rowKey="key" scroll={{ x: true }} locale={{ emptyText: 'No fixed data' }} />,
    );
    expect(screen.getByText('No fixed data')).toBeInTheDocument();
  });
});
