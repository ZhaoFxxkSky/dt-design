import React from 'react';

const useRowSelection = (
  value: Record<string, any>[],
  getRowKey: (record: Record<string, any>, index: number) => string,
  disabledRows: Set<number>,
  type: 'checkbox' | 'radio' = 'checkbox',
  onRowSelect?: (selectedRows: Set<number>, rows: Record<string, any>[]) => void,
) => {
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const onRowSelectRef = React.useRef(onRowSelect);
  onRowSelectRef.current = onRowSelect;

  React.useEffect(() => {
    onRowSelectRef.current?.(selectedRows, value);
  }, [selectedRows, value]);

  const setSelectedByKeys = React.useCallback(
    (keys: string[]) => {
      const keySet = new Set(keys);
      const next = new Set<number>();
      value.forEach((row, i) => {
        if (disabledRows.has(i)) return;
        if (keySet.has(getRowKey(row, i))) next.add(i);
      });
      setSelectedRows(next);
    },
    [disabledRows, getRowKey, value],
  );

  const isSelectable = React.useCallback(
    (rowIndex: number) => !disabledRows.has(rowIndex),
    [disabledRows],
  );

  const toggleRow = React.useCallback(
    (rowIndex: number) => {
      if (!isSelectable(rowIndex)) return;
      if (type === 'radio') {
        setSelectedRows((prev) => {
          if (prev.has(rowIndex) && prev.size === 1) return new Set();
          return new Set([rowIndex]);
        });
        return;
      }
      setSelectedRows((prev) => {
        const next = new Set(prev);
        if (next.has(rowIndex)) next.delete(rowIndex);
        else next.add(rowIndex);
        return next;
      });
    },
    [isSelectable, type],
  );

  const toggleAll = React.useCallback(() => {
    setSelectedRows((prev) => {
      const selectable = value.map((_, i) => i).filter(isSelectable);
      const allSelectableSelected = selectable.length > 0 && selectable.every((i) => prev.has(i));
      if (allSelectableSelected) {
        const next = new Set(prev);
        selectable.forEach((i) => next.delete(i));
        return next;
      }
      const next = new Set(prev);
      selectable.forEach((i) => next.add(i));
      return next;
    });
  }, [isSelectable, value]);

  const selectAll = React.useCallback(() => {
    const next = new Set<number>();
    value.forEach((_, i) => {
      if (isSelectable(i)) next.add(i);
    });
    setSelectedRows(next);
  }, [isSelectable, value]);

  const invertSelection = React.useCallback(() => {
    setSelectedRows((prev) => {
      const next = new Set<number>();
      value.forEach((_, i) => {
        if (!isSelectable(i)) {
          if (prev.has(i)) next.add(i);
        } else if (!prev.has(i)) {
          next.add(i);
        }
      });
      return next;
    });
  }, [isSelectable, value]);

  const clearSelection = React.useCallback(() => setSelectedRows(new Set()), []);

  return {
    selectedRows,
    setSelectedRows,
    setSelectedByKeys,
    toggleRow,
    toggleAll,
    selectAll,
    invertSelection,
    clearSelection,
  };
};

export default useRowSelection;
