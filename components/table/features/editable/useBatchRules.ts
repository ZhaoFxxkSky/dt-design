import * as React from 'react';
import type { ColumnsType } from '../../interface';
import type { BatchRule, BatchRuleType } from './batchEditTypes';
import { createEmptyRule, normalizeRuleOnFieldChange, resetRuleByType } from './batchEditUtils';

/**
 * 批量编辑规则管理 hook
 *
 * - 打开时自动创建一条空规则
 * - 支持规则的增删改、上下移动
 * - 字段切换时自动规范化规则类型
 */
function useBatchRules(open: boolean, columns: ColumnsType) {
  const [rules, setRules] = React.useState<BatchRule[]>([]);

  React.useEffect(() => {
    if (open) {
      setRules(columns.length > 0 ? [createEmptyRule(columns)] : []);
    }
  }, [open, columns]);

  const moveRule = React.useCallback((id: string, direction: 'up' | 'down') => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx < 0) return prev;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const updateRule = React.useCallback(
    (id: string, patch: Partial<BatchRule>) => {
      setRules((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;

          // 字段切换
          if (patch.fieldKey && patch.fieldKey !== r.fieldKey) {
            return normalizeRuleOnFieldChange(r, patch.fieldKey, columns);
          }

          // 规则类型切换
          if (patch.type && patch.type !== r.type) {
            return resetRuleByType(r, patch.type as BatchRuleType);
          }

          return { ...r, ...patch } as BatchRule;
        }),
      );
    },
    [columns],
  );

  const removeRule = React.useCallback((id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRule = React.useCallback(() => {
    setRules((prev) => (columns.length > 0 ? [...prev, createEmptyRule(columns)] : prev));
  }, [columns]);

  return { rules, moveRule, updateRule, removeRule, addRule };
}

export default useBatchRules;
