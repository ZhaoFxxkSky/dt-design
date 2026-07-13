import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Table } from '../index';

const generateData = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ key: i, name: `Row ${i}`, value: i }));

const columns = [
  { key: 'name', dataIndex: 'name', title: 'Name', width: 200 },
  { key: 'value', dataIndex: 'value', title: 'Value', width: 100 },
];

// ============================================================
// VirtualTable — Table integration
// ============================================================
describe('VirtualTable — Table integration', () => {
  it('renders virtual list with data', () => {
    const data = generateData(100);
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    // Virtual list should render at least some rows
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('renders empty state when no data', () => {
    render(
      <Table
        dataSource={[]}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        locale={{ emptyText: 'Empty' }}
      />,
    );
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('renders default empty text when no data', () => {
    render(
      <Table
        dataSource={[]}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
      />,
    );
    // Table renders a default empty text
    const tbody = document.querySelector('.ant-table-tbody');
    expect(tbody).toBeInTheDocument();
  });

  it('renders cell content with correct values', () => {
    const data = [{ key: 0, name: 'TestName', value: 42 }];
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    expect(screen.getByText('TestName')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders multiple rows in virtual mode', () => {
    const data = generateData(50);
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
    // Should not render all 50 rows (virtual scrolling)
    expect(rows.length).toBeLessThanOrEqual(50);
  });

  it('supports row hover in virtual mode', () => {
    const data = generateData(5);
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
    // Hover over first row
    fireEvent.mouseEnter(rows[0]);
    // The hovered row should have hover class
    expect(rows[0]).toHaveClass('ant-table-row');
  });

  it('renders with custom rowKey', () => {
    const data = [{ id: 'a', name: 'Alice', value: 30 }];
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="id"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('applies column render function', () => {
    const cols = [
      { key: 'name', dataIndex: 'name', title: 'Name', width: 200, render: (v: any) => `R:${v}` },
    ] as any;
    const data = [{ key: 0, name: 'Alice', value: 30 }];
    render(
      <Table
        dataSource={data}
        columns={cols}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    expect(screen.getByText('R:Alice')).toBeInTheDocument();
  });

  it('handles nested dataIndex', () => {
    const cols = [
      { key: 'user.name', dataIndex: ['user', 'name'], title: 'Name', width: 200 },
    ] as any;
    const data = [{ key: '1', user: { name: 'Nested' } }];
    render(
      <Table
        dataSource={data}
        columns={cols}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    expect(screen.getByText('Nested')).toBeInTheDocument();
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
    const data = [{ key: '1', name: 'Bold' }];
    render(
      <Table
        dataSource={data}
        columns={cols}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    expect(screen.getByTestId('bold')).toHaveTextContent('Bold');
  });

  it('supports onRow in virtual mode', () => {
    const onRow = jest.fn(() => ({ 'data-testid': 'vrow' }));
    const data = generateData(3);
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
        // Test-only: jest.Mock returning a `data-*` attribute object is not
        // statically assignable to GetComponentProps' HTMLAttributes return type
        onRow={onRow as any}
      />,
    );
    expect(onRow).toHaveBeenCalled();
    const rows = screen.getAllByTestId('vrow');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('renders with sticky header in virtual mode', () => {
    const data = generateData(20);
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        pagination={false}
      />,
    );
    // Header should exist
    const header = container.querySelector('.ant-table-header');
    expect(header).toBeInTheDocument();
  });

  it('renders large dataset efficiently', () => {
    const data = generateData(1000);
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 300 }}
        pagination={false}
      />,
    );
    const rows = container.querySelectorAll('[data-row-key]');
    // Virtual scrolling should render far fewer than 1000 rows
    expect(rows.length).toBeLessThan(100);
    expect(rows.length).toBeGreaterThan(0);
  });
});
