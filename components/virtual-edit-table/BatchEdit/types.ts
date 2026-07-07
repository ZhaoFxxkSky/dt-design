import type { TableColumn } from '../VirtualEditTable/types';

export type BatchEditMode = 'overwrite' | 'fillEmpty';

export type BatchRuleType = 'value' | 'replace' | 'sequence';

export type BatchRuleBase = {
  id: string;
  fieldKey: string;
  type: BatchRuleType;
};

export type ValueBatchRule = BatchRuleBase & {
  type: 'value';
  value: any;
  mode: BatchEditMode;
};

export type ReplaceMatchMode = 'exact' | 'contains';

export type ReplaceBatchRule = BatchRuleBase & {
  type: 'replace';
  oldValue: any;
  newValue: any;
};

export type ReplaceBatchRuleExt = ReplaceBatchRule & {
  matchMode: ReplaceMatchMode;
};

export type SequenceBatchRule = BatchRuleBase & {
  type: 'sequence';
  prefix: string;
  start: number;
  step: number;
  digitWidth?: number;
};

export type BatchRuleExt = ValueBatchRule | ReplaceBatchRuleExt | SequenceBatchRule;

export type BatchEditModalProps = {
  open: boolean;
  columns: TableColumn[];
  selectedRows: Set<number>;
  data: Record<string, any>[];
  onCancel: () => void;
  onOk: (rules: BatchRuleExt[]) => void;
};

export type RuleEditorProps = {
  rule: BatchRuleExt;
  idx: number;
  columns: TableColumn[];
  data: Record<string, any>[];
  selectedRows: Set<number>;
  totalRules: number;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onUpdate: (id: string, patch: Partial<BatchRuleExt>) => void;
  onRemove: (id: string) => void;
};

export type ValueRuleFormProps = {
  rule: ValueBatchRule;
  field: TableColumn;
  columns: TableColumn[];
  onUpdate: (id: string, patch: Partial<BatchRuleExt>) => void;
};

export type ReplaceRuleFormProps = {
  rule: ReplaceBatchRuleExt;
  field: TableColumn;
  columns: TableColumn[];
  data: Record<string, any>[];
  selectedRows: Set<number>;
  onUpdate: (id: string, patch: Partial<BatchRuleExt>) => void;
};

export type SequenceRuleFormProps = {
  rule: SequenceBatchRule;
  field: TableColumn;
  columns: TableColumn[];
  onUpdate: (id: string, patch: Partial<BatchRuleExt>) => void;
};
