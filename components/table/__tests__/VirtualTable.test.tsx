import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import BodyGrid from '../components/VirtualTableBody/BodyGrid';
import BodyLine from '../components/VirtualTableBody/BodyLine';

const generateData = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ key: i, name: `Row ${i}`, value: i }));

const columns = [
  { key: 'name', dataIndex: 'name', title: 'Name', width: 200 },
  { key: 'value', dataIndex: 'value', title: 'Value', width: 100 },
];

// ============================================================
// BodyGrid (Virtual)
// ============================================================
describe('BodyGrid (Virtual)', () => {
  it('renders virtual list with data', () => {
    const data = generateData(100);
    const { container } = render(
      <BodyGrid
        data={data}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={() => {}}
      />,
    );
    // Virtual list should render at least some rows
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('renders empty state when no data', () => {
    render(
      <BodyGrid
        data={[]}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={() => {}}
        emptyText="Empty"
      />,
    );
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('renders default empty text when emptyText is undefined', () => {
    render(
      <BodyGrid
        data={[]}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={() => {}}
      />,
    );
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders emptyText as function', () => {
    render(
      <BodyGrid
        data={[]}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={() => {}}
        emptyText={(() => 'Custom Virtual Empty') as any}
      />,
    );
    expect(screen.getByText('Custom Virtual Empty')).toBeInTheDocument();
  });

  it('uses default height when scroll.y is not a number', () => {
    const data = generateData(10);
    const { container } = render(
      <BodyGrid
        data={data}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{}}
        onScroll={() => {}}
      />,
    );
    expect(container.querySelectorAll('[data-row-key]').length).toBeGreaterThan(0);
  });

  it('renders cell content with correct values', () => {
    const data = [{ key: 0, name: 'TestName', value: 42 }];
    render(
      <BodyGrid
        data={data}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={() => {}}
      />,
    );
    expect(screen.getByText('TestName')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('calls onScroll when virtual list scrolls', () => {
    const onScroll = jest.fn();
    const data = generateData(100);
    const { container } = render(
      <BodyGrid
        data={data}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={onScroll}
      />,
    );
    // Find the scrollable element (rc-virtual-list)
    const scrollEl = container.querySelector('.ant-table-virtual-list');
    expect(scrollEl).toBeInTheDocument();
  });

  it('applies hover class to hovered row', () => {
    const data = generateData(5);
    const { container } = render(
      <BodyGrid
        data={data}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        colWidths={[200, 100]}
        prefixCls="ant-table"
        scroll={{ y: 200 }}
        onScroll={() => {}}
        hoverStartRow={2}
        hoverEndRow={2}
      />,
    );
    const hoveredRows = container.querySelectorAll('.ant-table-row-hover');
    expect(hoveredRows.length).toBeGreaterThan(0);
  });
});

// ============================================================
// BodyLine (Virtual Row)
// ============================================================
describe('BodyLine (Virtual Row)', () => {
  it('renders a div row with data-row-key', () => {
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
      />,
    );
    const row = container.querySelector('[data-row-key="1"]');
    expect(row).toBeInTheDocument();
  });

  it('renders cells for each column', () => {
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
      />,
    );
    const cells = container.querySelectorAll('.ant-table-virtual-cell');
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveTextContent('Alice');
    expect(cells[1]).toHaveTextContent('30');
  });

  it('applies cell width from colWidths', () => {
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
      />,
    );
    const cells = container.querySelectorAll('.ant-table-virtual-cell');
    expect(cells[0]).toHaveStyle({ width: '200px' });
    expect(cells[1]).toHaveStyle({ width: '100px' });
  });

  it('applies column render function', () => {
    const cols = [
      { key: 'name', dataIndex: 'name', title: 'Name', width: 200, render: (v: any) => `R:${v}` },
    ] as any;
    const record = { key: '1', name: 'Alice', value: 30 };
    render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={cols}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200]}
      />,
    );
    expect(screen.getByText('R:Alice')).toBeInTheDocument();
  });

  it('handles RenderedCell return from render', () => {
    const cols = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Name',
        width: 200,
        render: () => ({ children: 'merged-content' }),
      },
    ] as any;
    const record = { key: '1', name: 'Alice' };
    render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={cols}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200]}
      />,
    );
    expect(screen.getByText('merged-content')).toBeInTheDocument();
  });

  it('handles nested dataIndex', () => {
    const cols = [
      { key: 'user.name', dataIndex: ['user', 'name'], title: 'Name', width: 200 },
    ] as any;
    const record = { key: '1', user: { name: 'Nested' } };
    render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={cols}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200]}
      />,
    );
    expect(screen.getByText('Nested')).toBeInTheDocument();
  });

  it('applies hover class when isHovered=true', () => {
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
        isHovered
      />,
    );
    expect(container.querySelector('.ant-table-row-hover')).toBeInTheDocument();
  });

  it('does not apply hover class when isHovered=false', () => {
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
        isHovered={false}
      />,
    );
    expect(container.querySelector('.ant-table-row-hover')).not.toBeInTheDocument();
  });

  it('calls onHover on mouseEnter', () => {
    const onHover = jest.fn();
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={3}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
        onHover={onHover}
      />,
    );
    fireEvent.mouseEnter(container.querySelector('[data-row-key]')!);
    expect(onHover).toHaveBeenCalledWith(3, 3);
  });

  it('calls onHover on mouseLeave', () => {
    const onHover = jest.fn();
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={3}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
        onHover={onHover}
      />,
    );
    fireEvent.mouseLeave(container.querySelector('[data-row-key]')!);
    expect(onHover).toHaveBeenCalledWith(-1, -1);
  });

  it('uses custom style', () => {
    const record = { key: '1', name: 'Alice', value: 30 };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={columns as any}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200, 100]}
        style={{ height: '40px', top: '100px' }}
      />,
    );
    const row = container.querySelector('[data-row-key]') as HTMLElement;
    expect(row).toHaveStyle({ height: '40px', top: '100px' });
  });

  it('handles render returning React element', () => {
    const cols = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Name',
        width: 200,
        render: (v: any) => <strong data-testid="bold">{v}</strong>,
      },
    ] as any;
    const record = { key: '1', name: 'Bold' };
    render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={cols}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[200]}
      />,
    );
    expect(screen.getByTestId('bold')).toHaveTextContent('Bold');
  });

  it('falls back to column.width when colWidths is 0', () => {
    const cols = [
      { key: 'name', dataIndex: 'name', title: 'Name', width: 150 },
    ] as any;
    const record = { key: '1', name: 'Alice' };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={cols}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[0]}
      />,
    );
    const cell = container.querySelector('.ant-table-virtual-cell') as HTMLElement;
    expect(cell).toHaveStyle({ width: '150px' });
  });

  it('falls back to 100 when no width available', () => {
    const cols = [
      { key: 'name', dataIndex: 'name', title: 'Name' },
    ] as any;
    const record = { key: '1', name: 'Alice' };
    const { container } = render(
      <BodyLine
        record={record}
        index={0}
        flattenColumns={cols}
        getRowKey={(r: any) => r.key}
        prefixCls="ant-table"
        colWidths={[0]}
      />,
    );
    const cell = container.querySelector('.ant-table-virtual-cell') as HTMLElement;
    expect(cell).toHaveStyle({ width: '100px' });
  });
});
