import * as React from 'react';

/**
 * EditableContext 的类型定义。
 *
 * 独立于 useEditable.ts，避免循环依赖：
 *   index.ts → EditableCell.tsx → EditableContext.ts → useEditable.ts
 *   index.ts → useEditable.ts (barrel re-export)
 *
 * 当 webpack 处理 barrel export 时，上述循环会导致 useEditable.ts
 * 在尚未完成模块初始化时被 EditableContext.ts 引用，拿到空对象。
 */
export interface EditableContextValue {
  /** 错误 Map: key = `${rowIndex}-${dataIndex}` */
  errors: Map<string, string[]>;
  /** 校验单个单元格 */
  validateCell: (rowIndex: number, dataIndex: string | number, value: any, record: any) => void;
  /** 校验全部数据 */
  validateAll: (data: any[], getRowKey?: (record: any, index: number) => React.Key) => any;
  /** 重置所有错误 */
  resetErrors: () => void;
  /** 更新单元格值 */
  onCellChange: (rowIndex: number, dataIndex: string | number, value: any, record: any) => void;
  /** 错误版本号（驱动重渲染） */
  errorsVersion: number;
  /** 滚动到错误行 */
  scrollToError: (rowIndex: number) => void;
}

const EditableContext = React.createContext<EditableContextValue | null>(null);

export default EditableContext;
