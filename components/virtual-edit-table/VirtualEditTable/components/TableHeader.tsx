import { flexRender, type Table } from '@tanstack/react-table';
import classNames from 'classnames';
import React from 'react';
import type { TableRow } from '../types';
import { getHeaderPinningStyles, isLeafColumn } from '../utils';
import styles from '../style.less';

export type TableHeaderProps = {
  table: Table<TableRow>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ table }) => (
  <thead className={styles.thead}>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id} className={styles.headerRow}>
        {headerGroup.headers.map((header) => {
          const isLeaf = isLeafColumn(header.column);
          return (
            <th
              key={header.id}
              className={classNames(
                styles.th,
                isLeaf && header.column.getIsPinned() && styles.pinnedHeader,
                isLeaf &&
                  header.column.getIsPinned() === 'left' &&
                  header.column.getIsLastColumn('left') &&
                  styles.pinnedLeftLast,
                isLeaf &&
                  header.column.getIsPinned() === 'right' &&
                  header.column.getIsFirstColumn('right') &&
                  styles.pinnedRightFirst,
              )}
              style={{
                ...getHeaderPinningStyles(header),
                width: header.getSize(),
                minWidth: header.column.columnDef.minSize,
              }}
              title={
                typeof header.column.columnDef.header === 'string'
                  ? header.column.columnDef.header
                  : undefined
              }
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          );
        })}
      </tr>
    ))}
  </thead>
);

export default TableHeader;
