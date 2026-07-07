import { renderHook } from '@testing-library/react-hooks';

import '@testing-library/jest-dom/extend-expect';

import useColumns from '../features/columns/useColumns';

// ============================================================
// useColumns
// ============================================================
describe('useColumns', () => {
  it('returns flatten columns', () => {
    const columns = [
      { title: 'A', dataIndex: 'a', key: 'a' },
      { title: 'B', dataIndex: 'b', key: 'b' },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[1]).toHaveLength(2);
    expect((result.current[1] as any)[0].dataIndex).toBe('a');
  });

  it('flattens column groups', () => {
    const columns = [
      {
        title: 'Group',
        children: [
          { title: 'A', dataIndex: 'a', key: 'a' },
          { title: 'B', dataIndex: 'b', key: 'b' },
        ],
      },
      { title: 'C', dataIndex: 'c', key: 'c' },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[1]).toHaveLength(3);
  });

  it('filters hidden columns', () => {
    const columns = [
      { title: 'A', dataIndex: 'a', key: 'a' },
      { title: 'Hidden', dataIndex: 'b', key: 'b', hidden: true },
      { title: 'C', dataIndex: 'c', key: 'c' },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[1]).toHaveLength(2);
    expect((result.current[1] as any)[0].key).toBe('a');
    expect((result.current[1] as any)[1].key).toBe('c');
  });

  it('returns empty array when columns is undefined', () => {
    const { result } = renderHook(() => useColumns({} as any, undefined));
    expect(result.current[0]).toEqual([]);
    expect(result.current[1]).toEqual([]);
  });

  it('returns original columns as first element', () => {
    const columns = [
      { title: 'A', dataIndex: 'a', key: 'a' },
      { title: 'B', dataIndex: 'b', key: 'b' },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[0]).toBe(columns);
  });

  it('applies transformColumns when provided', () => {
    const columns = [
      { title: 'A', dataIndex: 'a', key: 'a' },
      { title: 'B', dataIndex: 'b', key: 'b' },
    ];
    const transform = (cols: any) => [
      ...cols,
      { title: 'C', dataIndex: 'c', key: 'c' },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, transform));
    expect(result.current[0]).toHaveLength(3);
    expect(result.current[1]).toHaveLength(3);
  });

  it('handles deeply nested column groups', () => {
    const columns = [
      {
        title: 'L1',
        children: [
          {
            title: 'L2-A',
            children: [
              { title: 'L3-A', dataIndex: 'a', key: 'a' },
              { title: 'L3-B', dataIndex: 'b', key: 'b' },
            ],
          },
          { title: 'L2-B', dataIndex: 'c', key: 'c' },
        ],
      },
      { title: 'Top', dataIndex: 'd', key: 'd' },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[1]).toHaveLength(4);
    expect((result.current[1] as any)[0].key).toBe('a');
    expect((result.current[1] as any)[3].key).toBe('d');
  });

  it('handles hidden columns in nested groups', () => {
    const columns = [
      {
        title: 'Group',
        children: [
          { title: 'A', dataIndex: 'a', key: 'a' },
          { title: 'Hidden', dataIndex: 'b', key: 'b', hidden: true },
          { title: 'C', dataIndex: 'c', key: 'c' },
        ],
      },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[1]).toHaveLength(2);
    expect((result.current[1] as any)[0].key).toBe('a');
    expect((result.current[1] as any)[1].key).toBe('c');
  });

  it('is memoized (same reference for same columns)', () => {
    const columns = [{ title: 'A', dataIndex: 'a', key: 'a' }];
    const { result, rerender } = renderHook(() =>
      useColumns({ columns } as any, undefined),
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it('returns new result when columns change', () => {
    const columns1 = [{ title: 'A', dataIndex: 'a', key: 'a' }];
    const columns2 = [{ title: 'B', dataIndex: 'b', key: 'b' }];

    const { result, rerender } = renderHook(
      ({ cols }) => useColumns({ columns: cols } as any, undefined),
      { initialProps: { cols: columns1 } },
    );
    const first = result.current;
    rerender({ cols: columns2 });
    expect(result.current).not.toBe(first);
  });

  it('handles empty columns array', () => {
    const { result } = renderHook(() => useColumns({ columns: [] } as any, undefined));
    expect(result.current[0]).toEqual([]);
    expect(result.current[1]).toEqual([]);
  });

  it('handles columns with only groups (no direct leaf)', () => {
    const columns = [
      {
        title: 'Group1',
        children: [
          { title: 'A', dataIndex: 'a', key: 'a' },
        ],
      },
      {
        title: 'Group2',
        children: [
          { title: 'B', dataIndex: 'b', key: 'b' },
        ],
      },
    ];
    const { result } = renderHook(() => useColumns({ columns } as any, undefined));
    expect(result.current[1]).toHaveLength(2);
  });
});
