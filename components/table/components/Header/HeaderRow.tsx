import { clsx } from 'clsx';
import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../../shared/context/TableContext';
import { useContext } from '../../../_util/context';
import type {
  CellType,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
  StickyOffsets,
} from '../../interface';
import { getCellFixedInfo } from '../../features/fixed/fixUtil';
import { getColumnsKey } from '../../shared/utils/valueUtil';
import type { TableProps } from '../RcTable';

export interface RowProps<RecordType> {
  cells: readonly CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
  index: number;
  classNames: NonNullable<NonNullable<TableProps['classNames']>['header']>;
  styles: NonNullable<NonNullable<TableProps['styles']>['header']>;
}

const HeaderRow = <RecordType,>(props: RowProps<RecordType>) => {
  const {
    cells,
    stickyOffsets,
    flattenColumns,
    rowComponent: RowComponent,
    cellComponent: CellComponent,
    onHeaderRow,
    index,
    classNames,
    styles,
  } = props;
  const { prefixCls } = useContext(TableContext, ['prefixCls']);

  const columns = cells.map((cell) => cell.column as ColumnType<RecordType>);

  let rowProps: React.HTMLAttributes<HTMLElement> = {};
  if (onHeaderRow) {
    rowProps = onHeaderRow(columns, index);
  }

  const columnsKey = getColumnsKey(columns);

  return (
    <RowComponent
      {...rowProps}
      className={clsx(rowProps?.className, classNames.row)}
      style={{ ...rowProps?.style, ...styles.row }}
    >
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column, colStart, colEnd, colSpan } = cell;
        const fixedInfo = getCellFixedInfo(colStart!, colEnd!, flattenColumns, stickyOffsets);

        const additionalProps: React.HTMLAttributes<HTMLElement> =
          column?.onHeaderCell?.(column) || {};

        return (
          <Cell
            {...cell}
            scope={column?.title ? ((colSpan ?? 0) > 1 ? 'colgroup' : 'col') : undefined}
            ellipsis={column?.ellipsis}
            align={column?.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            {...fixedInfo}
            additionalProps={additionalProps}
            rowType="header"
          />
        );
      })}
    </RowComponent>
  );
};

if (process.env.NODE_ENV !== 'production') {
  HeaderRow.displayName = 'HeaderRow';
}

export default HeaderRow;
