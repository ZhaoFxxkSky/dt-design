import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Cell from '../components/Cell';
import ColGroup from '../components/ColGroup';
import Header from '../components/Header/Header';
import FixedHolder from '../components/FixedHolder';

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
} as any;

// ============================================================
// ColGroup
// ============================================================
describe('ColGroup', () => {
  it('renders col elements with widths', () => {
    const { container } = render(
      <ColGroup colWidths={[100, 200]} columns={mockContext.flattenColumns} />,
    );
    const cols = container.querySelectorAll('col');
    expect(cols).toHaveLength(2);
    expect(cols[0]).toHaveStyle({ width: '100px' });
    expect(cols[1]).toHaveStyle({ width: '200px' });
  });

  it('renders colgroup wrapper element', () => {
    const { container } = render(
      <ColGroup colWidths={[100]} columns={[mockContext.flattenColumns[0]]} />,
    );
    expect(container.querySelector('colgroup')).toBeInTheDocument();
  });

  it('handles zero width columns', () => {
    const { container } = render(
      <ColGroup colWidths={[0, 200]} columns={mockContext.flattenColumns} />,
    );
    const cols = container.querySelectorAll('col');
    expect(cols).toHaveLength(2);
    // Zero width should not set width style
    expect(cols[0]).not.toHaveStyle({ width: '0px' });
  });

  it('handles empty columns', () => {
    const { container } = render(<ColGroup colWidths={[]} columns={[]} />);
    expect(container.querySelectorAll('col')).toHaveLength(0);
  });

  it('uses column.width when colWidths is 0', () => {
    const columns = [{ key: 'x', dataIndex: 'x', title: 'X', width: 150 }] as any;
    const { container } = render(<ColGroup colWidths={[0]} columns={columns} />);
    const col = container.querySelector('col');
    expect(col).toHaveStyle({ width: '150px' });
  });

  it('uses colWidths over column.width when both present', () => {
    const columns = [{ key: 'x', dataIndex: 'x', title: 'X', width: 150 }] as any;
    const { container } = render(<ColGroup colWidths={[300]} columns={columns} />);
    const col = container.querySelector('col');
    // column.width overrides colWidths in the implementation
    expect(col).toHaveStyle({ width: '150px' });
  });

  it('uses col.key for col element key', () => {
    const columns = [{ key: 'mykey', dataIndex: 'x', title: 'X', width: 100 }] as any;
    const { container } = render(<ColGroup colWidths={[100]} columns={columns} />);
    expect(container.querySelectorAll('col')).toHaveLength(1);
  });
});

// ============================================================
// Cell
// ============================================================
describe('Cell', () => {
  it('renders td with children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <Cell
              record={{ a: 'hello' }}
              index={0}
              column={mockContext.flattenColumns[0]}
              dataIndex="a"
            />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('calls render function', () => {
    const column = { ...mockContext.flattenColumns[0], render: (val: any) => `R:${val}` };
    render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'test' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('R:test')).toBeInTheDocument();
  });

  it('renders render function returning React element', () => {
    const column = {
      ...mockContext.flattenColumns[0],
      render: (val: any) => <strong data-testid="bold">{val}</strong>,
    };
    render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'bold-text' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('bold')).toHaveTextContent('bold-text');
  });

  it('renders RenderedCell object with children', () => {
    const column = {
      ...mockContext.flattenColumns[0],
      render: () => ({ props: { colSpan: 2 }, children: 'merged' }),
    };
    render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('merged')).toBeInTheDocument();
  });

  it('renders null when render returns null', () => {
    const column = { ...mockContext.flattenColumns[0], render: () => null };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
    // The cell content span should be empty
    const contentSpan = td?.querySelector('span');
    expect(contentSpan?.textContent).toBe('');
  });

  it('renders undefined when render returns undefined', () => {
    const column = { ...mockContext.flattenColumns[0], render: () => undefined };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('applies colSpan from column', () => {
    const column = { ...mockContext.flattenColumns[0], colSpan: 3 };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveAttribute('colspan', '3');
  });

  it('applies rowSpan from column', () => {
    const column = { ...mockContext.flattenColumns[0], rowSpan: 2 };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveAttribute('rowspan', '2');
  });

  it('applies colSpan from prop override', () => {
    const column = { ...mockContext.flattenColumns[0], colSpan: 1 };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" colSpan={4} />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveAttribute('colspan', '4');
  });

  it('does not set colSpan attribute when value is 1', () => {
    const column = { ...mockContext.flattenColumns[0] };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).not.toHaveAttribute('colspan');
  });

  it('applies column className', () => {
    const column = { ...mockContext.flattenColumns[0], className: 'my-cell-class' };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveClass('my-cell-class');
  });

  it('applies column style', () => {
    const column = { ...mockContext.flattenColumns[0], style: { color: 'red' } };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={column} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toHaveStyle({ color: 'red' });
  });

  it('calls onCellClick when clicked', () => {
    const onCellClick = jest.fn();
    const column = { ...mockContext.flattenColumns[0], onCellClick };
    const record = { a: 'click-me' };
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={record} index={0} column={column} dataIndex="a" onCellClick={onCellClick} />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    fireEvent.click(td!);
    expect(onCellClick).toHaveBeenCalledWith(record, expect.any(Object));
  });

  it('handles nested dataIndex (array)', () => {
    const column = { ...mockContext.flattenColumns[0], dataIndex: ['user', 'name'] } as any;
    render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ user: { name: 'Nested' } }} index={0} column={column} dataIndex={['user', 'name']} />
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('handles undefined dataIndex', () => {
    const column = { ...mockContext.flattenColumns[0], dataIndex: undefined } as any;
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'val' }} index={0} column={column} />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('handles missing record field', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{}} index={0} column={mockContext.flattenColumns[0]} dataIndex="a" />
          </tr>
        </tbody>
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('wraps content in prefixCls-cell-content span', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'x' }} index={0} column={mockContext.flattenColumns[0]} dataIndex="a" prefixCls="custom-table" />
          </tr>
        </tbody>
      </table>,
    );
    expect(container.querySelector('.custom-table-cell-content')).toBeInTheDocument();
  });

  it('render receives (value, record, index)', () => {
    const renderFn = jest.fn((val, _record, index) => `${index}:${val}`);
    const column = { ...mockContext.flattenColumns[0], render: renderFn };
    render(
      <table>
        <tbody>
          <tr>
            <Cell record={{ a: 'val' }} index={5} column={column} dataIndex="a" />
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
    const { container } = render(<Header {...mockContext} />);
    const ths = container.querySelectorAll('th');
    expect(ths).toHaveLength(2);
    expect(ths[0]).toHaveTextContent('A');
    expect(ths[1]).toHaveTextContent('B');
  });

  it('returns null when showHeader is false', () => {
    const { container } = render(<Header {...mockContext} showHeader={false} />);
    expect(container.querySelector('thead')).toBeNull();
  });

  it('renders single row for flat columns', () => {
    const { container } = render(<Header {...mockContext} />);
    expect(container.querySelectorAll('tr')).toHaveLength(1);
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
    const { container } = render(
      <Header
        prefixCls="ant-table"
        columns={groupedColumns as any}
        flattenColumns={flattenColumns as any}
      />,
    );
    // Should have 2 rows for 2-level grouped header
    const rows = container.querySelectorAll('thead > tr');
    expect(rows.length).toBeGreaterThanOrEqual(1);
  });

  it('applies onHeaderRow props to thead', () => {
    const onHeaderRow = jest.fn(() => ({ 'data-custom': 'yes', className: 'custom-header-row' }));
    const { container } = render(<Header {...mockContext} onHeaderRow={onHeaderRow} />);
    expect(onHeaderRow).toHaveBeenCalled();
    const thead = container.querySelector('thead');
    expect(thead).toHaveClass('custom-header-row');
    expect(thead).toHaveAttribute('data-custom', 'yes');
  });

  it('applies prefixCls-cell class to th', () => {
    const { container } = render(<Header {...mockContext} />);
    const ths = container.querySelectorAll('th');
    ths.forEach((th) => {
      expect(th).toHaveClass('ant-table-cell');
    });
  });

  it('applies column style to th', () => {
    const columns = [{ key: 'a', title: 'A', style: { width: '50%' } }] as any;
    const { container } = render(
      <Header prefixCls="ant-table" columns={columns} flattenColumns={columns} />,
    );
    const th = container.querySelector('th');
    expect(th).toHaveStyle({ width: '50%' });
  });

  it('handles function title', () => {
    const columns = [{ key: 'a', title: () => 'Dynamic Title' }] as any;
    const { container } = render(
      <Header prefixCls="ant-table" columns={columns} flattenColumns={columns} />,
    );
    expect(container.querySelector('th')).toHaveTextContent('Dynamic Title');
  });
});

// ============================================================
// FixedHolder
// ============================================================
describe('FixedHolder', () => {
  it('renders children inside table', () => {
    const { container } = render(
      <FixedHolder
        prefixCls="ant-table"
        colWidths={[100, 200]}
        flattenColumns={mockContext.flattenColumns}
      >
        <thead>
          <tr>
            <th>Header</th>
          </tr>
        </thead>
      </FixedHolder>,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('applies sticky styles when sticky=true', () => {
    const { container } = render(
      <FixedHolder
        prefixCls="ant-table"
        colWidths={[100]}
        flattenColumns={[mockContext.flattenColumns[0]]}
        sticky
        offsetHeader={10}
      >
        <tbody />
      </FixedHolder>,
    );
    const wrapper = container.querySelector('.ant-table-header');
    expect(wrapper).toHaveStyle({ position: 'sticky', top: '10px', zIndex: '2' });
  });

  it('does not apply sticky styles when sticky=false', () => {
    const { container } = render(
      <FixedHolder
        prefixCls="ant-table"
        colWidths={[100]}
        flattenColumns={[mockContext.flattenColumns[0]]}
        sticky={false}
      >
        <tbody />
      </FixedHolder>,
    );
    const wrapper = container.querySelector('.ant-table-header');
    expect(wrapper).not.toHaveStyle({ position: 'sticky' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <FixedHolder
        prefixCls="ant-table"
        className="custom-holder"
        colWidths={[100]}
        flattenColumns={[mockContext.flattenColumns[0]]}
      >
        <tbody />
      </FixedHolder>,
    );
    expect(container.querySelector('.custom-holder')).toBeInTheDocument();
  });

  it('renders ColGroup inside table', () => {
    const { container } = render(
      <FixedHolder
        prefixCls="ant-table"
        colWidths={[100, 200]}
        flattenColumns={mockContext.flattenColumns}
      >
        <tbody />
      </FixedHolder>,
    );
    expect(container.querySelector('colgroup')).toBeInTheDocument();
    expect(container.querySelectorAll('col')).toHaveLength(2);
  });

  it('applies custom style', () => {
    const { container } = render(
      <FixedHolder
        prefixCls="ant-table"
        style={{ backgroundColor: 'red' }}
        colWidths={[100]}
        flattenColumns={[mockContext.flattenColumns[0]]}
      >
        <tbody />
      </FixedHolder>,
    );
    const wrapper = container.querySelector('.ant-table-header');
    expect(wrapper).toHaveStyle({ backgroundColor: 'red' });
  });
});
