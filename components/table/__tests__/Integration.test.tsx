import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';

interface RecordType {
  key: string;
  name: string;
  age: number;
  address: string;
  children?: RecordType[];
}

const data: RecordType[] = [
  { key: '1', name: 'Alice', age: 30, address: 'Street 1' },
  { key: '2', name: 'Bob', age: 25, address: 'Street 2' },
  { key: '3', name: 'Charlie', age: 35, address: 'Street 3' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
  { title: 'Address', dataIndex: 'address', key: 'address' },
];

// ============================================================
// Table Integration �?Basic
// ============================================================
describe('Table Integration �?Basic', () => {
  it('renders full table with header and body', () => {
    const { container } = render(<Table dataSource={data} columns={columns as any} rowKey="key" />);

    // Header
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();

    // Body
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Street 1')).toBeInTheDocument();

    // Structure
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('renders with title and footer', () => {
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        title={() => 'My Table Title'}
        footer={() => 'Table Footer'}
      />,
    );
    expect(screen.getByText('My Table Title')).toBeInTheDocument();
    expect(screen.getByText('Table Footer')).toBeInTheDocument();
  });

  it('renders with custom emptyText', () => {
    render(
      <Table dataSource={[]} columns={columns as any} rowKey="key" locale={{ emptyText: 'No data available' }} />,
    );
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders with render function in column', () => {
    const customColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <strong data-testid="custom-name">{text}</strong>,
      },
    ];
    render(<Table dataSource={data} columns={customColumns as any} rowKey="key" />);
    const names = screen.getAllByTestId('custom-name');
    expect(names).toHaveLength(3);
    expect(names[0]).toHaveTextContent('Alice');
  });

  it('renders with rowClassName function', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        rowClassName={(_record, index) => `custom-row-${index}`}
      />,
    );
    expect(container.querySelector('.custom-row-0')).toBeInTheDocument();
    expect(container.querySelector('.custom-row-1')).toBeInTheDocument();
  });
});

// ============================================================
// Table Integration �?Column Groups
// ============================================================
describe('Table Integration �?Column Groups', () => {
  it('renders grouped columns with correct structure', () => {
    const groupedColumns = [
      {
        title: 'Personal Info',
        key: 'personal',
        children: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Age', dataIndex: 'age', key: 'age' },
        ],
      },
      { title: 'Address', dataIndex: 'address', key: 'address' },
    ];
    render(
      <Table dataSource={data} columns={groupedColumns as any} rowKey="key" />,
    );
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
  });

  it('renders nested column groups', () => {
    const nestedColumns = [
      {
        title: 'L1',
        key: 'l1',
        children: [
          {
            title: 'L2',
            key: 'l2',
            children: [
              { title: 'Name', dataIndex: 'name', key: 'name' },
            ],
          },
          { title: 'Age', dataIndex: 'age', key: 'age' },
        ],
      },
    ];
    render(
      <Table dataSource={data} columns={nestedColumns as any} rowKey="key" />,
    );
    expect(screen.getByText('L1')).toBeInTheDocument();
    expect(screen.getByText('L2')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('filters hidden columns in groups', () => {
    const columnsWithHidden = [
      {
        title: 'Group',
        key: 'group',
        children: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Hidden', dataIndex: 'hidden', key: 'hidden', hidden: true },
        ],
      },
    ];
    render(
      <Table dataSource={data} columns={columnsWithHidden as any} rowKey="key" />,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
});

// ============================================================
// Table Integration �?Scroll
// ============================================================
describe('Table Integration �?Scroll', () => {
  it('renders with vertical scroll', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
    // Both should have table elements
    expect(container.querySelectorAll('table').length).toBeGreaterThanOrEqual(2);
  });

  it('renders with horizontal scroll', () => {
    const wideColumns = [
      { title: 'Col1', dataIndex: 'name', key: 'name', width: 500 },
      { title: 'Col2', dataIndex: 'age', key: 'age', width: 500 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={wideColumns as any} rowKey="key" scroll={{ x: true }} />,
    );
    // When scroll.x is set, table layout should be fixed
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders with both scroll.x and scroll.y', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        scroll={{ x: true, y: 200 }}
      />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
  });

  it('renders header and body content separately when scroll.y', () => {
    render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} />,
    );
    // Header should be in header section (may appear in header + measure row)
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
    // Body should have data
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});

// ============================================================
// Table Integration �?Virtual Mode
// ============================================================
describe('Table Integration �?Virtual Mode', () => {
  it('renders virtual table with scroll.y', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
      address: `Address ${i}`,
    }));
    const { container } = render(
      <Table
        dataSource={largeData}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
      />,
    );
    // Virtual list should render some rows
    const virtualRows = container.querySelectorAll('[data-row-key]');
    expect(virtualRows.length).toBeGreaterThan(0);
    expect(virtualRows.length).toBeLessThan(100);
  });

  it('renders virtual table with header', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
    }));
    render(
      <Table
        dataSource={largeData}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
      />,
    );
    // Header titles may appear in both the visible header and the hidden measure row
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Age').length).toBeGreaterThan(0);
  });

  it('renders virtual table without scroll.y (no fixed header)', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
    }));
    const { container } = render(
      <Table
        dataSource={largeData}
        columns={columns as any}
        rowKey="key"
        virtual
      />,
    );
    // Should still render virtual list
    const virtualRows = container.querySelectorAll('[data-row-key]');
    expect(virtualRows.length).toBeGreaterThan(0);
    // Header should be rendered
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
  });
});

// ============================================================
// Table Integration �?onRow & Interactions
// ============================================================
describe('Table Integration �?onRow & Interactions', () => {
  it('applies onRow custom click handler', () => {
    const onRowClick = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        onRow={(record) => ({ onClick: () => onRowClick(record) })}
      />,
    );
    const trs = container.querySelectorAll('tbody tr');
    fireEvent.click(trs[0]);
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('applies onHeaderRow props', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        onHeaderRow={(() => ({ 'data-header': 'yes' })) as any}
      />,
    );
    // onHeaderRow applies props to the tr element inside thead
    const headerRow = container.querySelector('thead tr');
    expect(headerRow).toHaveAttribute('data-header', 'yes');
  });

  it('renders with onCell click handler in column', () => {
    const onCellClick = jest.fn();
    const cols = [
      { title: 'Name', dataIndex: 'name', key: 'name', onCell: () => ({ onClick: onCellClick }) },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols as any} rowKey="key" />,
    );
    const td = container.querySelector('tbody td');
    fireEvent.click(td!);
    expect(onCellClick).toHaveBeenCalled();
  });
});

// ============================================================
// Table Integration �?Summary
// ============================================================
describe('Table Integration �?Summary', () => {
  it('renders summary with data', () => {
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        summary={(data) => (
          <div data-testid="summary">
            Total: {data.length} rows
          </div>
        )}
      />,
    );
    expect(screen.getByTestId('summary')).toHaveTextContent('Total: 3 rows');
  });
});

// ============================================================
// Table Integration �?Large dataset
// ============================================================
describe('Table Integration �?Large dataset', () => {
  it('renders 1000 rows in non-virtual mode', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
      address: `Address ${i}`,
    }));
    const { container } = render(
      <Table dataSource={largeData} columns={columns as any} rowKey="key" pagination={false} />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1000);
  });
});

// ============================================================
// Table Integration �?Edge cases
// ============================================================
describe('Table Integration �?Edge cases', () => {
  it('handles single row', () => {
    const { container } = render(
      <Table dataSource={[data[0]]} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('handles single column', () => {
    const { container } = render(
      <Table dataSource={data} columns={[columns[0]] as any} rowKey="key" />,
    );
    expect(container.querySelectorAll('th')).toHaveLength(1);
    expect(container.querySelectorAll('tbody td')).toHaveLength(3);
  });

  it('handles no columns', () => {
    const { container } = render(
      <Table dataSource={data} columns={[]} rowKey="key" />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('handles column with no dataIndex', () => {
    const cols = [{ title: 'Action', key: 'action', render: () => 'Delete' }];
    const { container } = render(
      <Table dataSource={data} columns={cols as any} rowKey="key" />,
    );
    const tds = container.querySelectorAll('tbody td');
    expect(tds[0]).toHaveTextContent('Delete');
  });

  it('handles column with array dataIndex', () => {
    const nestedData = [
      { key: '1', user: { name: 'Nested Alice', age: 20 } },
    ];
    const cols = [
      { title: 'Name', dataIndex: ['user', 'name'], key: 'name' },
      { title: 'Age', dataIndex: ['user', 'age'], key: 'age' },
    ];
    render(
      <Table dataSource={nestedData} columns={cols as any} rowKey="key" />,
    );
    expect(screen.getByText('Nested Alice')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('handles data with duplicate keys', () => {
    const dupData = [
      { key: '1', name: 'First' },
      { key: '1', name: 'Second' },
    ];
    const { container } = render(
      <Table dataSource={dupData} columns={[{ title: 'Name', dataIndex: 'name', key: 'name' }] as any} rowKey="key" />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('handles very long text content', () => {
    const longData = [
      { key: '1', name: 'A'.repeat(1000), age: 1 },
    ];
    const { container } = render(
      <Table dataSource={longData} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelector('tbody td')).toHaveTextContent('A'.repeat(1000));
  });
});
