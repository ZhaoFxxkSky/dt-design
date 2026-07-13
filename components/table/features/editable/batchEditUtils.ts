import type { ColumnsType, ColumnType, EditableConfig } from '../../interface';
import type { AnyObject } from '../../../_util/type';
import type * as React from 'react';
import type { BatchRule, BatchRuleType } from './batchEditTypes';

// ============================================================
// 批量编辑工具函数
// ============================================================

/** 叶子列类型 */
type LeafColumn = ColumnType<AnyObject>;

/** 规则类型标签映射 */
export const typeLabelMap: Record<BatchRuleType, string> = {
  value: '固定值填充',
  replace: '查找替换',
  sequence: '序列生成',
};

/**
 * 扁平化列（处理列组 children）
 */
export const flattenColumns = (cols: ColumnsType): LeafColumn[] => {
  const result: LeafColumn[] = [];
  for (const col of cols) {
    if ('children' in col && col.children) {
      result.push(...flattenColumns(col.children));
    } else {
      result.push(col as LeafColumn);
    }
  }
  return result;
};

/** 生成唯一规则 ID */
export const createRuleId = (): string =>
  `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** 判断值是否为空 */
const isEmptyValue = (v: unknown): boolean =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);

/** 创建空规则 */
export const createEmptyRule = (columns: ColumnsType): BatchRule => {
  const flat = flattenColumns(columns);
  const first = flat[0];
  return {
    id: createRuleId(),
    fieldKey: String(first?.dataIndex ?? first?.key ?? ''),
    type: 'value',
    value: undefined,
    mode: 'overwrite',
  } as BatchRule;
};

/**
 * 从列上获取 EditableConfig
 */
const getColumnEditableConfig = (col: LeafColumn | undefined): EditableConfig | null => {
  if (!col) return null;
  const ed = col.editable;
  if (ed === true) return {};
  if (ed && typeof ed === 'object') return ed as EditableConfig;
  return null;
};

/**
 * 判断字段是否为数字/文本类型（支持序列生成）
 */
const isNumericOrTextField = (col: LeafColumn | undefined): boolean => {
  const editableConfig = getColumnEditableConfig(col);
  if (editableConfig) {
    return editableConfig.type === 'input' || editableConfig.type === 'number';
  }
  return true; // 默认认为是文本
};

/**
 * 应用批量编辑规则到数据
 *
 * @param rows 完整数据数组
 * @param selectedRowKeys 选中的行 key 集合
 * @param getRowKey 行 key 获取函数
 * @param columns 列配置
 * @param rules 批量编辑规则数组（按顺序执行）
 * @returns 更新后的数据数组
 */
export const applyBatchRules = <T extends AnyObject>(
  rows: T[],
  selectedRowKeys: React.Key[],
  getRowKey: (record: T, index: number) => React.Key,
  columns: ColumnsType,
  rules: BatchRule[],
): T[] => {
  const selectedKeySet = new Set(selectedRowKeys);
  const flatCols = flattenColumns(columns);
  const colMap = new Map<string, LeafColumn>();
  flatCols.forEach((col) => {
    const key = String(col.dataIndex ?? col.key);
    if (key) colMap.set(key, col);
  });

  let sequenceCounter = 0;

  return rows.map((row, i) => {
    if (!selectedKeySet.has(getRowKey(row, i))) return row;

    const next: Record<string, unknown> = { ...row };
    rules.forEach((rule) => {
      const col = colMap.get(rule.fieldKey);
      if (!col) return;

      if (rule.type === 'value') {
        if (rule.mode === 'overwrite' || isEmptyValue(next[rule.fieldKey])) {
          next[rule.fieldKey] = rule.value;
        }
      } else if (rule.type === 'replace') {
        const current = next[rule.fieldKey];
        const normalize = (v: unknown) => (v === undefined || v === null ? '' : String(v));
        const oldStr = normalize(rule.oldValue);

        const editableConfig = getColumnEditableConfig(col);
        const isSelectField = editableConfig?.type === 'select';

        if (isSelectField) {
          if (Array.isArray(current)) {
            const shouldReplace = current.some((item) => normalize(item) === oldStr);
            if (shouldReplace) {
              const newValueEmpty = isEmptyValue(rule.newValue);
              next[rule.fieldKey] = newValueEmpty
                ? current.filter((item) => normalize(item) !== oldStr)
                : current.map((item) => (normalize(item) === oldStr ? rule.newValue : item));
            }
          } else if (normalize(current) === oldStr) {
            next[rule.fieldKey] = rule.newValue;
          }
        } else {
          const curStr = normalize(current);
          let matched = false;
          if (rule.matchMode === 'contains') {
            matched = oldStr !== '' && curStr.includes(oldStr);
          } else {
            matched = curStr === oldStr;
          }
          if (matched) {
            if (rule.matchMode === 'contains' && oldStr !== '') {
              next[rule.fieldKey] = curStr.split(oldStr).join(normalize(rule.newValue));
            } else {
              next[rule.fieldKey] = rule.newValue;
            }
          }
        }
      } else if (rule.type === 'sequence') {
        if (!isNumericOrTextField(col)) return;
        const num = rule.start + sequenceCounter * rule.step;
        const numStr = rule.digitWidth ? String(num).padStart(rule.digitWidth, '0') : String(num);
        const editableConfig = getColumnEditableConfig(col);
        const isNumberField = editableConfig?.type === 'number';
        next[rule.fieldKey] = isNumberField ? num : `${rule.prefix}${numStr}`;
      }
    });
    sequenceCounter += 1;
    return next as T;
  });
};

/**
 * 字段切换时规范化规则
 */
export const normalizeRuleOnFieldChange = (
  rule: BatchRule,
  nextFieldKey: string,
  columns: ColumnsType,
): BatchRule => {
  const flatCols = flattenColumns(columns);
  const col = flatCols.find((c) => String(c.dataIndex ?? c.key) === nextFieldKey);
  if (rule.type === 'sequence' && !isNumericOrTextField(col)) {
    return {
      id: rule.id,
      fieldKey: nextFieldKey,
      type: 'value',
      value: undefined,
      mode: 'overwrite',
    } as BatchRule;
  }
  return { ...rule, fieldKey: nextFieldKey };
};

/**
 * 规则类型切换时重置规则
 */
export const resetRuleByType = (rule: BatchRule, nextType: BatchRuleType): BatchRule => {
  if (nextType === 'value') {
    return {
      id: rule.id,
      fieldKey: rule.fieldKey,
      type: 'value',
      value: undefined,
      mode: 'overwrite',
    };
  }
  if (nextType === 'replace') {
    return {
      id: rule.id,
      fieldKey: rule.fieldKey,
      type: 'replace',
      oldValue: undefined,
      newValue: undefined,
      matchMode: 'exact',
    };
  }
  return {
    id: rule.id,
    fieldKey: rule.fieldKey,
    type: 'sequence',
    prefix: '',
    start: 1,
    step: 1,
    digitWidth: undefined,
  };
};

/**
 * 获取可批量编辑的列（有 dataIndex 且可编辑的列）
 */
export const getBatchEditableColumns = (columns: ColumnsType): LeafColumn[] => {
  return flattenColumns(columns).filter((col) => {
    if (!col.dataIndex && col.dataIndex !== 0) return false;
    return true;
  });
};

/**
 * 判断字段是否支持序列生成
 */
export const isSequenceSupported = (columns: ColumnsType, fieldKey: string): boolean => {
  const flatCols = flattenColumns(columns);
  const col = flatCols.find((c) => String(c.dataIndex ?? c.key) === fieldKey);
  return isNumericOrTextField(col);
};
