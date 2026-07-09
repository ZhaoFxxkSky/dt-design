import * as React from 'react';
import type { ColumnGroupType, ColumnsType, ColumnType } from '../../interface';
import ResizeHandle from './ResizeHandle';

export interface TransformResizableOptions {
  prefixCls: string;
  enabled: boolean;
  isColumnResizable: (col: ColumnType) => boolean;
  onStartResize: (e: React.MouseEvent, col: ColumnType, actualWidth?: number) => void;
}

function transformResizableColumns<RecordType = any>(
  columns: ColumnsType<RecordType>,
  options: TransformResizableOptions,
): ColumnsType<RecordType> {
  const { prefixCls, enabled, isColumnResizable, onStartResize } = options;

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
      if (!isColumnResizable(leafCol)) return col;

      const originTitle = leafCol.title;
      const title = (
        <>
          {originTitle}
          <ResizeHandle
            column={leafCol as ColumnType}
            prefixCls={prefixCls}
            onStartResize={onStartResize}
          />
        </>
      );

      return {
        ...leafCol,
        title,
      };
    });

  return walk(columns);
}

export default transformResizableColumns;
