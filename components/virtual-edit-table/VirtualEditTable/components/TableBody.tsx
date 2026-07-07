import { flexRender, type Table } from '@tanstack/react-table';
import type { Virtualizer } from '@tanstack/react-virtual';
import classNames from 'classnames';
import React from 'react';
import type { TableRow } from '../types';
import { getPinningStyles } from '../utils';
import styles from '../style.less';

export type TableBodyProps = {
  table: Table<TableRow>;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  selectedRows: Set<number>;
  striped?: boolean;
};

const TableBody: React.FC<TableBodyProps> = ({ table, rowVirtualizer, selectedRows, striped = true }) => {
  const { rows } = table.getRowModel();
  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <tbody
      className={styles.tbody}
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {virtualItems.map((virtualItem) => {
        const row = rows[virtualItem.index];
        return (
          <tr
            key={row.id}
            ref={rowVirtualizer.measureElement}
            data-index={virtualItem.index}
            className={classNames(
              styles.dataRow,
              striped && virtualItem.index % 2 === 1 && styles.dataRowStriped,
              selectedRows.has(virtualItem.index) && styles.dataRowSelected,
            )}
            style={{ transform: `translateY(${virtualItem.start}px)` }}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={classNames(
                  styles.td,
                  cell.column.id.startsWith('__') && styles.centerCell,
                  cell.column.getIsPinned() && styles.pinnedCell,
                  cell.column.getIsPinned() === 'left' &&
                    cell.column.getIsLastColumn('left') &&
                    styles.pinnedLeftLast,
                  cell.column.getIsPinned() === 'right' &&
                    cell.column.getIsFirstColumn('right') &&
                    styles.pinnedRightFirst,
                )}
                style={{
                  ...getPinningStyles(cell.column),
                  width: cell.column.getSize(),
                  minWidth: cell.column.columnDef.minSize,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
