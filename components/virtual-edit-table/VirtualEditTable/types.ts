import type React from 'react';
import type {
  DatePickerProps,
  InputNumberProps,
  InputProps,
  SelectProps,
  SwitchProps,
} from 'antd';
import type { TextAreaProps } from 'antd/lib/input';
import type { ColumnDef } from '@tanstack/react-table';
import type { FieldRenderer } from '../FieldEditor/types';
import type { FieldDisplayRenderer } from '../FieldDisplay/types';

export type TableComponent = 'text' | 'textarea' | 'digit' | 'date' | 'select' | 'switch';

/** @deprecated use TableComponent */
export type EditTableComponent = TableComponent;

export type DependencyRuleThen = {
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  clearValue?: boolean;
};

export type DependencyRule = {
  /** 依赖字段的 key */
  field: string;
  /** 匹配条件 */
  when: 'empty' | 'notEmpty' | 'eq' | 'neq' | 'in' | 'nin';
  /** 用于 eq/neq/in/nin 的对比值；in/nin 时可以是数组 */
  value?: any;
  /** 命中后的状态覆盖 */
  then: DependencyRuleThen;
};

type BaseTableColumn = {
  name: string;
  key: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  group?: string;
  fixed?: 'left' | 'right';
  width?: number;
  /** 表头提示 */
  tip?: React.ReactNode;
  /** 联动规则：根据同排其他字段的值动态改变本字段的必填/禁用/隐藏/清空 */
  dependencies?: DependencyRule[];
};

export type TableTextColumn = BaseTableColumn & {
  component: 'text';
  fieldProps?: InputProps;
};

export type TableTextAreaColumn = BaseTableColumn & {
  component: 'textarea';
  fieldProps?: TextAreaProps;
};

export type TableDigitColumn = BaseTableColumn & {
  component: 'digit';
  fieldProps?: InputNumberProps;
};

export type TableDateColumn = BaseTableColumn & {
  component: 'date';
  fieldProps?: DatePickerProps;
};

export type TableSelectColumn = BaseTableColumn & {
  component: 'select';
  fieldProps?: SelectProps;
};

export type TableSwitchColumn = BaseTableColumn & {
  component: 'switch';
  fieldProps?: SwitchProps;
};

export type TableCustomColumn = BaseTableColumn & {
  component: string;
  fieldProps?: Record<string, any>;
};

export type TableColumn =
  | TableTextColumn
  | TableTextAreaColumn
  | TableDigitColumn
  | TableDateColumn
  | TableSelectColumn
  | TableSwitchColumn
  | TableCustomColumn
  | BaseTableColumn;

/** @deprecated use TableColumn */
export type EditTableColumn = TableColumn;

export type VirtualTableValidateResult = {
  valid: boolean;
  firstError?: { rowIndex: number; fieldKey: string; message: string };
  errors: Map<string, string[]>;
};

/** @deprecated use VirtualTableValidateResult */
export type VirtualEditTableValidateResult = VirtualTableValidateResult;

export type VirtualTableRef = {
  validate: () => VirtualTableValidateResult;
  scrollToRow: (index: number) => void;
};

/** @deprecated use VirtualTableRef */
export type VirtualEditTableRef = VirtualTableRef;

export type RowSelection = {
  type?: 'checkbox' | 'radio';
  hideSelectAll?: boolean;
  getCheckboxProps?: (record: any, index: number) => { disabled?: boolean };
  selections?:
    | false
    | {
        key: string;
        text: React.ReactNode;
        onSelect?: (changeableRowKeys: string[]) => string[] | void;
      }[];
};

export type VirtualTableProps = {
  editable?: boolean;
  rowSelection?: false | RowSelection;
  columns: TableColumn[];
  value?: Record<string, any>[];
  onChange?: (value: Record<string, any>[]) => void;
  onRowSelect?: (selectedRows: Set<number>, rows: Record<string, any>[]) => void;
  onValidate?: (result: VirtualTableValidateResult) => void;
  rowKey?: string | ((record: Record<string, any>, index: number) => string);
  height?: number;
  addable?: boolean;
  createEmptyRow?: () => Record<string, any>;
  title?: string;
  striped?: boolean;
  extraActions?: React.ReactNode;
  emptyRender?: React.ReactNode;
  fieldRenderers?: Record<string, FieldRenderer>;
  displayRenderers?: Record<string, FieldDisplayRenderer>;
};

/** @deprecated use VirtualTableProps */
export type VirtualEditTableProps = VirtualTableProps;

export type TableRow = Record<string, any>;
/** @deprecated use TableRow */
export type EditTableRow = TableRow;

export type TableColumnDef = ColumnDef<TableRow>;
/** @deprecated use TableColumnDef */
export type EditTableColumnDef = TableColumnDef;
