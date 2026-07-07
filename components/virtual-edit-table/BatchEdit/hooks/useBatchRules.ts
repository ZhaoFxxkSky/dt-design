import React from 'react';
import type { TableColumn } from '../../VirtualEditTable/types';
import type { BatchRuleExt } from '../types';
import { createEmptyRule, normalizeRuleOnFieldChange, resetRuleByType } from '../utils';

const useBatchRules = (open: boolean, columns: TableColumn[]) => {
  const [rules, setRules] = React.useState<BatchRuleExt[]>([]);

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
    (id: string, patch: Partial<BatchRuleExt>) => {
      setRules((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;

          if (patch.fieldKey && patch.fieldKey !== r.fieldKey) {
            return normalizeRuleOnFieldChange(r, patch.fieldKey, columns);
          }

          if (patch.type && patch.type !== r.type) {
            return resetRuleByType(r, patch.type);
          }

          return { ...r, ...patch } as BatchRuleExt;
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
};

export default useBatchRules;
