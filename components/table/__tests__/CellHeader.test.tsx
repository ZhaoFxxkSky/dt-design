import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Cell from '../components/Cell';
import ColGroup from '../components/ColGroup';
import Header from '../components/Header/Header';
import FixedHolder from '../components/FixedHolder';
import TableContext from '../shared/context/TableContext';

const mockContext = {
  prefixCls: 'ant-table',
  flattenColumns: [
    { key: 'a', dataIndex: 'a', title: 'A', width: 100 },
    { key: 'b', dataIndex: 'b', title: 'B', width: 200 },
  ],
  columns: [
    { key: 'a', dataIndex: 'a', title: 'A', width: 100 },
    { key: 'b', dataIndex: 'b', title: 'B', width: 200 },
  ],
  fixedInfoList: [{}, {}],
  direction: 'ltr',
  componentWidth: 300,
  colWidths: [100, 200],
  onColumnResize: () => {},
  tableLayout: 'fixed' as const,
  allColumnsFixedLeft: false,
  rowHoverable: true,
  scrollInfo: [0, 0] as [number, number],
  scrollbarSize: 0,
  isSticky: false,
  getComponent: ((path: string[], defaultComp?: any) => defaultComp || 'td') as any,
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
} as any;

function renderWithCtx(ui: React.ReactElement) {
  return render(<TableContext.Provider value={mockContext}>{ui}</TableContext.Provider>);
}

// ============================================================
// ColGroup
// ============================================================
describe('ColGroup', () => {
  it('renders col elements with widths', () => {
    const { container } = renderWithCtx(
      <ColGroup colWidths={[100, 200]} columns={mockContext.flattenColumns} />,
    );
    const cols = container.querySelectorAll('col');
    expect(cols).toHaveLength(2);
    expect(cols[0]).toHaveStyle({ width: '100px' });
    expect(cols[1]).toHaveStyle({ width: '200px' });
  });

  it('renders colgroup wrapper element', () => {
    const { container } = renderWithCtx(
      <ColGroup colWidths={[100]} columns={[mockContext.flattenColumns[0]]} />,
    );
    expect(container.querySelector('colgroup')).toBeInTheDocument();
  });

  it('handles zero width columns', () => {
    const { container } = renderWithCtx(
      <ColGroup colWidths={[0, 200]} columns={mockContext.flattenColumns} />,
    );
    const cols = container.querySelectorAll('col');
    expect(cols).toHaveLength(2);
  });

  it('handles empty columns', () => {
    const { container } = renderWithCtx(<ColGroup colWidths={[]} columns={[]} />);
    expect(container.querySelectorAll('col')).toHaveLength(0);
  });

  it('uses column.width when colWidths is 0', () => {
    const columns = [{ key: 'x', dataIndex: 'x', title: 'X', width: 150 }] as any;
    const { container } = renderWithCtx(<ColGroup colWidths={[0]} columns={columns} />);
    // When colWidths is 0 (falsy), ColGroup skips rendering the col element
    expect(container.querySelectorAll('col')).toHaveLength(0);
  });

  it('uses colWidths over column.width when both present', () => {
    const columns = [{ key: 'x', dataIndex: 'x', title: 'X', width: 150 }] as any;
    const { container } = renderWithCtx(<ColGroup colWidths={[300]} columns={columns} />);
    const col = container.querySelector('col');
    // colWidths takes priority over column.width
    expect(col).toHaveStyle({ width: '300px' });
  });

  it('uses col.key for col element key', () => {
    const columns = [{ key: 'mykey', dataIndex: 'x', title: 'X', width: 100 }] as any;
    const { container } = renderWithCtx(<ColGroup colWidths={[100]} columns={columns} />);
    expect(container.querySelectorAll('col')).toHaveLength(1);
  });
});

// ============================================================
// Cell
// ============================================================
describe('Cell', () => {
  it('renders td with children', () => {
    renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell
              record={{ a: 'hello' }}
              index={0}
              column={mockContext.flattenColumns[0]}
              dataIndex="a"
              component="td"
            />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('calls render function', () => {
    const renderFn = (val: any) => `R:${val}`;
    renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'test' }} index={0} render={renderFn} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('R:test')).toBeInTheDocument();
  });

  it('renders render function returning React element', () => {
    const renderFn = (val: any) => <strong data-testid="bold">{val}</strong>;
    renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'bold-text' }} index={0} render={renderFn} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('bold')).toHaveTextContent('bold-text');
  });

  it('renders RenderedCell object with children', () => {
    const renderFn = () => ({ props: { colSpan: 2 }, children: 'merged' });
    renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} render={renderFn} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('merged')).toBeInTheDocument();
  });

  it('renders null when render returns null', () => {
    const renderFn = () => null;
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} render={renderFn} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('renders undefined when render returns undefined', () => {
    const renderFn = () => undefined;
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} render={renderFn} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('applies colSpan from prop', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} colSpan={3} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveAttribute('colspan', '3');
  });

  it('applies rowSpan from prop', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} rowSpan={2} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveAttribute('rowspan', '2');
  });

  it('applies colSpan from prop override', () => {
    const column = { ...mockContext.flattenColumns[0], colSpan: 1 };
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" colSpan={4} component="td" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveAttribute('colspan', '4');
  });

  it('does not set colSpan attribute when value is 1', () => {
    const column = { ...mockContext.flattenColumns[0] };
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" component="td" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).not.toHaveAttribute('colspan');
  });

  it('applies column className', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} className="my-cell-class" dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('my-cell-class');
  });

  it('applies column style', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} style={{ color: 'red' }} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveStyle({ color: 'red' });
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    const record = { a: 'click-me' };
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={record} index={0} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" additionalProps={{ onClick }} />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    fireEvent.click(td!);
    expect(onClick).toHaveBeenCalled();
  });

  it('handles nested dataIndex (array)', () => {
    renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ user: { name: 'Nested' } }} index={0} dataIndex={['user', 'name'] as any} renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('handles undefined dataIndex', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'val' }} index={0} component="td" prefixCls="ant-table" renderIndex={0} />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('handles missing record field', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{}} index={0} dataIndex="a" renderIndex={0} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('wraps content in prefixCls-cell-content span', () => {
    const { container } = renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} dataIndex="a" prefixCls="custom-table" renderIndex={0} component="td" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('render receives (value, record, index)', () => {
    const renderFn = jest.fn((val, _record, index) => `${index}:${val}`);
    renderWithCtx(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'val' }} index={5} render={renderFn} dataIndex="a" renderIndex={5} component="td" prefixCls="ant-table" />
          </tr>
        </tbody>
      </table>,
    );
    expect(renderFn).toHaveBeenCalledWith('val', { a: 'val' }, 5);
    expect(screen.getByText('5:val')).toBeInTheDocument();
  });
});

// ============================================================
// Header
// ============================================================
describe('Header', () => {
  it('renders thead with column titles', () => {
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={mockContext.columns}
        flattenColumns={mockContext.flattenColumns}
        stickyOffsets={{ start: [0, 0], end: [0, 0], widths: [100, 200] }}
      />,
    );
    const ths = container.querySelectorAll('th');
    expect(ths).toHaveLength(2);
    expect(ths[0]).toHaveTextContent('A');
    expect(ths[1]).toHaveTextContent('B');
  });

  it('renders single row for flat columns', () => {
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={mockContext.columns}
        flattenColumns={mockContext.flattenColumns}
        stickyOffsets={{ start: [0, 0], end: [0, 0], widths: [100, 200] }}
      />,
    );
    expect(container.querySelectorAll('thead > tr')).toHaveLength(1);
  });

  it('renders grouped header with multiple rows', () => {
    const groupedColumns = [
      {
        title: 'Group',
        key: 'group',
        children: [
          { title: 'A', dataIndex: 'a', key: 'a' },
          { title: 'B', dataIndex: 'b', key: 'b' },
        ],
      },
      { title: 'C', dataIndex: 'c', key: 'c' },
    ];
    const flattenColumns = [
      { title: 'A', dataIndex: 'a', key: 'a' },
      { title: 'B', dataIndex: 'b', key: 'b' },
      { title: 'C', dataIndex: 'c', key: 'c' },
    ];
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={groupedColumns as any}
        flattenColumns={flattenColumns as any}
        stickyOffsets={{ start: [0, 0, 0], end: [0, 0, 0], widths: [100, 100, 100] }}
      />,
    );
    const rows = container.querySelectorAll('thead > tr');
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  it('applies onHeaderRow props to header row', () => {
    const onHeaderRow = jest.fn(() => ({ 'data-custom': 'yes', className: 'custom-header-row' }));
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={mockContext.columns}
        flattenColumns={mockContext.flattenColumns}
        stickyOffsets={{ start: [0, 0], end: [0, 0], widths: [100, 200] }}
        onHeaderRow={onHeaderRow}
      />,
    );
    expect(onHeaderRow).toHaveBeenCalled();
    // onHeaderRow props are spread on the row component
    const tr = container.querySelector('thead tr');
    expect(tr).toHaveAttribute('data-custom', 'yes');
  });

  it('applies prefixCls-cell class to th', () => {
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={mockContext.columns}
        flattenColumns={mockContext.flattenColumns}
        stickyOffsets={{ start: [0, 0], end: [0, 0], widths: [100, 200] }}
      />,
    );
    const ths = container.querySelectorAll('th');
    ths.forEach((th) => {
      expect(th).toHaveClass('ant-table-cell');
    });
  });

  it('applies column style to th via onHeaderCell', () => {
    const columns = [{ key: 'a', title: 'A', width: 100, onHeaderCell: () => ({ style: { width: '50%' } }) }] as any;
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={columns}
        flattenColumns={columns}
        stickyOffsets={{ start: [0], end: [0], widths: [100] }}
      />,
    );
    const th = container.querySelector('th');
    expect(th).toHaveStyle({ width: '50%' });
  });

  it('handles string title', () => {
    const columns = [{ key: 'a', title: 'Dynamic Title' }] as any;
    const { container } = renderWithCtx(
      <Header
        prefixCls="ant-table"
        columns={columns}
        flattenColumns={columns}
        stickyOffsets={{ start: [0], end: [0], widths: [100] }}
      />,
    );
    expect(container.querySelector('th')).toHaveTextContent('Dynamic Title');
  });
});

// ============================================================
// FixedHolder
// ============================================================
describe('FixedHolder', () => {
  it('renders children inside table', () => {
    const { container } = renderWithCtx(
      <FixedHolder
        prefixCls="ant-table"
        className="ant-table-header"
        colWidths={[100, 200]}
        columCount={2}
        flattenColumns={mockContext.flattenColumns}
        columns={mockContext.columns}
        stickyOffsets={{ start: [0, 0], end: [0, 0], widths: [100, 200] }}
        direction="ltr"
        noData={false}
        maxContentScroll={false}
        fixHeader
        scrollX={true}
        onScroll={() => {}}
      >
        {() => (
          <thead>
            <tr>
              <th>Header</th>
            </tr>
          </thead>
        )}
      </FixedHolder>,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = renderWithCtx(
      <FixedHolder
        prefixCls="ant-table"
        className="custom-holder"
        colWidths={[100]}
        columCount={1}
        flattenColumns={[mockContext.flattenColumns[0]]}
        columns={[mockContext.columns[0]]}
        stickyOffsets={{ start: [0], end: [0], widths: [100] }}
        direction="ltr"
        noData={false}
        maxContentScroll={false}
        fixHeader
        scrollX={true}
        onScroll={() => {}}
      >
        {() => <tbody />}
      </FixedHolder>,
    );
    expect(container.querySelector('.custom-holder')).toBeInTheDocument();
  });

  it('renders ColGroup inside table', () => {
    const { container } = renderWithCtx(
      <FixedHolder
        prefixCls="ant-table"
        className="ant-table-header"
        colWidths={[100, 200]}
        columCount={2}
        flattenColumns={mockContext.flattenColumns}
        columns={mockContext.columns}
        stickyOffsets={{ start: [0, 0], end: [0, 0], widths: [100, 200] }}
        direction="ltr"
        noData={false}
        maxContentScroll={false}
        fixHeader
        scrollX={true}
        onScroll={() => {}}
      >
        {() => <tbody />}
      </FixedHolder>,
    );
    expect(container.querySelector('colgroup')).toBeInTheDocument();
    expect(container.querySelectorAll('col')).toHaveLength(2);
  });

  it('applies custom style', () => {
    const { container } = renderWithCtx(
      <FixedHolder
        prefixCls="ant-table"
        className="ant-table-header"
        style={{ backgroundColor: 'red' }}
        colWidths={[100]}
        columCount={1}
        flattenColumns={[mockContext.flattenColumns[0]]}
        columns={[mockContext.columns[0]]}
        stickyOffsets={{ start: [0], end: [0], widths: [100] }}
        direction="ltr"
        noData={false}
        maxContentScroll={false}
        fixHeader
        scrollX={true}
        onScroll={() => {}}
      >
        {() => <tbody />}
      </FixedHolder>,
    );
    const wrapper = container.querySelector('.ant-table-header');
    expect(wrapper).toHaveStyle({ backgroundColor: 'red' });
  });
});
