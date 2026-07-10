import './style';

export type { SizeType } from '../_util/type';
export type { ColumnProps } from './Column';
export { default as Column } from './Column';
export { default as ColumnGroup } from './ColumnGroup';

export { default as Summary } from './components/Footer/Summary';
// Re-export core rc-table for advanced usage
export { DEFAULT_PREFIX, genTable } from './components/RcTable';

export type { CompareProps } from './components/RcTable';
export {
  genVirtualTable,
  default as VirtualTable,
} from './components/VirtualTableBody';

export type { VirtualTableProps } from './components/VirtualTableBody';
export { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';
export { convertChildrenToColumns } from './features/columns';

// 批量编辑
export { default as BatchEditModal } from './features/editable/BatchEditModal';
export type {
  BatchEditModalProps,
  BatchEditMode,
  BatchRule,
  BatchRuleType,
} from './features/editable/batchEditTypes';

export { applyBatchRules } from './features/editable/batchEditUtils';

export type { FixedInfo } from './features/fixed/fixUtil';
// Column types
export type {
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  EditableConfig,
  EditableError,
  EditableErrors,
  EditableRule,
  EditableValidateResult,
  EditorType,
} from './interface';
// Core-only types (not in antd wrapper)
export type {
  AlignType,
  CellEllipsisType,
  CellType,
  ColScopeType,
  CustomizeComponent,
  CustomizeScrollBody,
  DataIndex,
  DefaultRecordType,
  Direction,
  ExpandableConfig,
  ExpandableType,
  ExpandedRowRender,
  FixedType,
  GetComponent,
  GetComponentProps,
  GetRowKey,
  Key,
  LegacyExpandableProps,
  OnCustomizeScroll,
  PanelRender,
  Reference,
  RenderedCell,
  RenderExpandIcon,
  RenderExpandIconProps,
  RowClassName,
  RowScopeType,
  ScopeType,
  ScrollConfig,
  StickyOffsets,
  TableComponents,
  TableLayout,
  TableSticky,
  TriggerEventHandler,
  VirtualScrollConfig,
} from './interface';

export type { TablePaginationConfig, TableProps } from './InternalTable';

export { default as TableContext } from './shared/context/TableContext';

export { makeImmutable, responseImmutable } from './shared/context/TableContext';

export type { ScrollInfoType, TableContextProps } from './shared/context/TableContext';
export { INTERNAL_COL_DEFINE } from './shared/utils/legacyUtil';
// Export the antd v5 1:1 compatible Table as default
export { default as Table } from './Table';
