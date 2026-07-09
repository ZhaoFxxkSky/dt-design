import './style';

// Export the antd v5 1:1 compatible Table as default
export { default as Table } from './Table';
export type { TableProps, TablePaginationConfig } from './InternalTable';
export type { ColumnProps } from './Column';
export type { SizeType } from '../_util/type';

// Re-export core rc-table for advanced usage
export { genTable, DEFAULT_PREFIX } from './components/RcTable';
export type { CompareProps } from './components/RcTable';

export {
  default as VirtualTable,
  genVirtualTable,
} from './components/VirtualTableBody';
export type { VirtualTableProps } from './components/VirtualTableBody';

export { default as Summary } from './components/Footer/Summary';
export { default as Column } from './Column';
export { default as ColumnGroup } from './ColumnGroup';

export { convertChildrenToColumns } from './features/columns';
export { INTERNAL_COL_DEFINE } from './shared/utils/legacyUtil';

export { EXPAND_COLUMN, INTERNAL_HOOKS } from './constant';

export { default as TableContext } from './shared/context/TableContext';
export { makeImmutable, responseImmutable } from './shared/context/TableContext';
export type { TableContextProps, ScrollInfoType } from './shared/context/TableContext';

// Column types
export type {
  ColumnGroupType,
  ColumnsType,
  ColumnType,
  EditableConfig,
  EditableRule,
  EditorType,
  EditableError,
} from './interface';

// Core-only types (not in antd wrapper)
export type {
  Key,
  FixedType,
  DefaultRecordType,
  TableLayout,
  ScrollConfig,
  VirtualScrollConfig,
  Reference,
  RowClassName,
  CellType,
  RenderedCell,
  Direction,
  DataIndex,
  CellEllipsisType,
  ColScopeType,
  RowScopeType,
  ScopeType,
  AlignType,
  GetRowKey,
  StickyOffsets,
  GetComponentProps,
  CustomizeComponent,
  OnCustomizeScroll,
  CustomizeScrollBody,
  TableComponents,
  GetComponent,
  ExpandableType,
  LegacyExpandableProps,
  ExpandedRowRender,
  RenderExpandIconProps,
  RenderExpandIcon,
  ExpandableConfig,
  PanelRender,
  TriggerEventHandler,
  TableSticky,
} from './interface';

export type { FixedInfo } from './features/fixed/fixUtil';
