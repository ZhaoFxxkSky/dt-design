import * as React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Table } from '../index';
import useExpand from '../features/expand/useExpand';
import useFlattenRecords from '../features/virtual/useFlattenRecords';
import { renderHook } from '@testing-library/react-hooks';

const flatData = [
  { key: '1', name: 'Alice', age: 30 },
  { key: '2', name: 'Bob', age: 25 },
  { key: '3', name: 'Charlie', age: 35 },
];

const treeData = [
  {
    key: '1',
    name: 'Parent 1',
    age: 50,
    children: [
      { key: '1-1', name: 'Child 1-1', age: 20 },
      { key: '1-2', name: 'Child 1-2', age: 22 },
    ],
  },
  {
    key: '2',
    name: 'Parent 2',
    age: 60,
    children: [{ key: '2-1', name: 'Child 2-1', age: 30 }],
  },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
];

// ============================================================
// ExpandTable — useExpand Hook (comprehensive)
// ============================================================
describe('useExpand Hook — comprehensive', () => {
  it('returns false type when no expand config', () => {
    const { result } = renderHook(() =>
      useExpand({ data: flatData } as any, flatData, (r: any) => r.key),
    );
    expect(result.current[1]).toBe(false);
  });

  it('returns "row" type when expandedRowRender is provided', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div /> }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    expect(result.current[1]).toBe('row');
  });

  it('returns "nest" type when data has children', () => {
    const { result } = renderHook(() =>
      useExpand({ data: treeData } as any, treeData, (r: any) => r.key),
    );
    expect(result.current[1]).toBe('nest');
  });

  it('initializes with defaultExpandAllRows', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div />, defaultExpandAllRows: true }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    expect(result.current[2].has('1')).toBe(true);
    expect(result.current[2].has('2')).toBe(true);
    expect(result.current[2].has('3')).toBe(true);
  });

  it('initializes with defaultExpandedRowKeys', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div />, defaultExpandedRowKeys: ['1', '3'] }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    expect(result.current[2].has('1')).toBe(true);
    expect(result.current[2].has('2')).toBe(false);
    expect(result.current[2].has('3')).toBe(true);
  });

  it('uses controlled expandedRowKeys', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div />, expandedRowKeys: ['2'] }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    expect(result.current[2].has('1')).toBe(false);
    expect(result.current[2].has('2')).toBe(true);
  });

  it('toggles expansion', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div /> }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    act(() => {
      result.current[5]({ record: flatData[0], e: null as any });
    });
    expect(result.current[2].has('1')).toBe(true);

    act(() => {
      result.current[5]({ record: flatData[0], e: null as any });
    });
    expect(result.current[2].has('1')).toBe(false);
  });

  it('calls onExpand callback', () => {
    const onExpand = jest.fn();
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div />, onExpand }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    act(() => {
      result.current[5]({ record: flatData[1], e: null as any });
    });
    expect(onExpand).toHaveBeenCalledWith(true, flatData[1]);
  });

  it('calls onExpandedRowsChange', () => {
    const onExpandedRowsChange = jest.fn();
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div />, onExpandedRowsChange }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    act(() => {
      result.current[5]({ record: flatData[0], e: null as any });
    });
    expect(onExpandedRowsChange).toHaveBeenCalledWith(['1']);
  });

  it('does not update inner keys when controlled', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div />, expandedRowKeys: [] }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    act(() => {
      result.current[5]({ record: flatData[0], e: null as any });
    });
    expect(result.current[2].has('1')).toBe(false);
  });

  it('uses custom childrenColumnName', () => {
    const customData = [{ id: 1, subItems: [{ id: 2 }] }];
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { childrenColumnName: 'subItems' }, data: customData } as any,
        customData,
        (r: any) => r.id,
      ),
    );
    expect(result.current[1]).toBe('nest');
    expect(result.current[4]).toBe('subItems');
  });

  it('renders default expand icon correctly', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div /> }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    const iconFn = result.current[3];
    const { container: expandedContainer } = render(
      <div>{iconFn({ prefixCls: 'ant-table', expanded: true, expandable: true, record: flatData[0], onExpand: jest.fn() })}</div>,
    );
    expect(expandedContainer.querySelector('.ant-table-row-expand-icon-expanded')).toBeInTheDocument();

    const { container: collapsedContainer } = render(
      <div>{iconFn({ prefixCls: 'ant-table', expanded: false, expandable: true, record: flatData[0], onExpand: jest.fn() })}</div>,
    );
    expect(collapsedContainer.querySelector('.ant-table-row-expand-icon-collapsed')).toBeInTheDocument();
  });

  it('returns null icon when not expandable', () => {
    const { result } = renderHook(() =>
      useExpand(
        { expandable: { expandedRowRender: () => <div /> }, data: flatData } as any,
        flatData,
        (r: any) => r.key,
      ),
    );
    const icon = result.current[3]({
      prefixCls: 'ant-table',
      expanded: false,
      expandable: false,
      record: flatData[0],
      onExpand: jest.fn(),
    });
    expect(icon).toBeNull();
  });
});

// ============================================================
// ExpandTable — useFlattenRecords Hook
// ============================================================
describe('useFlattenRecords Hook — comprehensive', () => {
  it('flattens flat data (no children)', () => {
    const { result } = renderHook(() =>
      useFlattenRecords(flatData, 'children', (r: any) => r.key, new Set()),
    );
    expect(result.current).toHaveLength(3);
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].indent).toBe(0);
  });

  it('does not flatten children when not expanded', () => {
    const { result } = renderHook(() =>
      useFlattenRecords(treeData, 'children', (r: any) => r.key, new Set()),
    );
    expect(result.current).toHaveLength(2); // only parents
  });

  it('flattens children when expanded', () => {
    const { result } = renderHook(() =>
      useFlattenRecords(treeData, 'children', (r: any) => r.key, new Set(['1'])),
    );
    expect(result.current).toHaveLength(4); // parent 1 + 2 children + parent 2
    expect(result.current[0].record.key).toBe('1');
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].record.key).toBe('1-1');
    expect(result.current[1].indent).toBe(1);
    expect(result.current[2].record.key).toBe('1-2');
    expect(result.current[2].indent).toBe(1);
    expect(result.current[3].record.key).toBe('2');
    expect(result.current[3].indent).toBe(0);
  });

  it('flattens deeply nested children', () => {
    const deepData = [
      {
        key: '1',
        name: 'Root',
        children: [
          {
            key: '2',
            name: 'Level 1',
            children: [{ key: '3', name: 'Level 2' }],
          },
        ],
      },
    ];
    const { result } = renderHook(() =>
      useFlattenRecords(deepData, 'children', (r: any) => r.key, new Set(['1', '2'])),
    );
    expect(result.current).toHaveLength(3);
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].indent).toBe(1);
    expect(result.current[2].indent).toBe(2);
  });

  it('handles empty data', () => {
    const { result } = renderHook(() =>
      useFlattenRecords([], 'children', (r: any) => r.key, new Set()),
    );
    expect(result.current).toEqual([]);
  });

  it('handles custom childrenColumnName', () => {
    const customData = [
      { id: 1, subItems: [{ id: 2, subItems: [] }] },
    ];
    const { result } = renderHook(() =>
      useFlattenRecords(customData, 'subItems', (r: any) => r.id, new Set([1])),
    );
    expect(result.current).toHaveLength(2);
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].indent).toBe(1);
  });

  it('increments index correctly', () => {
    const { result } = renderHook(() =>
      useFlattenRecords(treeData, 'children', (r: any) => r.key, new Set(['1'])),
    );
    expect(result.current[0].index).toBe(0);
    expect(result.current[1].index).toBe(1);
    expect(result.current[2].index).toBe(2);
    expect(result.current[3].index).toBe(3);
  });
});

// ============================================================
// ExpandTable — Table integration with expandable (row type)
// ============================================================
describe('ExpandTable — row expansion (expandedRowRender)', () => {
  it('renders expand icon for expandable rows', () => {
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div>Expanded: {record.name}</div>,
        }}
      />,
    );
    const expandIcons = container.querySelectorAll('.ant-table-row-expand-icon');
    expect(expandIcons.length).toBeGreaterThan(0);
  });

  it('shows expanded content when icon is clicked', () => {
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid="expanded-content">Expanded: {record.name}</div>,
        }}
      />,
    );
    // Initially no expanded content
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();

    // Click first expand icon
    const expandIcons = container.querySelectorAll('.ant-table-row-expand-icon');
    fireEvent.click(expandIcons[0]);

    // Should now show expanded content
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
    expect(screen.getByTestId('expanded-content')).toHaveTextContent('Expanded: Alice');
  });

  it('collapses expanded row when icon is clicked again', () => {
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid="expanded-content">Expanded: {record.name}</div>,
        }}
      />,
    );
    const expandIcon = container.querySelectorAll('.ant-table-row-expand-icon')[0];

    // Expand
    fireEvent.click(expandIcon);
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();

    // Collapse
    fireEvent.click(expandIcon);
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
  });

  it('supports defaultExpandAllRows', () => {
    render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid={`expanded-${record.key}`}>Expanded: {record.name}</div>,
          defaultExpandAllRows: true,
        }}
      />,
    );
    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();
    expect(screen.getByTestId('expanded-2')).toBeInTheDocument();
    expect(screen.getByTestId('expanded-3')).toBeInTheDocument();
  });

  it('supports defaultExpandedRowKeys', () => {
    render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid={`expanded-${record.key}`}>Expanded</div>,
          defaultExpandedRowKeys: ['2'],
        }}
      />,
    );
    expect(screen.queryByTestId('expanded-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('expanded-2')).toBeInTheDocument();
    expect(screen.queryByTestId('expanded-3')).not.toBeInTheDocument();
  });

  it('supports controlled expandedRowKeys', () => {
    const { rerender } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid={`expanded-${record.key}`}>Expanded</div>,
          expandedRowKeys: ['1'],
        }}
      />,
    );
    expect(screen.getByTestId('expanded-1')).toBeInTheDocument();
    expect(screen.queryByTestId('expanded-2')).not.toBeInTheDocument();

    // Update controlled keys
    rerender(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid={`expanded-${record.key}`}>Expanded</div>,
          expandedRowKeys: ['2', '3'],
        }}
      />,
    );
    expect(screen.queryByTestId('expanded-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('expanded-2')).toBeInTheDocument();
    expect(screen.getByTestId('expanded-3')).toBeInTheDocument();
  });

  it('calls onExpand when toggling', () => {
    const onExpand = jest.fn();
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: () => <div />,
          onExpand,
        }}
      />,
    );
    const expandIcon = container.querySelectorAll('.ant-table-row-expand-icon')[0];
    fireEvent.click(expandIcon);
    expect(onExpand).toHaveBeenCalledWith(true, flatData[0]);
  });

  it('calls onExpandedRowsChange when keys change', () => {
    const onExpandedRowsChange = jest.fn();
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: () => <div />,
          onExpandedRowsChange,
        }}
      />,
    );
    const expandIcon = container.querySelectorAll('.ant-table-row-expand-icon')[0];
    fireEvent.click(expandIcon);
    expect(onExpandedRowsChange).toHaveBeenCalledWith(['1']);
  });

  it('does not show expand icon when rowExpandable returns false', () => {
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: () => <div />,
          rowExpandable: (record) => record.age > 28,
        }}
      />,
    );
    const expandIcons = container.querySelectorAll('.ant-table-row-expand-icon');
    // Alice (30) and Charlie (35) should be expandable, Bob (25) should not
    expect(expandIcons.length).toBe(2);
  });
});

// ============================================================
// ExpandTable — tree data (nest type)
// ============================================================
describe('ExpandTable — tree data (nest)', () => {
  it('renders parent rows by default', () => {
    render(
      <Table data={treeData} columns={columns as any} rowKey="key" />,
    );
    expect(screen.getByText('Parent 1')).toBeInTheDocument();
    expect(screen.getByText('Parent 2')).toBeInTheDocument();
    // Children should not be visible initially
    expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();
  });

  it('expands tree node to show children', () => {
    const { container } = render(
      <Table data={treeData} columns={columns as any} rowKey="key" />,
    );
    // Children not visible initially
    expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();

    // Click expand icon on first parent
    const expandIcons = container.querySelectorAll('.ant-table-row-expand-icon');
    if (expandIcons.length > 0) {
      fireEvent.click(expandIcons[0]);
      expect(screen.getByText('Child 1-1')).toBeInTheDocument();
      expect(screen.getByText('Child 1-2')).toBeInTheDocument();
    }
  });

  it('supports defaultExpandAllRows for tree data', () => {
    render(
      <Table
        data={treeData}
        columns={columns as any}
        rowKey="key"
        expandable={{ defaultExpandAllRows: true }}
      />,
    );
    expect(screen.getByText('Parent 1')).toBeInTheDocument();
    expect(screen.getByText('Child 1-1')).toBeInTheDocument();
    expect(screen.getByText('Child 1-2')).toBeInTheDocument();
    expect(screen.getByText('Parent 2')).toBeInTheDocument();
    expect(screen.getByText('Child 2-1')).toBeInTheDocument();
  });

  it('supports defaultExpandedRowKeys for tree data', () => {
    render(
      <Table
        data={treeData}
        columns={columns as any}
        rowKey="key"
        expandable={{ defaultExpandedRowKeys: ['2'] }}
      />,
    );
    // Parent 1 children not visible
    expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();
    // Parent 2 children visible
    expect(screen.getByText('Child 2-1')).toBeInTheDocument();
  });

  it('collapses tree node', () => {
    const { container } = render(
      <Table
        data={treeData}
        columns={columns as any}
        rowKey="key"
        expandable={{ defaultExpandAllRows: true }}
      />,
    );
    // All visible initially
    expect(screen.getByText('Child 1-1')).toBeInTheDocument();

    // Click to collapse first parent
    const expandIcons = container.querySelectorAll('.ant-table-row-expand-icon');
    if (expandIcons.length > 0) {
      fireEvent.click(expandIcons[0]);
      expect(screen.queryByText('Child 1-1')).not.toBeInTheDocument();
    }
  });
});

// ============================================================
// ExpandTable — expandRowByClick
// ============================================================
describe('ExpandTable — expandRowByClick', () => {
  it('expands row when row is clicked', () => {
    const { container } = render(
      <Table
        data={flatData}
        columns={columns as any}
        rowKey="key"
        expandable={{
          expandedRowRender: (record) => <div data-testid="expanded">Expanded: {record.name}</div>,
          expandRowByClick: true,
        }}
      />,
    );
    expect(screen.queryByTestId('expanded')).not.toBeInTheDocument();

    const rows = container.querySelectorAll('tbody tr');
    fireEvent.click(rows[0]);
    expect(screen.getByTestId('expanded')).toBeInTheDocument();
  });
});
