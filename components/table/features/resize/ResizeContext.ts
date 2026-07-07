import * as React from 'react';
import type { ColumnType, Key } from '../../interface';

export interface ResizeContextValue {
  /** 是否有列正在被拖拽（以及其 key） */
  resizingKey: Key | null;
  /** 拖拽时的实时宽度 */
  draggingWidth: number | null;
  /** 获取列宽（拖拽中返回 draggingWidth，否则返回已存储的宽度） */
  getColumnWidth: (col: ColumnType) => number | undefined;
  /** 检查列是否可拖拽 */
  isColumnResizable: (col: ColumnType) => boolean;
  /** 开始拖拽 */
  onStartResize: (e: React.MouseEvent, col: ColumnType) => void;
}

const ResizeContext = React.createContext<ResizeContextValue | null>(null);

export default ResizeContext;
