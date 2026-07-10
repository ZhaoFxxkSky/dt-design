import type { ColumnsType } from '../../interface';
import type { AnyObject } from '../../_util/type';
import type * as React from 'react';

// ============================================================
// 批量编辑规则类型定义
// ============================================================

/** 批量编辑模式 */
export type BatchEditMode = 'overwrite' | 'fillEmpty';

/** 批量规则类型 */
export type BatchRuleType = 'value' | 'replace' | 'sequence';

/** 查找替换的匹配方式 */
export type ReplaceMatchMode = 'exact' | 'contains';

/** 规则基础 */
export interface BatchRuleBase {
  id: string;
  fieldKey: string;
  type: BatchRuleType;
}

/** 固定值填充规则 */
export interface ValueBatchRule extends BatchRuleBase {
  type: 'value';
  value: unknown;
  mode: BatchEditMode;
}

/** 查找替换规则 */
export interface ReplaceBatchRule extends BatchRuleBase {
  type: 'replace';
  oldValue: unknown;
  newValue: unknown;
  matchMode: ReplaceMatchMode;
}

/** 序列生成规则 */
export interface SequenceBatchRule extends BatchRuleBase {
  type: 'sequence';
  prefix: string;
  start: number;
  step: number;
  digitWidth?: number;
}

/** 批量规则联合类型 */
export type BatchRule = ValueBatchRule | ReplaceBatchRule | SequenceBatchRule;

/** BatchEditModal 属性 */
export interface BatchEditModalProps {
  /** 是否打开 */
  open: boolean;
  /** 列配置 */
  columns: ColumnsType;
  /** 选中行的 key 集合 */
  selectedRowKeys: React.Key[];
  /** 完整数据 */
  data: AnyObject[];
  /** 获取行 key 的函数 */
  getRowKey: (record: AnyObject, index: number) => React.Key;
  /** 取消 */
  onCancel: () => void;
  /** 确认应用 — 返回更新后的数据 */
  onApply: (newData: AnyObject[]) => void;
}
