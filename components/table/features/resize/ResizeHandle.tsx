import * as React from 'react';
import type { ColumnType, Key } from '../../interface';

export interface ResizeHandleProps {
  /** 列对象 */
  column: ColumnType;
  /** 列 key */
  columnKey: Key;
  /** 是否正在拖拽此列 */
  isResizing: boolean;
  /** 开始拖拽 */
  onStartResize: (e: React.MouseEvent, col: ColumnType) => void;
  /** prefixCls */
  prefixCls: string;
}

/**
 * 表头列宽拖拽手柄
 *
 * 渲染在 th 右侧边缘：
 * - 鼠标 hover 时显示高亮粗边框（提示可拖拽）
 * - 拖拽中显示一条竖线指示器
 */
const ResizeHandle: React.FC<ResizeHandleProps> = ({
  column,
  onStartResize,
  prefixCls,
}) => {
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onStartResize(e, column);
    },
    [column, onStartResize],
  );

  return (
    <span
      className={`${prefixCls}-resize-handle`}
      onMouseDown={handleMouseDown}
      onClick={e => {
        e.stopPropagation();
      }}
    />
  );
};

export default ResizeHandle;
