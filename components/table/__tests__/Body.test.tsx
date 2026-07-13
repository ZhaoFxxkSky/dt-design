import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Body from '../components/Body';
import TableContext from '../shared/context/TableContext';

const mockData = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 },
  { key: '3', name: 'Charlie', age: 35 },
];

const mockColumns = [
  { key: 'name', dataIndex: 'name', title: 'Name' },
  { key: 'age', dataIndex: 'age', title: 'Age' },
];

function makeContext(overrides: Record<string, any> = {}) {
  return {
    prefixCls: 'ant-table',
    flattenColumns: mockColumns,
    columns: mockColumns,
    fixedInfoList: mockColumns.map(() => ({})),
    direction: 'ltr',
    componentWidth: 300,
    colWidths: [100, 100],
    onColumnResize: () => {},
    tableLayout: 'fixed' as const,
    allColumnsFixedLeft: false,
    rowHoverable: true,
    scrollInfo: [0, 0] as [number, number],
    scrollbarSize: 0,
    isSticky: false,
    getComponent: ((_path: string[], defaultComp?: any) => defaultComp || 'td') as any,
    classNames: {},
    styles: {},
    hoverStartRow: -1,
    hoverEndRow: -1,
    onHover: () => {},
    expandedKeys: new Set<React.Key>(),
    getRowKey: (r: any) => r?.key,
    childrenColumnName: 'children',
    expandableType: null as any,
    expandRowByClick: false,
    expandedRowRender: null as any,
    expandIcon: null as any,
    onTriggerExpand: () => {},
    expandIconColumnIndex: 0,
    rowClassName: '',
    expandedRowClassName: '',
    indentSize: 15,
    fixHeader: false,
    fixColumn: false,
    horizonScroll: false,
    scrollX: true as const,
    emptyNode: null,
    onRow: undefined,
    rowExpandable: () => true,
    expandedRowOffset: undefined,
    measureRowRender: undefined,
    ...overrides,
  } as any;
}

function renderWithCtx(ui: React.ReactElement, ctxOverrides: Record<string, any> = {}) {
  return render(
    <TableContext.Provider value={makeContext(ctxOverrides)}>{ui}</TableContext.Provider>,
  );
}

// ============================================================
// Body — Rendering
// ============================================================
describe('Body — Rendering', () => {
  it('renders tbody with data rows', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs).toHaveLength(3);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    renderWithCtx(
      <table>
        <Body data={[]} measureColumnWidth={false} />
      </table>,
      { emptyNode: 'No data' },
    );
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders default empty text when emptyText is undefined', () => {
    renderWithCtx(
      <table>
        <Body data={[]} measureColumnWidth={false} />
      </table>,
      { emptyNode: 'No Data' },
    );
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders emptyText as function', () => {
    renderWithCtx(
      <table>
        <Body data={[]} measureColumnWidth={false} />
      </table>,
      { emptyNode: 'Custom Empty' },
    );
    expect(screen.getByText('Custom Empty')).toBeInTheDocument();
  });

  it('empty row has colSpan equal to column count', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={[]} measureColumnWidth={false} />
      </table>,
      { emptyNode: 'Empty' },
    );
    const td = container.querySelector('tbody td');
    expect(td).toHaveAttribute('colspan', '2');
  });
});

// ============================================================
// Body — Row className & onRow
// ============================================================
describe('Body — Row className & onRow', () => {
  it('applies string rowClassName', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { rowClassName: 'static-class' },
    );
    const trs = container.querySelectorAll('tbody tr');
    trs.forEach((tr) => {
      expect(tr).toHaveClass('static-class');
    });
  });

  it('applies function rowClassName with record and index', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { rowClassName: (record: any, index: number) => `row-${index}-${record.name}` },
    );
    expect(container.querySelector('.row-0-Alice')).toBeInTheDocument();
    expect(container.querySelector('.row-1-Bob')).toBeInTheDocument();
    expect(container.querySelector('.row-2-Charlie')).toBeInTheDocument();
  });

  it('applies onRow props to tr', () => {
    const onRow = jest.fn((record: any, index: number) => ({
      'data-index': index,
      'data-name': record.name,
    }));
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { onRow },
    );
    expect(onRow).toHaveBeenCalledTimes(3);
    const trs = container.querySelectorAll('tbody tr');
    expect(trs[0]).toHaveAttribute('data-index', '0');
    expect(trs[0]).toHaveAttribute('data-name', 'Alice');
  });

  it('uses row key as tr key', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { getRowKey: (r: any) => `custom-key-${r.key}` },
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs).toHaveLength(3);
  });
});

// ============================================================
// Body — Hover
// ============================================================
describe('Body — Hover', () => {
  it('applies hover class when hovered', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { hoverStartRow: 1, hoverEndRow: 1 },
    );
    // Hover class is on td cells (ant-table-cell-row-hover), not on tr
    const row1Cells = container.querySelectorAll('tbody tr:nth-child(2) td');
    row1Cells.forEach(td => {
      expect(td).toHaveClass('ant-table-cell-row-hover');
    });
    const row0Cells = container.querySelectorAll('tbody tr:nth-child(1) td');
    row0Cells.forEach(td => {
      expect(td).not.toHaveClass('ant-table-cell-row-hover');
    });
  });

  it('applies hover class for range', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { hoverStartRow: 0, hoverEndRow: 2 },
    );
    // All td cells should have hover class
    const allCells = container.querySelectorAll('tbody td');
    allCells.forEach(td => {
      expect(td).toHaveClass('ant-table-cell-row-hover');
    });
  });

  it('calls onHover on mouseEnter', () => {
    const onHover = jest.fn();
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { onHover },
    );
    // Hover events are on td cells, not tr
    const td = container.querySelector('tbody tr:nth-child(2) td');
    fireEvent.mouseEnter(td!);
    expect(onHover).toHaveBeenCalledWith(1, 1);
  });

  it('calls onHover on mouseLeave', () => {
    const onHover = jest.fn();
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { onHover },
    );
    // Hover events are on td cells, not tr
    const td = container.querySelector('tbody tr:nth-child(1) td');
    fireEvent.mouseLeave(td!);
    expect(onHover).toHaveBeenCalledWith(-1, -1);
  });
});

// ============================================================
// Body — Cell rendering
// ============================================================
describe('Body — Cell rendering', () => {
  it('renders cells for each column', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    trs.forEach((tr) => {
      expect(tr.querySelectorAll('td')).toHaveLength(2);
    });
  });

  it('renders cell content directly in td', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
    expect(td).toHaveClass('ant-table-cell');
  });
});

// ============================================================
// Body — PrefixCls
// ============================================================
describe('Body — PrefixCls', () => {
  it('uses default prefixCls when not provided', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
    );
    expect(container.querySelector('.ant-table-row')).toBeInTheDocument();
  });

  it('uses custom prefixCls', () => {
    const { container } = renderWithCtx(
      <table>
        <Body data={mockData} measureColumnWidth={false} />
      </table>,
      { prefixCls: 'custom-table' },
    );
    expect(container.querySelector('.custom-table-row')).toBeInTheDocument();
  });
});
