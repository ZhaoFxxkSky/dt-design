import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';
import useSticky from '../features/sticky/useSticky';
import { renderHook } from '@testing-library/react-hooks';

const data = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 },
  { key: '3', name: 'Charlie', age: 35 },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
];

// ============================================================
// StickyTable — useSticky Hook comprehensive
// ============================================================
describe('useSticky Hook — comprehensive', () => {
  it('returns isSticky=false for undefined', () => {
    const { result } = renderHook(() => useSticky(undefined, 'ant-table'));
    expect(result.current.isSticky).toBe(false);
    expect(result.current.offsetHeader).toBe(0);
    expect(result.current.offsetSummary).toBe(0);
    expect(result.current.offsetScroll).toBe(0);
    expect(result.current.stickyClassName).toBe('');
  });

  it('returns isSticky=false for false', () => {
    const { result } = renderHook(() => useSticky(false, 'ant-table'));
    expect(result.current.isSticky).toBe(false);
  });

  it('returns isSticky=true for true', () => {
    const { result } = renderHook(() => useSticky(true, 'ant-table'));
    expect(result.current.isSticky).toBe(true);
    expect(result.current.stickyClassName).toBe('ant-table-sticky');
    expect(result.current.offsetHeader).toBe(0);
    expect(result.current.offsetSummary).toBe(0);
    expect(result.current.offsetScroll).toBe(0);
  });

  it('returns isSticky=true for object config', () => {
    const { result } = renderHook(() =>
      useSticky({ offsetHeader: 10, offsetSummary: 20, offsetScroll: 5 }, 'ant-table'),
    );
    expect(result.current.isSticky).toBe(true);
    expect(result.current.offsetHeader).toBe(10);
    expect(result.current.offsetSummary).toBe(20);
    expect(result.current.offsetScroll).toBe(5);
    expect(result.current.stickyClassName).toContain('sticky');
  });

  it('handles partial config', () => {
    const { result } = renderHook(() => useSticky({ offsetHeader: 50 }, 'ant-table'));
    expect(result.current.isSticky).toBe(true);
    expect(result.current.offsetHeader).toBe(50);
    expect(result.current.offsetSummary).toBe(0);
    expect(result.current.offsetScroll).toBe(0);
  });

  it('uses custom prefixCls in className', () => {
    const { result } = renderHook(() => useSticky(true, 'custom-prefix'));
    expect(result.current.stickyClassName).toBe('custom-prefix-sticky');
  });

  it('returns container ref', () => {
    const { result } = renderHook(() => useSticky(true, 'ant-table'));
    expect(result.current.container).toBeDefined();
    expect(result.current.container.current).toBeNull();
  });

  it('is memoized', () => {
    const { result, rerender } = renderHook(() => useSticky(true, 'ant-table'));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

// ============================================================
// StickyTable — Table integration
// ============================================================
describe('StickyTable — Table integration', () => {
  it('renders with sticky=true', () => {
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" sticky />,
    );
    expect(container.querySelector('.ant-table')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-sticky')).toBeInTheDocument();
  });

  it('renders with sticky object config', () => {
    const { container } = render(
      <Table
        data={data}
        columns={columns as any}
        rowKey="key"
        sticky={{ offsetHeader: 50, offsetSummary: 10, offsetScroll: 5 }}
      />,
    );
    expect(container.querySelector('.ant-table-sticky')).toBeInTheDocument();
  });

  it('does not add sticky class when sticky is not set', () => {
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" />,
    );
    expect(container.querySelector('.ant-table-sticky')).not.toBeInTheDocument();
  });

  it('renders with sticky and scroll.y together', () => {
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" sticky scroll={{ y: 200 }} />,
    );
    expect(container.querySelector('.ant-table-sticky')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-body')).toBeInTheDocument();
  });

  it('renders data correctly with sticky', () => {
    render(
      <Table data={data} columns={columns as any} rowKey="key" sticky />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders with sticky=false (no sticky class)', () => {
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" sticky={false} />,
    );
    expect(container.querySelector('.ant-table-sticky')).not.toBeInTheDocument();
  });

  it('uses FixedHolder when sticky is enabled', () => {
    const { container } = render(
      <Table data={data} columns={columns as any} rowKey="key" sticky scroll={{ y: 200 }} />,
    );
    // FixedHolder renders with sticky positioning
    const stickyHeader = container.querySelector('[style*="sticky"]');
    expect(stickyHeader).toBeInTheDocument();
  });

  it('renders with sticky and title/footer', () => {
    render(
      <Table
        data={data}
        columns={columns as any}
        rowKey="key"
        sticky
        title={() => 'Sticky Title'}
        footer={() => 'Sticky Footer'}
      />,
    );
    expect(screen.getByText('Sticky Title')).toBeInTheDocument();
    expect(screen.getByText('Sticky Footer')).toBeInTheDocument();
  });

  it('renders with sticky and summary', () => {
    render(
      <Table
        data={data}
        columns={columns as any}
        rowKey="key"
        sticky
        summary={() => <div data-testid="sticky-summary">Summary</div>}
      />,
    );
    expect(screen.getByTestId('sticky-summary')).toBeInTheDocument();
  });

  it('renders with sticky and virtual mode', () => {
    const largeData = Array.from({ length: 50 }, (_, i) => ({
      key: i,
      name: `Row ${i}`,
      age: i,
    }));
    const { container } = render(
      <Table data={largeData} columns={columns as any} rowKey="key" sticky scroll={{ y: 200 }} virtual />,
    );
    expect(container.querySelector('.ant-table-sticky')).toBeInTheDocument();
    expect(container.querySelector('.ant-table-virtual-list')).toBeInTheDocument();
  });

  it('renders empty state with sticky', () => {
    render(
      <Table data={[]} columns={columns as any} rowKey="key" sticky emptyText="Sticky empty" />,
    );
    expect(screen.getByText('Sticky empty')).toBeInTheDocument();
  });
});
