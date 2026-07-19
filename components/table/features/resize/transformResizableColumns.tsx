import * as React from 'react';
import type { ColumnGroupType, ColumnsType, ColumnType, Direction } from '../../interface';
import ResizeHandle from './ResizeHandle';

export interface TransformResizableOptions {
  prefixCls: string;
  enabled: boolean;
  isColumnResizable: (col: ColumnType) => boolean;
  onStartResize: (e: React.MouseEvent, col: ColumnType, actualWidth?: number) => void;
  onKeyboardResize: (col: ColumnType, newWidth: number) => void;
  /** RTL 下手柄在列左缘，键盘方向键语义镜像 */
  direction?: Direction;
}

function transformResizableColumns<RecordType = any>(
  columns: ColumnsType<RecordType>,
  options: TransformResizableOptions,
): ColumnsType<RecordType> {
  const { prefixCls, enabled, isColumnResizable, onStartResize, onKeyboardResize, direction } =
    options;

  if (!enabled) return columns;

  const walk = (cols: ColumnsType<RecordType>): ColumnsType<RecordType> =>
    cols.map((col) => {
      const groupCol = col as ColumnGroupType<RecordType>;
      if (groupCol.children && groupCol.children.length > 0) {
        return {
          ...col,
          children: walk(groupCol.children),
        } as ColumnGroupType<RecordType>;
      }

      const leafCol = col as ColumnType<RecordType>;
      if (!isColumnResizable(leafCol as ColumnType)) return col;

      const originTitle = leafCol.title as React.ReactNode;
      const title = (
        <>
          {originTitle}
          <ResizeHandle
            column={leafCol as ColumnType}
            prefixCls={prefixCls}
            onStartResize={onStartResize}
            onKeyboardResize={onKeyboardResize}
            direction={direction}
          />
        </>
      );

      // 注入 cell-resizable class，使 th 获得 overflow: visible
      // （抵消 cell-ellipsis 的 overflow: hidden，防止 resize handle 被裁剪）
      const resizableClassName = `${prefixCls}-cell-resizable`;
      const originOnHeaderCell = leafCol.onHeaderCell;

      return {
        ...leafCol,
        title,
        onHeaderCell: (column: ColumnType<RecordType>) => {
          const cell = originOnHeaderCell?.(column) || {};
          const cellClassName = cell.className;
          return {
            ...cell,
            className: cellClassName
              ? `${cellClassName} ${resizableClassName}`
              : resizableClassName,
          };
        },
      };
    });

  return walk(columns);
}

export default transformResizableColumns;
