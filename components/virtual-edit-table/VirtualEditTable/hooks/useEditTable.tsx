import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import type { FieldDisplayRenderer } from '../../FieldDisplay/types';
import type { FieldRenderer } from '../../FieldEditor/types';
import Cell from '../components/Cell';
import HeaderCheckbox from '../components/HeaderCheckbox';
import RowCheckbox from '../components/RowCheckbox';
import { ACTION_WIDTH, CHECKBOX_WIDTH, INDEX_WIDTH, MIN_COL_WIDTH } from '../constants';
import type {
  RowSelection,
  TableColumn,
  TableColumnDef,
  TableRow,
  VirtualTableValidateResult,
} from '../types';
import { buildGroupedColumns, cellErrorKey, isPotentiallyRequired } from '../utils';
import useColumnSizing from './useColumnSizing';
import useRowSelection from './useRowSelection';
import useTableValidation from './useTableValidation';
import styles from '../style.less';

export type UseEditTableOptions = {
  columns: TableColumn[];
  value: Record<string, any>[];
  editable?: boolean;
  rowSelection?: false | RowSelection;
  onChange?: (value: Record<string, any>[]) => void;
  onRowSelect?: (selectedRows: Set<number>, rows: Record<string, any>[]) => void;
  onValidate?: (result: VirtualTableValidateResult) => void;
  rowKey?: string | ((record: Record<string, any>, index: number) => string);
  fieldRenderers?: Record<string, FieldRenderer>;
  displayRenderers?: Record<string, FieldDisplayRenderer>;
  containerRef: React.RefObject<HTMLDivElement>;
};

const useEditTable = ({
  columns,
  value,
  editable = true,
  rowSelection,
  onChange,
  onRowSelect,
  onValidate,
  rowKey,
  fieldRenderers,
  displayRenderers,
  containerRef,
}: UseEditTableOptions) => {
  const activeRowSelection = React.useMemo(
    () => (rowSelection === undefined ? false : rowSelection),
    [rowSelection],
  );
  const selectable = activeRowSelection !== false;

  const getRowKey = React.useCallback(
    (record: Record<string, any>, index: number) => {
      if (typeof rowKey === 'function') return rowKey(record, index);
      if (typeof rowKey === 'string') return record[rowKey] ?? `row_${index}`;
      return `row_${index}`;
    },
    [rowKey],
  );

  const disabledRows = React.useMemo(() => {
    const set = new Set<number>();
    if (activeRowSelection === false) return set;
    value.forEach((row, i) => {
      const props = activeRowSelection.getCheckboxProps?.(row, i);
      if (props?.disabled) set.add(i);
    });
    return set;
  }, [activeRowSelection, value]);

  const { colWidths, getColumnSize: getSize } = useColumnSizing(columns, containerRef, editable);
  const {
    selectedRows,
    setSelectedRows,
    setSelectedByKeys,
    toggleRow,
    toggleAll,
    selectAll,
    invertSelection,
    clearSelection,
  } = useRowSelection(
    value,
    getRowKey,
    disabledRows,
    activeRowSelection === false ? 'checkbox' : activeRowSelection.type ?? 'checkbox',
    onRowSelect,
  );
  const { errorsRef, validate, validateCell, resetErrors, validateVersion } = useTableValidation(
    columns,
    value,
    onValidate,
  );

  const updateRowRef = React.useRef<(rowIndex: number, fieldKey: string, fieldValue: any) => void>(
    () => undefined,
  );
  const removeRowRef = React.useRef<(index: number) => void>(() => undefined);

  updateRowRef.current = (index: number, fieldKey: string, fieldValue: any) => {
    onChange?.(value.map((row, i) => (i === index ? { ...row, [fieldKey]: fieldValue } : row)));
  };

  removeRowRef.current = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
    resetErrors();
    setSelectedRows((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  };

  const removeSelectedRows = React.useCallback(() => {
    if (selectedRows.size === 0) return;
    const keptIndices = value.map((_, i) => i).filter((i) => !selectedRows.has(i));
    onChange?.(keptIndices.map((i) => value[i]));
    resetErrors();
    setSelectedRows(new Set());
  }, [onChange, resetErrors, selectedRows, setSelectedRows, value]);

  const addRow = React.useCallback(
    (createEmptyRow?: () => Record<string, any>) => {
      const empty = createEmptyRow
        ? createEmptyRow()
        : { id: `row_${Date.now()}`, newRow: true };
      onChange?.([...value, empty]);
    },
    [onChange, value],
  );

  const tableColumns = React.useMemo<ColumnDef<TableRow>[]>(() => {
    const renderLeaf = (field: TableColumn): TableColumnDef => ({
      id: field.key,
      header: () => (
        <>
          {field.name}
          {isPotentiallyRequired(field) && <span className={styles.required}>*</span>}
          {field.tip && (
            <Tooltip title={field.tip}>
              <QuestionCircleOutlined className={styles.headerTipIcon} />
            </Tooltip>
          )}
        </>
      ),
      size: getSize(field.key),
      minSize: MIN_COL_WIDTH,
      cell: ({ row }) => (
        <Cell
          field={field}
          record={row.original}
          rowIndex={row.index}
          editable={editable}
          validateCell={validateCell}
          updateRowRef={updateRowRef}
          hasError={errorsRef.current.has(cellErrorKey(row.index, field.key))}
          fieldRenderers={fieldRenderers}
          displayRenderers={displayRenderers}
        />
      ),
    });

    const leafGroups = buildGroupedColumns(columns, renderLeaf);
    const hasAnyGroup = leafGroups.some((g) => 'columns' in g && Array.isArray(g.columns));

    const checkboxColumn: TableColumnDef | null = selectable
      ? {
          id: '__checkbox',
          header: () => <HeaderCheckbox />,
          size: CHECKBOX_WIDTH,
          minSize: CHECKBOX_WIDTH,
          cell: ({ row }) => <RowCheckbox rowIndex={row.index} />,
        }
      : null;

    const indexColumn: TableColumnDef = {
      id: '__index',
      header: '序号',
      size: INDEX_WIDTH,
      minSize: INDEX_WIDTH,
      cell: ({ row }) => {
        const index = row.index;
        const rowHasError = columns
          .filter((col) => col.required)
          .some((col) => errorsRef.current.has(cellErrorKey(index, col.key)));
        return (
          <>
            {rowHasError && (
              <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 14, marginRight: 6 }} />
            )}
            <span>{index + 1}</span>
          </>
        );
      },
    };

    const actionColumn: TableColumnDef = {
      id: '__action',
      header: '操作',
      size: ACTION_WIDTH,
      minSize: ACTION_WIDTH,
      cell: ({ row }) => (
        <DeleteOutlined
          className={styles.deleteIcon}
          onClick={() => removeRowRef.current(row.index)}
        />
      ),
    };

    const baseCols = hasAnyGroup
      ? [
          ...(checkboxColumn ? [{ id: '__checkbox-group', header: '', columns: [checkboxColumn] }] : []),
          { id: '__index-group', header: '', columns: [indexColumn] },
          ...leafGroups,
        ]
      : [
          ...(checkboxColumn ? [checkboxColumn] : []),
          indexColumn,
          ...leafGroups,
        ];

    const cols: TableColumnDef[] = editable
      ? hasAnyGroup
        ? [...baseCols, { id: '__action-group', header: '', columns: [actionColumn] }]
        : [...baseCols, actionColumn]
      : baseCols;
    return cols;
    // validateVersion 驱动 errorsRef 变化后的列重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, getSize, validateCell, validateVersion, editable]);

  const columnPinning = React.useMemo(
    () => ({
      left: [
        ...(selectable ? ['__checkbox'] : []),
        '__index',
        ...columns.filter((c) => c.fixed === 'left').map((c) => c.key),
      ],
      right: ['__action', ...columns.filter((c) => c.fixed === 'right').map((c) => c.key)],
    }),
    [columns, selectable],
  );

  const table = useReactTable({
    data: value,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    state: { columnPinning },
    getRowId: rowKey
      ? (row, index) =>
          (typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey]) ?? `row_${index}`
      : undefined,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 48,
    getScrollElement: () => containerRef.current,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const scrollToRow = React.useCallback(
    (index: number) => rowVirtualizer.scrollToIndex(index, { align: 'center' }),
    [rowVirtualizer],
  );

  const validateAndScroll = React.useCallback(
    (data?: Record<string, any>[]) => {
      const result = validate(data);
      if (!result.valid && result.firstError) {
        scrollToRow(result.firstError.rowIndex);
      }
      return result;
    },
    [validate, scrollToRow],
  );

  return {
    table,
    rowVirtualizer,
    tableColumns,
    rowSelection: activeRowSelection,
    selectedRows,
    disabledRows,
    getRowKey,
    setSelectedByKeys,
    toggleRow,
    toggleAll,
    selectAll,
    invertSelection,
    clearSelection,
    validate: validateAndScroll,
    validateCell,
    errorsRef,
    resetErrors,
    colWidths,
    getColumnSize: getSize,
    addRow,
    removeRowRef,
    removeSelectedRows,
    scrollToRow,
  };
};

export default useEditTable;
