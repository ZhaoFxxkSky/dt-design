import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import useFlattenRecords from '../features/virtual/useFlattenRecords';
import useHover from '../features/hover/useHover';
import useStickyOffsets from '../features/fixed/useStickyOffsets';

// ============================================================
// useHover
// ============================================================
describe('useHover', () => {
  it('returns -1 initial state', () => {
    const { result } = renderHook(() => useHover());
    expect(result.current[0]).toBe(-1);
    expect(result.current[1]).toBe(-1);
  });

  it('updates on hover', () => {
    const { result } = renderHook(() => useHover());
    act(() => {
      result.current[2](2, 4);
    });
    expect(result.current[0]).toBe(2);
    expect(result.current[1]).toBe(4);
  });

  it('resets to -1 when hover out', () => {
    const { result } = renderHook(() => useHover());
    act(() => {
      result.current[2](5, 10);
    });
    expect(result.current[0]).toBe(5);
    expect(result.current[1]).toBe(10);

    act(() => {
      result.current[2](-1, -1);
    });
    expect(result.current[0]).toBe(-1);
    expect(result.current[1]).toBe(-1);
  });

  it('onHover callback is stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useHover());
    const firstCallback = result.current[2];
    rerender();
    expect(result.current[2]).toBe(firstCallback);
  });

  it('supports range hover (start !== end)', () => {
    const { result } = renderHook(() => useHover());
    act(() => {
      result.current[2](3, 7);
    });
    expect(result.current[0]).toBe(3);
    expect(result.current[1]).toBe(7);
  });

  it('handles same start and end (single row hover)', () => {
    const { result } = renderHook(() => useHover());
    act(() => {
      result.current[2](5, 5);
    });
    expect(result.current[0]).toBe(5);
    expect(result.current[1]).toBe(5);
  });
});

// ============================================================
// useStickyOffsets
// ============================================================
describe('useStickyOffsets', () => {
  it('calculates start offsets for left-fixed columns', () => {
    const columns = [
      { fixed: 'start' as const, width: 100 },
      { fixed: 'start' as const, width: 200 },
      {},
      { fixed: 'end' as const, width: 80 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([100, 200, 0, 80], columns));
    // The implementation accumulates widths for ALL fixed columns (both start and end)
    expect(result.current.start).toEqual([0, 100, 300, 300]);
  });

  it('calculates end offsets for right-fixed columns', () => {
    const columns = [
      {},
      {},
      { fixed: 'end' as const, width: 80 },
      { fixed: 'end' as const, width: 60 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([0, 0, 80, 60], columns));
    expect(result.current.end).toEqual([140, 140, 60, 0]);
  });

  it('handles mixed start and end fixed columns', () => {
    const columns = [
      { fixed: 'start' as const, width: 100 },
      { fixed: 'start' as const, width: 50 },
      {},
      { fixed: 'end' as const, width: 80 },
      { fixed: 'end' as const, width: 60 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([100, 50, 0, 80, 60], columns));
    // Start offsets (left to right): all fixed columns (start AND end) contribute
    // i=0: push 0, fixed=true, total += 100 → 100
    // i=1: push 100, fixed=true, total += 50 → 150
    // i=2: push 150, fixed=false
    // i=3: push 150, fixed=true, total += 80 → 230
    // i=4: push 230, fixed=true, total += 60 → 290
    expect(result.current.start).toEqual([0, 100, 150, 150, 230]);
    // End offsets (right to left, then reversed): all fixed columns (start AND end) contribute
    // i=4: push 0, fixed=true, total += 60 → 60
    // i=3: push 60, fixed=true, total += 80 → 140
    // i=2: push 140, fixed=false
    // i=1: push 140, fixed=true, total += 50 → 190
    // i=0: push 190, fixed=true, total += 100 → 290
    // Before reverse: [0, 60, 140, 140, 190]
    // After reverse: [190, 140, 140, 60, 0]
    expect(result.current.end).toEqual([190, 140, 140, 60, 0]);
  });

  it('handles "left" and "right" as fixed values', () => {
    const columns = [
      { fixed: 'left' as const, width: 100 },
      {},
      { fixed: 'right' as const, width: 80 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([100, 0, 80], columns));
    // "left" maps to start, "right" maps to end — both are truthy for `fixed`
    expect(result.current.start).toEqual([0, 100, 100]);
    expect(result.current.end).toEqual([80, 80, 0]);
  });

  it('returns widths property matching colWidths', () => {
    const columns = [{ fixed: 'start' as const, width: 100 }] as any;
    const { result } = renderHook(() => useStickyOffsets([100], columns));
    expect(result.current.widths).toEqual([100]);
  });

  it('handles all non-fixed columns (no offsets)', () => {
    const columns = [{}, {}, {}] as any;
    const { result } = renderHook(() => useStickyOffsets([100, 200, 80], columns));
    expect(result.current.start).toEqual([0, 0, 0]);
    expect(result.current.end).toEqual([0, 0, 0]);
  });

  it('handles all start-fixed columns', () => {
    const columns = [
      { fixed: 'start' as const, width: 100 },
      { fixed: 'start' as const, width: 200 },
      { fixed: 'start' as const, width: 50 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([100, 200, 50], columns));
    expect(result.current.start).toEqual([0, 100, 300]);
    expect(result.current.end).toEqual([250, 50, 0]);
  });

  it('handles all end-fixed columns', () => {
    const columns = [
      { fixed: 'end' as const, width: 100 },
      { fixed: 'end' as const, width: 200 },
      { fixed: 'end' as const, width: 50 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([100, 200, 50], columns));
    expect(result.current.start).toEqual([0, 100, 300]);
    expect(result.current.end).toEqual([250, 50, 0]);
  });

  it('handles empty columns', () => {
    const { result } = renderHook(() => useStickyOffsets([], []));
    expect(result.current.start).toEqual([]);
    expect(result.current.end).toEqual([]);
    expect(result.current.widths).toEqual([]);
  });

  it('handles zero-width fixed columns', () => {
    const columns = [
      { fixed: 'start' as const, width: 0 },
      { fixed: 'start' as const, width: 100 },
    ] as any;
    const { result } = renderHook(() => useStickyOffsets([0, 100], columns));
    expect(result.current.start).toEqual([0, 0]);
  });

  it('is memoized (returns same reference for same inputs)', () => {
    const colWidths = [100];
    const columns = [{ fixed: 'start' as const, width: 100 }] as any;
    const { result, rerender } = renderHook(() => useStickyOffsets(colWidths, columns));
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

// ============================================================
// useFlattenRecords
// ============================================================
describe('useFlattenRecords', () => {
  it('flattens flat data', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set([1, 2, 3]), getRowKey),
    );
    expect(result.current).toHaveLength(3);
    expect(result.current[0].record).toEqual({ id: 1 });
    expect(result.current[0].indent).toBe(0);
  });

  it('flattens tree data with expanded keys', () => {
    const data = [{ id: 1, children: [{ id: 2 }, { id: 3 }] }, { id: 4 }];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set([1]), getRowKey),
    );
    expect(result.current).toHaveLength(4);
    expect(result.current[0].record).toMatchObject({ id: 1 });
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].record).toMatchObject({ id: 2 });
    expect(result.current[1].indent).toBe(1);
  });

  it('hides children when not expanded', () => {
    const data = [{ id: 1, children: [{ id: 2 }] }];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set(), getRowKey),
    );
    expect(result.current).toHaveLength(1);
  });

  it('handles deeply nested tree data', () => {
    const data = [
      {
        id: 1,
        children: [
          {
            id: 2,
            children: [{ id: 3, children: [{ id: 4 }] }],
          },
        ],
      },
    ];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set([1, 2, 3]), getRowKey),
    );
    expect(result.current).toHaveLength(4);
    expect(result.current[0].record).toMatchObject({ id: 1 });
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].record).toMatchObject({ id: 2 });
    expect(result.current[1].indent).toBe(1);
    expect(result.current[2].record).toMatchObject({ id: 3 });
    expect(result.current[2].indent).toBe(2);
    expect(result.current[3].record).toMatchObject({ id: 4 });
    expect(result.current[3].indent).toBe(3);
  });

  it('handles empty data', () => {
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords([], 'children', new Set(), getRowKey),
    );
    expect(result.current).toEqual([]);
  });

  it('handles data with empty children array', () => {
    const data = [{ id: 1, children: [] }];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set([1]), getRowKey),
    );
    expect(result.current).toHaveLength(1);
  });

  it('handles data with undefined children', () => {
    const data = [{ id: 1 }];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set([1]), getRowKey),
    );
    expect(result.current).toHaveLength(1);
  });

  it('assigns correct index across nesting levels', () => {
    const data = [
      { id: 'a', children: [{ id: 'b' }] },
      { id: 'c' },
    ];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set(['a']), getRowKey),
    );
    // index is local: root items use their array index, children use their index within parent's children
    expect(result.current[0].index).toBe(0); // 'a' at root index 0
    expect(result.current[1].index).toBe(0); // 'b' is child 0 of 'a'
    expect(result.current[2].index).toBe(1); // 'c' at root index 1
  });

  it('handles multiple root-level trees', () => {
    const data = [
      { id: 1, children: [{ id: 2 }] },
      { id: 3, children: [{ id: 4 }] },
    ];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'children', new Set([1, 3]), getRowKey),
    );
    expect(result.current).toHaveLength(4);
    expect(result.current[0].record).toMatchObject({ id: 1 });
    expect(result.current[0].indent).toBe(0);
    expect(result.current[1].record).toMatchObject({ id: 2 });
    expect(result.current[1].indent).toBe(1);
    expect(result.current[2].record).toMatchObject({ id: 3 });
    expect(result.current[2].indent).toBe(0);
    expect(result.current[3].record).toMatchObject({ id: 4 });
    expect(result.current[3].indent).toBe(1);
  });

  it('supports custom children column name', () => {
    const data = [{ id: 1, items: [{ id: 2 }] }];
    const getRowKey = (r: any) => r.id;
    const { result } = renderHook(() =>
      useFlattenRecords(data, 'items', new Set([1]), getRowKey),
    );
    expect(result.current).toHaveLength(2);
    expect(result.current[1].record).toMatchObject({ id: 2 });
    expect(result.current[1].indent).toBe(1);
  });

  it('is memoized', () => {
    const data = [{ id: 1 }];
    const getRowKey = (r: any) => r.id;
    const expandedKeys = new Set([1]);
    const { result, rerender } = renderHook(() =>
      useFlattenRecords(data, 'children', expandedKeys, getRowKey),
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
