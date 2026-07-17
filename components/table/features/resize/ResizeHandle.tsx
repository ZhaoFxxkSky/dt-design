import * as React from 'react';
import TableMeasureRowContext from '../../TableMeasureRowContext';
import type { ColumnType } from '../../interface';

export interface ResizeHandleProps {
  /** 列对象 */
  column: ColumnType;
  /** 开始拖拽，第二个参数为 th 的实际渲染宽度 */
  onStartResize: (e: React.MouseEvent, col: ColumnType, actualWidth?: number) => void;
  /** 键盘调整列宽（不走 MouseEvent 路径） */
  onKeyboardResize: (col: ColumnType, newWidth: number) => void;
  /** prefixCls */
  prefixCls: string;
}

/** 键盘步进(px) */
const KEYBOARD_STEP = 10;

/**
 * 表头列宽拖拽手柄
 *
 * 渲染在 th 右侧边缘：
 * - 鼠标 hover 时显示高亮粗边框（提示可拖拽）
 * - 拖拽中由容器内的 ResizeLine 显示竖线
 * - 键盘可达：Tab 聚焦后用方向键调整列宽
 */
const ResizeHandle: React.FC<ResizeHandleProps> = ({
  column,
  onStartResize,
  onKeyboardResize,
  prefixCls,
}) => {
  const inMeasureRow = React.useContext(TableMeasureRowContext);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (inMeasureRow) {
        e.preventDefault();
        return;
      }
      // 测量 th 的实际渲染宽度，避免 table-layout: fixed 下的宽度偏差
      const th = (e.currentTarget as HTMLElement).closest('th');
      const actualWidth = th ? th.offsetWidth : undefined;
      onStartResize(e, column, actualWidth);
    },
    [column, onStartResize],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (inMeasureRow) {
        e.preventDefault();
        return;
      }
      const th = (e.currentTarget as HTMLElement).closest('th');
      const currentWidth = th ? th.offsetWidth : (typeof column.width === 'number' ? column.width : 0);
      const minWidth = column.minWidth ?? 60;
      const maxWidth = column.maxWidth;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          onKeyboardResize(column, currentWidth - KEYBOARD_STEP);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onKeyboardResize(column, currentWidth + KEYBOARD_STEP);
          break;
        case 'Home':
          e.preventDefault();
          onKeyboardResize(column, minWidth);
          break;
        case 'End':
          e.preventDefault();
          onKeyboardResize(column, maxWidth ?? currentWidth * 2);
          break;
      }
    },
    [column, onKeyboardResize],
  );

  // aria 属性需要数值类型
  const widthNum =
    typeof column.width === 'number' ? column.width : Number(column.width) || 0;
  const ariaLabel =
    typeof column.title === 'string'
      ? `调整列宽: ${column.title}`
      : '调整列宽';

  // 测量行内的手柄对用户不可见，必须从 Tab 顺序和辅助技术中移除，
  // 避免键盘用户聚焦到隐藏元素。
  if (inMeasureRow) {
    return (
      <span
        className={`${prefixCls}-resize-handle`}
        aria-hidden
        tabIndex={-1}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    );
  }

  return (
    <span
      className={`${prefixCls}-resize-handle`}
      role="separator"
      // ARIA window-splitter 模式:可聚焦的 separator 属于 widget(ARIA 1.2),
      // 键盘调宽需要 tabIndex=0。jsx-a11y 的角色分类滞后于规范,误报为非交互元素。
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={ariaLabel}
      aria-valuenow={widthNum}
      aria-valuemin={column.minWidth ?? 60}
      aria-valuemax={column.maxWidth ?? undefined}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        e.stopPropagation();
      }}
    />
  );
};

export default ResizeHandle;
