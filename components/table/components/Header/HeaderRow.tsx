import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../../shared/context/TableContext';
import { useContext } from '../../../_util/context';
import type {
  CellType,
  ColumnType,
  CustomizeComponent,
  GetComponentProps,
  Key,
  StickyOffsets,
} from '../../interface';
import { getCellFixedInfo } from '../../features/fixed/fixUtil';
import { getColumnsKey } from '../../shared/utils/valueUtil';
import type { TableProps } from '../RcTable';
import ResizeContext from '../../features/resize/ResizeContext';
import ResizeHandle from '../../features/resize/ResizeHandle';

export interface RowProps<RecordType> {
  cells: readonly CellType<RecordType>[];
  stickyOffsets: StickyOffsets;
  flattenColumns: readonly ColumnType<RecordType>[];
  rowComponent: CustomizeComponent;
  cellComponent: CustomizeComponent;
  onHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
  index: number;
  classNames: TableProps['classNames']['header'];
  styles: TableProps['styles']['header'];
}

const HeaderRow = <RecordType extends any>(props: RowProps<RecordType>) => {
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
  const resizeCtx = React.useContext(ResizeContext);

  let rowProps: React.HTMLAttributes<HTMLElement>;
  if (onHeaderRow) {
    rowProps = onHeaderRow(
      cells.map(cell => cell.column),
      index,
    );
  }

  const columnsKey = getColumnsKey(cells.map(cell => cell.column));

  return (
    <RowComponent {...rowProps} className={classNames.row} style={styles.row}>
      {cells.map((cell: CellType<RecordType>, cellIndex) => {
        const { column, colStart, colEnd, colSpan } = cell;
        const fixedInfo = getCellFixedInfo(colStart, colEnd, flattenColumns, stickyOffsets);

        const additionalProps: React.HTMLAttributes<HTMLElement> = column?.onHeaderCell?.(column) || {};

        // 检查是否需要 resize handle
        const isResizable = resizeCtx?.isColumnResizable(column) ?? false;
        const columnKey: Key = column?.key ?? column?.dataIndex ?? columnsKey[cellIndex];
        const isResizing = resizeCtx?.resizingKey === columnKey;

        const resizeHandle = isResizable && resizeCtx ? (
          <ResizeHandle
            column={column}
            columnKey={columnKey}
            isResizing={isResizing}
            onStartResize={resizeCtx.onStartResize}
            prefixCls={prefixCls}
          />
        ) : undefined;

        return (
          <Cell
            {...cell}
            scope={column.title ? (colSpan > 1 ? 'colgroup' : 'col') : null}
            ellipsis={column.ellipsis}
            align={column.align}
            component={CellComponent}
            prefixCls={prefixCls}
            key={columnsKey[cellIndex]}
            {...fixedInfo}
            additionalProps={additionalProps}
            rowType="header"
            resizeHandle={resizeHandle}
            isResizing={isResizing}
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
