import type { TableColumn } from './VirtualEditTable/types';

export const isEmpty = (value: any, component?: string) => {
  if (component === 'switch') return value !== true && value !== false;
  if (Array.isArray(value)) return value.length === 0;
  return value === undefined || value === null || String(value).trim() === '';
};

export const cellErrorKey = (rowIndex: number, fieldKey: string) => `${rowIndex}-${fieldKey}`;

export const buildPlaceholder = (field: TableColumn) =>
  field.component === 'select' || field.component === 'date'
    ? `请选择${field.name}`
    : `请输入${field.name}`;
