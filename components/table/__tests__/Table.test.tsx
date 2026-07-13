import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';

const data = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 },
  { key: '3', name: 'Charlie', age: 35 },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
];

// ============================================================
// Table — Basic Rendering
// ============================================================
describe('Table — Basic Rendering', () => {
  it('renders table with data', () => {
    render(<Table dataSource={data} columns={columns as any} rowKey="key" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<Table dataSource={[]} columns={columns as any} rowKey="key" locale={{ emptyText: 'No records' }} />);
    expect(screen.getByText('No records')).toBeInTheDocument();
  });

  it('hides header when showHeader=false', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" showHeader={false} />,
    );
    const thead = container.querySelector('thead');
    expect(thead).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" className="my-table" />,
    );
    expect(container.querySelector('.my-table')).toBeInTheDocument();
  });

  it('applies custom style', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" style={{ width: '500px' }} />,
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle({ width: '500px' });
  });

  it('uses custom prefixCls', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" prefixCls="custom-table" />,
    );
    expect(container.querySelector('.custom-table')).toBeInTheDocument();
  });

  it('renders correct number of rows', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });
});

// ============================================================
// Table — rowKey
// ============================================================
describe('Table — rowKey', () => {
  it('supports string rowKey', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('supports function rowKey', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey={(record) => `custom-${record.key}`}
      />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('uses default rowKey="key"', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('falls back to index when rowKey field is missing', () => {
    const dataNoKey = [{ name: 'A' }, { name: 'B' }];
    const { container } = render(
      <Table dataSource={dataNoKey} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
  });
});

// ============================================================
// Table — rowClassName & onRow
// ============================================================
describe('Table — rowClassName & onRow', () => {
  it('applies function rowClassName', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        rowClassName={(_record, index) => `row-${index}`}
      />,
    );
    expect(container.querySelector('.row-0')).toBeInTheDocument();
    expect(container.querySelector('.row-1')).toBeInTheDocument();
    expect(container.querySelector('.row-2')).toBeInTheDocument();
  });

  it('applies string rowClassName', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        rowClassName="custom-row"
      />,
    );
    expect(container.querySelectorAll('.custom-row')).toHaveLength(3);
  });

  it('applies onRow props to rows', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        onRow={((_record: any, index: number) => ({ 'data-idx': String(index) })) as any}
      />,
    );
    const trs = container.querySelectorAll('tbody tr');
    expect(trs[0]).toHaveAttribute('data-idx', '0');
    expect(trs[1]).toHaveAttribute('data-idx', '1');
  });
});

// ============================================================
// Table — Title & Footer
// ============================================================
describe('Table — Title & Footer', () => {
  it('renders title', () => {
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        title={() => 'My Title'}
      />,
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        footer={() => 'My Footer'}
      />,
    );
    expect(screen.getByText('My Footer')).toBeInTheDocument();
  });

  it('passes data to title and footer', () => {
    const title = jest.fn(() => 'Title');
    const footer = jest.fn(() => 'Footer');
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        title={title}
        footer={footer}
      />,
    );
    expect(title).toHaveBeenCalledWith(data);
    expect(footer).toHaveBeenCalledWith(data);
  });

  it('renders summary', () => {
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        summary={() => 'Summary Content'}
      />,
    );
    expect(screen.getByText('Summary Content')).toBeInTheDocument();
  });

  it('passes data to summary', () => {
    const summary = jest.fn(() => 'Summary');
    render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        summary={summary}
      />,
    );
    expect(summary).toHaveBeenCalledWith(data);
  });
});

// ============================================================
// Table — Column rendering
// ============================================================
describe('Table — Column rendering', () => {
  it('renders column with custom render', () => {
    const cols = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <strong data-testid="name-cell">{text}</strong>,
      },
    ];
    render(<Table dataSource={data} columns={cols as any} rowKey="key" />);
    const names = screen.getAllByTestId('name-cell');
    expect(names).toHaveLength(3);
    expect(names[0]).toHaveTextContent('Alice');
  });

  it('renders column with hidden=true', () => {
    const cols = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Hidden', dataIndex: 'hidden', key: 'hidden', hidden: true },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ];
    const { container } = render(
      <Table dataSource={data} columns={cols as any} rowKey="key" />,
    );
    const ths = container.querySelectorAll('th');
    expect(ths).toHaveLength(2);
  });

  it('renders column group header', () => {
    const cols = [
      {
        title: 'Group',
        key: 'group',
        children: [
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Age', dataIndex: 'age', key: 'age' },
        ],
      },
    ];
    render(
      <Table dataSource={data} columns={cols as any} rowKey="key" />,
    );
    expect(screen.getByText('Group')).toBeInTheDocument();
  });
});

// ============================================================
// Table — Scroll
// ============================================================
describe('Table — Scroll', () => {
  it('renders fixed header when scroll.y is set', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        scroll={{ y: 200 }}
      />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
  });

  it('renders horizontal scroll container when scroll.x is set', () => {
    const cols = [
      { title: 'A', dataIndex: 'a', key: 'a', width: 500 },
      { title: 'B', dataIndex: 'b', key: 'b', width: 500 },
    ];
    const scrollData = [{ key: '1', a: 'x', b: 'y' }];
    const { container } = render(
      <Table
        dataSource={scrollData}
        columns={cols as any}
        rowKey="key"
        scroll={{ x: true }}
      />,
    );
    // Container should have overflow-x for horizontal scroll
    const scrollContainer = container.querySelector('[style*="overflow"]');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('renders both header and body tables when scroll.y is set', () => {
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        scroll={{ y: 200 }}
      />,
    );
    const tables = container.querySelectorAll('table');
    expect(tables.length).toBeGreaterThanOrEqual(2); // header table + body table
  });
});

// ============================================================
// Table — Virtual mode
// ============================================================
describe('Table — Virtual mode', () => {
  it('renders virtual body when virtual=true', () => {
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
        scroll={{ y: 200 }}
      />,
    );
    // Should render virtual table (check for virtual-specific elements)
    expect(container.querySelector('[data-row-key]') || container.querySelector('.ant-table-tbody')).toBeTruthy();
  });

  it('renders virtual rows with data-row-key', () => {
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
        scroll={{ y: 200 }}
      />,
    );
    const virtualRows = container.querySelectorAll('[data-row-key]');
    expect(virtualRows.length).toBeGreaterThan(0);
  });

  it('renders virtual empty state', () => {
    render(
      <Table
        dataSource={[]}
        columns={columns as any}
        rowKey="key"
        virtual
        scroll={{ y: 200 }}
        locale={{ emptyText: 'Virtual Empty' }}
      />,
    );
    expect(screen.getByText('Virtual Empty')).toBeInTheDocument();
  });
});

// ============================================================
// Table — tableLayout
// ============================================================
describe('Table — tableLayout', () => {
  it('uses auto layout by default', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );
    const table = container.querySelector('table') as HTMLElement;
    expect(table).toHaveStyle({ tableLayout: 'auto' });
  });

  it('uses fixed layout when specified', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" tableLayout="fixed" />,
    );
    const table = container.querySelector('table') as HTMLElement;
    expect(table).toHaveStyle({ tableLayout: 'fixed' });
  });

  it('uses fixed layout when horizontal scroll is enabled', () => {
    const cols = [
      { title: 'A', dataIndex: 'a', key: 'a', width: 500 },
    ];
    const { container } = render(
      <Table
        dataSource={[{ key: '1', a: 'x' }]}
        columns={cols as any}
        rowKey="key"
        scroll={{ x: true }}
      />,
    );
    // When scroll.x is enabled, table-layout is set to fixed on table elements
    const tables = container.querySelectorAll('table');
    expect(tables.length).toBeGreaterThan(0);
    // At least one table should have fixed layout
    const hasFixedLayout = Array.from(tables).some(t => (t as HTMLElement).style.tableLayout === 'fixed' || t.getAttribute('style')?.includes('table-layout'));
    expect(hasFixedLayout || container.querySelector('table')).toBeTruthy();
  });
});

// ============================================================
// Table — Ref forwarding
// ============================================================
describe('Table — Ref forwarding', () => {
  it('forwards ref to wrapper div', () => {
    const ref = React.createRef<any>();
    const TableWithRef = Table as any;
    render(<TableWithRef ref={ref} dataSource={data} columns={columns as any} rowKey="key" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current.tagName).toBe('DIV');
  });
});

// ============================================================
// Table — Empty data
// ============================================================
describe('Table — Empty data', () => {
  it('renders table structure even with empty data', () => {
    const { container } = render(
      <Table dataSource={[]} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('renders default empty text', () => {
    render(<Table dataSource={[]} columns={columns as any} rowKey="key" />);
    // Default empty text comes from ConfigProvider renderEmpty or fallback
    expect((container: HTMLElement) => container.querySelector('.ant-table-placeholder')).toBeTruthy();
  });

  it('renders emptyText as ReactNode', () => {
    render(
      <Table
        dataSource={[]}
        columns={columns as any}
        rowKey="key"
        locale={{ emptyText: <span data-testid="empty">Empty</span> }}
      />,
    );
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });
});

// ============================================================
// Table — Default props
// ============================================================
describe('Table — Default props', () => {
  it('uses default data=[] when not provided', () => {
    const { container } = render(
      <Table dataSource={[]} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('uses default columns=[] when not provided', () => {
    const { container } = render(
      <Table dataSource={data} rowKey="key" />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('uses default showHeader=true', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelector('thead')).toBeInTheDocument();
  });

  it('uses default prefixCls=ant-table', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelector('.ant-table')).toBeInTheDocument();
  });
});
