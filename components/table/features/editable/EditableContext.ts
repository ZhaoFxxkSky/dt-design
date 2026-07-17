import * as React from 'react';
import type { AnyObject } from '../../../_util/type';

/**
 * EditableContext 的类型定义。
 *
 * 独立于 useEditable.ts，避免循环依赖：
 *   index.ts → EditableCell.tsx → EditableContext.ts → useEditable.ts
 *   index.ts → useEditable.ts (barrel re-export)
 *
 * 当 webpack 处理 barrel export 时，上述循环会导致 useEditable.ts
 * 在尚未完成模块初始化时被 EditableContext.ts 引用，拿到空对象。
 *
 * 类型策略：
 *   - cell value 使用 `any`：单元格值可能是 string / number / boolean / array 等任意类型，
 *     使用 `unknown` 会迫使所有编辑器内部都做类型断言，降低可用性。
 *   - record 使用 `AnyObject`：行数据始终是对象。
 */
export interface EditableContextValue {
  /** 错误 Map: key = `${rowKey}-${dataIndex}`（无 key 时降级为 `${rowIndex}-${dataIndex}`） */
  errors: Map<string, string[]>;
  /** 校验单个单元格 */
  validateCell: (
    rowKey: React.Key | undefined,
    dataIndex: string | number,
    value: any,
    record: AnyObject,
    rowIndex?: number,
  ) => void;
  /** 校验全部数据 */
  validateAll: (data: AnyObject[]) => void;
  /** 重置所有错误 */
  resetErrors: () => void;
  /** 更新单元格值 */
  onCellChange: (
    rowKey: React.Key | undefined,
    dataIndex: string | number,
    value: any,
    record: AnyObject,
    rowIndex: number,
  ) => void;
  /** 滚动到错误行 */
  scrollToError: (rowKey: React.Key, rowIndex?: number) => void;
}

const EditableContext = React.createContext<EditableContextValue | null>(null);

export default EditableContext;
