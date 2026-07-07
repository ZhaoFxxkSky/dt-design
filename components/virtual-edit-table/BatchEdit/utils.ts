import { isEmpty } from '../_utils';
import type { TableColumn } from '../VirtualEditTable/types';
import type {
  BatchRuleExt,
  BatchRuleType,
  ReplaceBatchRuleExt,
  SequenceBatchRule,
  ValueBatchRule,
} from './types';

export const typeLabelMap: Record<BatchRuleType, string> = {
  value: '固定值填充',
  replace: '查找替换',
  sequence: '序列生成',
};

export const createRuleId = () => `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const createEmptyRule = (columns: TableColumn[]): BatchRuleExt => {
  const first = columns[0];
  return {
    id: createRuleId(),
    fieldKey: first?.key ?? '',
    type: 'value',
    value: undefined,
    mode: 'overwrite',
  } as ValueBatchRule;
};

export const isSequenceField = (field: TableColumn | undefined) =>
  field?.component === 'text' || field?.component === 'digit';

export const applyBatchRules = (
  rows: Record<string, any>[],
  selectedRows: Set<number>,
  columns: TableColumn[],
  rules: BatchRuleExt[],
): Record<string, any>[] => {
  let sequenceCounter = 0;

  return rows.map((row, i) => {
    if (!selectedRows.has(i)) return row;

    const next = { ...row };
    rules.forEach((rule) => {
      const field = columns.find((c) => c.key === rule.fieldKey);
      if (!field) return;

      if (rule.type === 'value') {
        if (rule.mode === 'overwrite' || isEmpty(next[field.key], field.component)) {
          next[field.key] = rule.value;
        }
      } else if (rule.type === 'replace') {
        const current = next[field.key];
        const normalize = (v: any) => (v === undefined || v === null ? '' : String(v));
        const oldStr = normalize(rule.oldValue);

        if (field.component === 'select') {
          const newValueEmpty = rule.newValue === undefined || rule.newValue === null || rule.newValue === '';
          if (Array.isArray(current)) {
            const shouldReplace = current.some((item) => normalize(item) === oldStr);
            if (shouldReplace) {
              next[field.key] = newValueEmpty
                ? current.filter((item) => normalize(item) !== oldStr)
                : current.map((item) => (normalize(item) === oldStr ? rule.newValue : item));
            }
          } else if (normalize(current) === oldStr) {
            next[field.key] = rule.newValue;
          }
        } else {
          const curStr = normalize(current);
          let matched = false;
          if (rule.matchMode === 'contains') {
            matched = curStr.includes(oldStr);
          } else {
            matched = curStr === oldStr;
          }
          if (matched) {
            if (rule.matchMode === 'contains' && oldStr !== '') {
              next[field.key] = curStr.split(oldStr).join(rule.newValue);
            } else {
              next[field.key] = rule.newValue;
            }
          }
        }
      } else if (rule.type === 'sequence') {
        if (!isSequenceField(field)) return;
        const num = rule.start + sequenceCounter * rule.step;
        const numStr = rule.digitWidth ? String(num).padStart(rule.digitWidth, '0') : String(num);
        next[field.key] = field.component === 'digit' ? num : `${rule.prefix}${numStr}`;
      }
    });
    sequenceCounter += 1;
    return next;
  });
};

export const normalizeRuleOnFieldChange = (
  rule: BatchRuleExt,
  nextFieldKey: string,
  columns: TableColumn[],
): BatchRuleExt => {
  const field = columns.find((c) => c.key === nextFieldKey);
  if (rule.type === 'sequence' && !isSequenceField(field)) {
    return {
      ...rule,
      type: 'value',
      value: undefined,
      mode: 'overwrite',
    } as ValueBatchRule;
  }
  return { ...rule, fieldKey: nextFieldKey };
};

export const resetRuleByType = (
  rule: BatchRuleExt,
  nextType: BatchRuleType,
): BatchRuleExt => {
  if (nextType === 'value') {
    return {
      id: rule.id,
      fieldKey: rule.fieldKey,
      type: 'value',
      value: undefined,
      mode: 'overwrite',
    } as ValueBatchRule;
  }
  if (nextType === 'replace') {
    return {
      id: rule.id,
      fieldKey: rule.fieldKey,
      type: 'replace',
      oldValue: undefined,
      newValue: undefined,
      matchMode: 'exact',
    } as ReplaceBatchRuleExt;
  }
  return {
    id: rule.id,
    fieldKey: rule.fieldKey,
    type: 'sequence',
    prefix: '',
    start: 1,
    step: 1,
    digitWidth: undefined,
  } as SequenceBatchRule;
};
