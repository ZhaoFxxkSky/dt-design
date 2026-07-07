import { Modal } from 'antd';
import classNames from 'classnames';
import React from 'react';
import BatchEditModal from '../BatchEdit';
import { applyBatchRules } from '../BatchEdit/utils';
import type { BatchRuleExt } from '../BatchEdit/types';
import EmptyRow from './components/EmptyRow';
import { SelectionProvider } from './components/SelectionContext';
import TableBody from './components/TableBody';
import TableHeader from './components/TableHeader';
import TableToolbar from './components/TableToolbar';
import useEditTable from './hooks/useEditTable';
import useScrollShadow from './hooks/useScrollShadow';
import styles from './style.less';
import type { VirtualTableProps, VirtualTableRef } from './types';

const VirtualTable = React.forwardRef<VirtualTableRef, VirtualTableProps>(
  (
    {
      columns,
      value = [],
      editable = true,
      rowSelection,
      onChange,
      onRowSelect,
      onValidate,
      rowKey,
      height = 400,
      addable = true,
      createEmptyRow,
      title,
      striped = true,
      extraActions,
      emptyRender,
      fieldRenderers,
      displayRenderers,
    },
    ref,
  ) => {
    const tableContainerRef = React.useRef<HTMLDivElement>(null);
    const [batchModalOpen, setBatchModalOpen] = React.useState(false);

    const {
      table,
      rowVirtualizer,
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
      validate,
      validateCell,
      removeSelectedRows,
      addRow,
      scrollToRow,
    } = useEditTable({
      columns,
      value,
      editable,
      rowSelection,
      onChange,
      onRowSelect,
      onValidate,
      rowKey,
      fieldRenderers,
      displayRenderers,
      containerRef: tableContainerRef,
    });

    useScrollShadow(tableContainerRef, styles.scrolledLeft, styles.scrolledRight, [tableContainerRef]);

    React.useImperativeHandle(ref, () => ({ validate, scrollToRow }), [validate, scrollToRow]);

    const confirmBatchDelete = React.useCallback(() => {
      Modal.confirm({
        title: '确认删除',
        content: `确定删除选中的 ${selectedRows.size} 行数据吗？删除后不可恢复。`,
        okText: '确认删除',
        okButtonProps: { danger: true },
        cancelText: '取消',
        onOk: removeSelectedRows,
      });
    }, [removeSelectedRows, selectedRows.size]);

    const handleBatchEdit = React.useCallback(
      (rules: BatchRuleExt[]) => {
        const nextRows = applyBatchRules(value, selectedRows, columns, rules);

        // 只校验被批量编辑实际修改过的单元格，不触发整表校验
        nextRows.forEach((row, rowIndex) => {
          if (!selectedRows.has(rowIndex)) return;
          const prevRow = value[rowIndex];
          columns.forEach((col) => {
            if (prevRow?.[col.key] !== row[col.key]) {
              validateCell(rowIndex, col, row[col.key], row);
            }
          });
        });

        onChange?.(nextRows);
        setBatchModalOpen(false);
      },
      [columns, onChange, selectedRows, validateCell, value],
    );

    const { rows } = table.getRowModel();
    const hasSelection = selectedRows.size > 0;

    const selectionContextValue = React.useMemo(
      () => ({
        rowSelection: activeRowSelection,
        selectedRows,
        rows: value,
        rowsCount: value.length,
        disabledRows,
        getRowKey,
        toggleRow,
        toggleAll,
        selectAll,
        invertSelection,
        clearSelection,
        setSelectedByKeys,
      }),
      [
        activeRowSelection,
        selectedRows,
        value,
        disabledRows,
        getRowKey,
        toggleRow,
        toggleAll,
        selectAll,
        invertSelection,
        clearSelection,
        setSelectedByKeys,
      ],
    );

    return (
      <div className={styles.tableWrap}>
        <TableToolbar
          title={title}
          editable={editable}
          addable={addable}
          hasSelection={hasSelection}
          extraActions={extraActions}
          onAdd={() => addRow(createEmptyRow)}
          onBatchEdit={() => setBatchModalOpen(true)}
          onBatchDelete={confirmBatchDelete}
        />

        <SelectionProvider value={selectionContextValue}>
          <div
            ref={tableContainerRef}
            className={classNames(styles.viewport, rows.length === 0 && styles.viewportEmpty)}
            style={{ maxHeight: height }}
          >
            <table className={styles.table}>
              <TableHeader table={table} />
              {rows.length > 0 && (
                <TableBody
                  table={table}
                  rowVirtualizer={rowVirtualizer}
                  selectedRows={selectedRows}
                  striped={striped}
                />
              )}
            </table>
            {rows.length === 0 && (emptyRender ?? <EmptyRow />)}
          </div>
        </SelectionProvider>

        {editable && (
          <BatchEditModal
            open={batchModalOpen}
            columns={columns}
            selectedRows={selectedRows}
            data={value}
            onCancel={() => setBatchModalOpen(false)}
            onOk={handleBatchEdit}
          />
        )}
      </div>
    );
  },
);

export default VirtualTable;
