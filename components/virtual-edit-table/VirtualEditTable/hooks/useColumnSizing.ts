import React from 'react';
import type { TableColumn } from '../types';
import { ACTION_WIDTH, CHECKBOX_WIDTH, INDEX_WIDTH, MIN_COL_WIDTH } from '../constants';

const useColumnSizing = (
  columns: TableColumn[],
  containerRef: React.RefObject<HTMLDivElement>,
  hasAction = true,
) => {
  const [colWidths, setColWidths] = React.useState<number[]>(() =>
    columns.map((col) => (col.width && col.width > 0 ? col.width : MIN_COL_WIDTH)),
  );

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const compute = () => {
      const containerWidth = el.clientWidth;
      const fixedWidth = CHECKBOX_WIDTH + INDEX_WIDTH + (hasAction ? ACTION_WIDTH : 0);
      const available = Math.max(containerWidth - fixedWidth, 0);

      const definedWidths = columns.map((col) => (col.width && col.width > 0 ? col.width : 0));
      const definedTotal = definedWidths.reduce((a, b) => a + b, 0);
      const autoColumns = definedWidths.filter((w) => w === 0).length;

      let autoWidth = 0;
      if (autoColumns > 0) {
        autoWidth = Math.max((available - definedTotal) / autoColumns, MIN_COL_WIDTH);
      }

      setColWidths(definedWidths.map((w) => (w > 0 ? w : autoWidth)));
    };

    compute();
    const ro = (window as any).ResizeObserver
      ? new (window as any).ResizeObserver(compute)
      : null;
    if (ro) ro.observe(el);
    return () => ro?.disconnect();
  }, [columns, containerRef, hasAction]);

  const getColumnSize = React.useCallback(
    (columnId: string) => {
      const idx = columns.findIndex((c) => c.key === columnId);
      return colWidths[idx] ?? MIN_COL_WIDTH;
    },
    [colWidths, columns],
  );

  return { colWidths, getColumnSize };
};

export default useColumnSizing;
