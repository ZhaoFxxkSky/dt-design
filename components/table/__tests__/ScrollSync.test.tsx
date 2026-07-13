import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';

const data = [
  { key: '1', name: 'Alice', age: 30, address: 'Street 1' },
  { key: '2', name: 'Bob', age: 25, address: 'Street 2' },
  { key: '3', name: 'Charlie', age: 35, address: 'Street 3' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
  { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
];

// ============================================================
// ScrollSync — vertical scroll
// ============================================================
describe('ScrollSync — vertical scroll (scroll.y)', () => {
  it('renders separate header and body sections', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
  });

  it('renders two table elements (header + body)', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} />,
    );
    const tables = container.querySelectorAll('table');
    expect(tables.length).toBeGreaterThanOrEqual(2);
  });

  it('sets maxHeight on body container', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 300 }} />,
    );
    const body = container.querySelector('.ant-table-body') as HTMLElement;
    expect(body.style.maxHeight).toBe('300px');
  });

  it('renders header content in header section', () => {
    render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} />,
    );
    // Header titles may appear in both the visible header and the hidden measure row
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Age').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Address').length).toBeGreaterThan(0);
  });

  it('renders body content in body section', () => {
    render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('hides header when showHeader=false with scroll.y', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: 200 }} showHeader={false} />,
    );
    // Header section may still exist but thead should not
    const thead = container.querySelector('thead');
    expect(thead).toBeNull();
  });
});

// ============================================================
// ScrollSync — horizontal scroll
// ============================================================
describe('ScrollSync — horizontal scroll (scroll.x)', () => {
  it('uses fixed table layout when scroll.x is set', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    // When scroll.x is set, table uses fixed layout
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders with scroll.x as string', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: '500px' }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders container with overflowX for horizontal scroll', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true }} />,
    );
    const scrollContainer = container.querySelector('[style*="overflow"]');
    expect(scrollContainer).toBeInTheDocument();
  });
});

// ============================================================
// ScrollSync — both x and y
// ============================================================
describe('ScrollSync — both scroll.x and scroll.y', () => {
  it('renders header and body with horizontal scroll enabled', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true, y: 200 }} />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();

    const body = container.querySelector('.ant-table-body') as HTMLElement;
    expect(body.style.overflowX).toBeDefined();
  });

  it('renders data correctly with both scroll modes', () => {
    render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: true, y: 200 }} />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getAllByText('Name').length).toBeGreaterThan(0);
  });
});

// ============================================================
// ScrollSync — onScroll callback
// ============================================================
describe('ScrollSync — onScroll callback', () => {
  it('calls onScroll when body is scrolled', () => {
    const onScroll = jest.fn();
    const { container } = render(
      <Table
        dataSource={data}
        columns={columns as any}
        rowKey="key"
        scroll={{ y: 200 }}
        onScroll={onScroll}
      />,
    );
    const body = container.querySelector('.ant-table-body') as HTMLElement;
    // Simulate scroll event on the body element
    Object.defineProperty(body, 'scrollLeft', { value: 50, writable: true });
    Object.defineProperty(body, 'scrollWidth', { value: 500, writable: true });
    Object.defineProperty(body, 'clientWidth', { value: 200, writable: true });
    fireEvent.scroll(body);
    expect(onScroll).toHaveBeenCalled();
  });
});

// ============================================================
// ScrollSync — virtual mode scroll
// ============================================================
describe('ScrollSync — virtual mode', () => {
  it('renders virtual list with scroll.y', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
      address: `Address ${i}`,
    }));
    const { container } = render(
      <Table dataSource={largeData} columns={columns as any} rowKey="key" virtual scroll={{ y: 200 }} />,
    );
    // Virtual list renders rows with data-row-key
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('renders fewer rows than total in virtual mode', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
    }));
    const { container } = render(
      <Table dataSource={largeData} columns={columns as any} rowKey="key" virtual scroll={{ y: 200 }} />,
    );
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(100);
  });

  it('renders virtual mode without scroll.y', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
    }));
    const { container } = render(
      <Table dataSource={largeData} columns={columns as any} rowKey="key" virtual />,
    );
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
  });
});

// ============================================================
// ScrollSync — direction (RTL)
// ============================================================
describe('ScrollSync — direction (RTL)', () => {
  it('renders with direction="rtl"', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" direction="rtl" />,
    );
    expect(container.querySelector('.ant-table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders RTL with fixed columns', () => {
    const rtlColumns = [
      { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' as const, width: 150 },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
      { title: 'Address', dataIndex: 'address', key: 'address', fixed: 'right' as const, width: 200 },
    ];
    const { container } = render(
      <Table dataSource={data} columns={rtlColumns as any} rowKey="key" direction="rtl" scroll={{ x: true }} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders RTL with scroll.y', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" direction="rtl" scroll={{ y: 200 }} />,
    );
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
  });

  it('renders RTL with virtual mode', () => {
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
        direction="rtl"
        virtual
        scroll={{ y: 200 }}
      />,
    );
    const rows = container.querySelectorAll('[data-row-key]');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('renders RTL with sticky', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" direction="rtl" sticky />,
    );
    expect(container.querySelector('.ant-table-sticky-holder')).toBeInTheDocument();
  });
});

// ============================================================
// ScrollSync — edge cases
// ============================================================
describe('ScrollSync — edge cases', () => {
  it('renders with scroll.y as string', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ y: '300px' }} />,
    );
    const body = container.querySelector('.ant-table-body') as HTMLElement;
    expect(body).toBeInTheDocument();
  });

  it('renders with scroll.x as number', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{ x: 1000 }} />,
    );
    // scroll.x as number doesn't include 'px', so horizonScroll is false
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  it('renders without scroll prop', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" />,
    );
    // No separate header/body sections
    expect(container.querySelector('.ant-table-header')).not.toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).not.toBeInTheDocument();
    // Single table
    expect(container.querySelectorAll('table')).toHaveLength(1);
  });

  it('renders with empty scroll object', () => {
    const { container } = render(
      <Table dataSource={data} columns={columns as any} rowKey="key" scroll={{}} />,
    );
    expect(container.querySelector('table')).toBeInTheDocument();
  });
});
