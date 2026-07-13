import * as React from 'react';
import type { ColumnType } from '../../interface';

export interface ResizeHandleProps {
  /** 列对象 */
  column: ColumnType;
  /** 开始拖拽，第二个参数为 th 的实际渲染宽度 */
  onStartResize: (e: React.MouseEvent, col: ColumnType, actualWidth?: number) => void;
  /** prefixCls */
  prefixCls: string;
}

/**
 * 表头列宽拖拽手柄
 *
 * 渲染在 th 右侧边缘：
 * - 鼠标 hover 时显示高亮粗边框（提示可拖拽）
 * - 拖拽中由容器内的 ResizeLine 显示竖线
 */
const ResizeHandle: React.FC<ResizeHandleProps> = ({ column, onStartResize, prefixCls }) => {
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      // 测量 th 的实际渲染宽度，避免 table-layout: fixed 下的宽度偏差
      const th = (e.currentTarget as HTMLElement).closest('th');
      const actualWidth = th ? th.offsetWidth : undefined;
      onStartResize(e, column, actualWidth);
    },
    [column, onStartResize],
  );

  return (
    <span
      className={`${prefixCls}-resize-handle`}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
      }}
    />
  );
};

export default ResizeHandle;
