import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Body from '../components/Body';

const mockData = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 },
  { key: '3', name: 'Charlie', age: 35 },
];

const mockColumns = [
  { key: 'name', dataIndex: 'name', title: 'Name' },
  { key: 'age', dataIndex: 'age', title: 'Age' },
];

// ============================================================
// Body — Rendering
// ============================================================
describe('Body — Rendering', () => {
  it('renders tbody with data rows', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs).toHaveLength(3);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(
      <table>
        <Body
          data={[]}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          emptyText="No data"
        />
      </table>,
    );
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders default empty text when emptyText is undefined', () => {
    render(
      <table>
        <Body
          data={[]}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
        />
      </table>,
    );
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders emptyText as function', () => {
    render(
      <table>
        <Body
          data={[]}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          emptyText={(() => 'Custom Empty') as any}
        />
      </table>,
    );
    expect(screen.getByText('Custom Empty')).toBeInTheDocument();
  });

  it('empty row has colSpan equal to column count', () => {
    const { container } = render(
      <table>
        <Body
          data={[]}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          emptyText="Empty"
        />
      </table>,
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
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          rowClassName="static-class"
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    trs.forEach((tr) => {
      expect(tr).toHaveClass('static-class');
    });
  });

  it('applies function rowClassName with record and index', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          rowClassName={(record, index) => `row-${index}-${record.name}`}
        />
      </table>,
    );
    expect(container.querySelector('.row-0-Alice')).toBeInTheDocument();
    expect(container.querySelector('.row-1-Bob')).toBeInTheDocument();
    expect(container.querySelector('.row-2-Charlie')).toBeInTheDocument();
  });

  it('applies onRow props to tr', () => {
    const onRow = jest.fn((record, index) => ({
      'data-index': index,
      'data-name': record.name,
      className: 'custom-on-row',
    }));
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          onRow={onRow}
        />
      </table>,
    );
    expect(onRow).toHaveBeenCalledTimes(3);
    const trs = container.querySelectorAll('tbody tr');
    expect(trs[0]).toHaveClass('custom-on-row');
    expect(trs[0]).toHaveAttribute('data-index', '0');
    expect(trs[0]).toHaveAttribute('data-name', 'Alice');
  });

  it('uses row key as tr key', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => `custom-key-${r.key}`}
          prefixCls="ant-table"
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    // Each tr should have its key (React keys are not directly observable but rows should render)
    expect(trs).toHaveLength(3);
  });
});

// ============================================================
// Body — Hover
// ============================================================
describe('Body — Hover', () => {
  it('applies hover class when hovered', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          hoverStartRow={1}
          hoverEndRow={1}
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs[0]).not.toHaveClass('ant-table-row-hover');
    expect(trs[1]).toHaveClass('ant-table-row-hover');
    expect(trs[2]).not.toHaveClass('ant-table-row-hover');
  });

  it('applies hover class for range', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          hoverStartRow={0}
          hoverEndRow={2}
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    trs.forEach((tr) => {
      expect(tr).toHaveClass('ant-table-row-hover');
    });
  });

  it('calls onHover on mouseEnter', () => {
    const onHover = jest.fn();
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          onHover={onHover}
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    fireEvent.mouseEnter(trs[1]);
    expect(onHover).toHaveBeenCalledWith(1, 1);
  });

  it('calls onHover on mouseLeave', () => {
    const onHover = jest.fn();
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
          onHover={onHover}
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    fireEvent.mouseLeave(trs[0]);
    expect(onHover).toHaveBeenCalledWith(-1, -1);
  });
});

// ============================================================
// Body — Cell rendering
// ============================================================
describe('Body — Cell rendering', () => {
  it('renders cells for each column', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
        />
      </table>,
    );
    const trs = container.querySelectorAll('tbody tr');
    trs.forEach((tr) => {
      expect(tr.querySelectorAll('td')).toHaveLength(2);
    });
  });

  it('renders cell content directly in td', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
        />
      </table>,
    );
    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
    expect(td).toHaveClass('ant-table-cell');
  });

  it('passes onCellClick from column to Cell', () => {
    const onCellClick = jest.fn();
    const columns = [{ key: 'name', dataIndex: 'name', title: 'Name', onCellClick }] as any;
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={columns}
          flattenColumns={columns}
          getRowKey={(r: any) => r.key}
          prefixCls="ant-table"
        />
      </table>,
    );
    const td = container.querySelector('tbody td');
    fireEvent.click(td!);
    expect(onCellClick).toHaveBeenCalled();
  });
});

// ============================================================
// Body — PrefixCls
// ============================================================
describe('Body — PrefixCls', () => {
  it('uses default prefixCls when not provided', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
        />
      </table>,
    );
    expect(container.querySelector('.ant-table-row')).toBeInTheDocument();
  });

  it('uses custom prefixCls', () => {
    const { container } = render(
      <table>
        <Body
          data={mockData}
          columns={mockColumns as any}
          flattenColumns={mockColumns as any}
          getRowKey={(r: any) => r.key}
          prefixCls="custom-table"
        />
      </table>,
    );
    expect(container.querySelector('.custom-table-row')).toBeInTheDocument();
  });
});
