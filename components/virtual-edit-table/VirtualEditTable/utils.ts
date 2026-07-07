import type { Column, Header } from '@tanstack/react-table';
import type React from 'react';
import { cellErrorKey, isEmpty } from '../_utils';
import type {
  DependencyRule,
  TableColumn,
  TableColumnDef,
  TableRow,
} from './types';
import { MIN_COL_WIDTH } from './constants';

export { cellErrorKey, isEmpty };

export const isLeafColumn = (column: Column<TableRow>): boolean =>
  !column.columns || column.columns.length === 0;

export const getPinningStyles = (column: Column<TableRow>): React.CSSProperties => {
  const isPinned = column.getIsPinned();
  if (!isPinned) {
    return { position: 'relative', zIndex: 0 };
  }

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    position: 'sticky',
    width: column.getSize(),
    zIndex: 2,
  };
};

export const getHeaderPinningStyles = (
  header: Header<TableRow, unknown>,
): React.CSSProperties => {
  const column = header.column;
  const isPinned = column.getIsPinned();
  if (!isPinned || !isLeafColumn(column)) {
    return { position: 'relative', zIndex: 0 };
  }

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    position: 'sticky',
    width: header.getSize(),
    zIndex: 3,
  };
};

export const buildGroupedColumns = (
  fields: TableColumn[],
  renderLeaf: (field: TableColumn) => TableColumnDef,
): TableColumnDef[] => {
  const groups = new Map<string, TableColumn[]>();
  const ungrouped: TableColumn[] = [];

  fields.forEach((field) => {
    if (field.group) {
      const list = groups.get(field.group) ?? [];
      list.push(field);
      groups.set(field.group, list);
    } else {
      ungrouped.push(field);
    }
  });

  const result: TableColumnDef[] = ungrouped.map(renderLeaf);
  groups.forEach((list, groupName) => {
    result.push({
      id: `group-${groupName}`,
      header: groupName,
      columns: list.map(renderLeaf),
    });
  });
  return result;
};

export const getColumnSize = (
  columnId: string,
  columns: TableColumn[],
  colWidths: number[],
): number => {
  const idx = columns.findIndex((c) => c.key === columnId);
  return colWidths[idx] ?? MIN_COL_WIDTH;
};

const matchDependencyRule = (record: Record<string, any>, rule: DependencyRule): boolean => {
  const depValue = record[rule.field];
  const depEmpty = isEmpty(depValue);

  switch (rule.when) {
    case 'empty':
      return depEmpty;
    case 'notEmpty':
      return !depEmpty;
    case 'eq':
      return depValue === rule.value;
    case 'neq':
      return depValue !== rule.value;
    case 'in': {
      const values = Array.isArray(rule.value) ? rule.value : [rule.value];
      return values.includes(depValue);
    }
    case 'nin': {
      const values = Array.isArray(rule.value) ? rule.value : [rule.value];
      return !values.includes(depValue);
    }
    default:
      return false;
  }
};

export type FieldState = {
  required: boolean;
  disabled: boolean;
  hidden: boolean;
  clearValue: boolean;
};

export const getFieldState = (record: Record<string, any>, field: TableColumn): FieldState => {
  const state: FieldState = {
    required: field.required ?? false,
    disabled: field.disabled ?? false,
    hidden: false,
    clearValue: false,
  };

  field.dependencies?.forEach((rule) => {
    if (!matchDependencyRule(record, rule)) return;
    if (rule.then.required !== undefined) state.required = rule.then.required;
    if (rule.then.disabled !== undefined) state.disabled = rule.then.disabled;
    if (rule.then.hidden !== undefined) state.hidden = rule.then.hidden;
    if (rule.then.clearValue) state.clearValue = true;
  });

  return state;
};

export const getEmptyValue = (fieldValue: any): any =>
  Array.isArray(fieldValue) ? [] : undefined;

/** 判断字段是否“可能必填”：基础必填，或任意联动规则会把它设为必填 */
export const isPotentiallyRequired = (field: TableColumn): boolean => {
  if (field.required) return true;
  return field.dependencies?.some((rule) => rule.then.required === true) ?? false;
};
