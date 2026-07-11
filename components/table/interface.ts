import type * as React from 'react';
import type { Breakpoint } from '../_util/hooks/useBreakpoint';
import type { AnyObject } from '../_util/type';
import type { CheckboxProps } from 'antd/es/checkbox';
import type { DropdownProps } from 'antd/es/dropdown';
import type { PaginationProps } from 'antd/es/pagination';
import type { TooltipProps } from 'antd/es/tooltip';
import type { INTERNAL_SELECTION_ITEM } from './features/selection/useSelection';
import type { InternalTableProps, TableProps } from './InternalTable';

// ===================== namePathType.ts =====================

type BaseNamePath = string | number | boolean | (string | number | boolean)[];
/**
 * Store: The store type from `FormInstance<Store>`
 * ParentNamePath: Auto generate by nest logic. Do not fill manually.
 */
export type DeepNamePath<
  Store = any,
  ParentNamePath extends any[] = [],
> = ParentNamePath['length'] extends 3
  ? never
  : // Follow code is batch check if `Store` is base type
    true extends (Store extends BaseNamePath ? true : false)
    ? ParentNamePath['length'] extends 0
      ? Store | BaseNamePath // Return `BaseNamePath` instead of array if `ParentNamePath` is empty
      : Store extends any[]
        ? [...ParentNamePath, number] // Connect path
        : never
    : Store extends any[] // Check if `Store` is `any[]`
      ? // Connect path. e.g. { a: { b: string } }[]
        // Get: [a] | [ a,number] | [ a ,number , b]
        [...ParentNamePath, number] | DeepNamePath<Store[number], [...ParentNamePath, number]>
      : keyof Store extends never // unknown
        ? Store
        : {
            // Convert `Store` to <key, value>. We mark key a `FieldKey`
            [FieldKey in keyof Store]: Store[FieldKey] extends (...args: any[]) => any
              ? never
              :
                  | (ParentNamePath['length'] extends 0 ? FieldKey : never) // If `ParentNamePath` is empty, it can use `FieldKey` without array path
                  | [...ParentNamePath, FieldKey] // Exist `ParentNamePath`, connect it
                  | DeepNamePath<Required<Store>[FieldKey], [...ParentNamePath, FieldKey]>; // If `Store[FieldKey]` is object
          }[keyof Store];

// ===================== Core interface =====================

/**
 * ColumnType which applied in antd: https://ant.design/components/table-cn/#Column
 * - defaultSortOrder
 * - filterDropdown
 * - filterDropdownVisible
 * - filtered
 * - filteredValue
 * - filterIcon
 * - filterMultiple
 * - filters
 * - sorter
 * - sortOrder
 * - sortDirections
 * - onFilter
 * - onFilterDropdownVisibleChange
 */

export type Key = React.Key;

/**
 * Use `start` or `end` instead. `left` or `right` is deprecated.
 */
export type FixedType = 'start' | 'end' | 'left' | 'right' | boolean;

export type DefaultRecordType = Record<string, any>;

export type TableLayout = 'auto' | 'fixed';

export type ScrollConfig = {
  /** The index of the row to scroll to */
  index?: number;
  /** The key of the row to scroll to */
  key?: Key;
  /** The absolute scroll position from top */
  top?: number;
  /**
   * Additional offset in pixels to apply to the scroll position.
   * Only effective when using `key` or `index` mode.
   * Ignored when using `top` mode.
   * In `key` / `index` mode, `offset` is added to the position resolved by `align`.
   */
  offset?: number;

  align?: ScrollLogicalPosition;
};

export type VirtualScrollConfig = ScrollConfig & {
  align?: Exclude<ScrollLogicalPosition, 'center'>;
};

export type EditableErrors = Map<string, string[]>;

export interface EditableValidateResult {
  valid: boolean;
  firstError?: { rowIndex: number; dataIndex: string | number; message: string };
  errors: EditableErrors;
}

export type Reference = {
  nativeElement: HTMLDivElement;
  scrollTo: (config: ScrollConfig) => void;
  /** 校验全部可编辑单元格，返回校验结果 */
  validate: () => EditableValidateResult;
  /** 重置所有校验错误 */
  resetErrors: () => void;
  /** 重置所有列宽为初始弹性分配（清除用户拖拽记录） */
  resetColumnWidths: () => void;
};

// ==================== Row =====================
export type RowClassName<RecordType> = (
  record: RecordType,
  index: number,
  indent: number,
) => string;

// =================== Column ===================
export interface CellType<RecordType> {
  key?: Key;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  column?: ColumnsType<RecordType>[number];
  colSpan?: number;
  rowSpan?: number;

  /** Only used for table header */
  hasSubColumns?: boolean;
  colStart?: number;
  colEnd?: number;
}

export interface RenderedCell<RecordType> {
  props?: CellType<RecordType>;
  children?: React.ReactNode;
}

export type Direction = 'ltr' | 'rtl';

// SpecialString will be removed in antd@6
export type SpecialString<T> = T | (string & NonNullable<unknown>);

export type DataIndex<T = any> =
  | DeepNamePath<T>
  | SpecialString<T>
  | number
  | (SpecialString<T> | number)[];

export type CellEllipsisType = { showTitle?: boolean } | boolean;

export type ColScopeType = 'col' | 'colgroup';

export type RowScopeType = 'row' | 'rowgroup';

export type ScopeType = ColScopeType | RowScopeType;

// ===================== Editable Types =====================

export type EditorType = 'input' | 'textarea' | 'number' | 'select' | 'switch' | 'custom';

export interface EditableRule<RecordType = AnyObject> {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  validator?: (value: any, record: RecordType) => string | undefined | Promise<string | undefined>;
}

export interface EditableConfig<RecordType = AnyObject> {
  type?: EditorType;
  options?: { label: React.ReactNode; value: any }[];
  /** 透传给底层 antd 组件的额外 props（如 min/max/step/rows 等） */
  props?: Record<string, any>;
  renderEditor?: (
    value: any,
    record: RecordType,
    index: number,
    onChange: (value: any) => void,
  ) => React.ReactNode;
  rules?: EditableRule<RecordType>[];
  onChange?: (value: any, record: RecordType, index: number) => void;
  onSave?: (value: any, record: RecordType, index: number) => void;
}

export interface EditableError {
  rowKey: React.Key;
  dataIndex: string;
  message: string;
}

interface ColumnSharedType<RecordType> {
  title?: React.ReactNode;
  key?: Key;
  className?: string;
  hidden?: boolean;
  fixed?: FixedType;
  onHeaderCell?: GetComponentProps<ColumnsType<RecordType>[number]>;
  ellipsis?: CellEllipsisType;
  align?: AlignType;
  rowScope?: RowScopeType;
}

export interface ColumnGroupType<RecordType = AnyObject>
  extends Omit<ColumnType<RecordType>, 'dataIndex'> {
  children: ColumnsType<RecordType>;
}

export type AlignType = 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';

export interface ColumnType<RecordType = AnyObject> extends ColumnSharedType<RecordType> {
  colSpan?: number;
  dataIndex?: DataIndex<RecordType>;
  render?: (
    value: any,
    record: RecordType,
    index: number,
  ) => React.ReactNode | RenderedCell<RecordType>;
  shouldCellUpdate?: (record: RecordType, prevRecord: RecordType) => boolean;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  /** 最大列宽（用于列宽拖拽限制） */
  maxWidth?: number;
  onCell?: GetComponentProps<RecordType>;
  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: RecordType, e: React.MouseEvent<HTMLElement>) => void;

  /** 是否可拖拽调整列宽，覆盖 Table.resizable */
  resizable?: boolean;
  /** 列宽变化回调 */
  onResize?: (width: number) => void;

  /** 可编辑配置，可为 boolean 或详细配置对象 */
  editable?: boolean | EditableConfig<RecordType>;

  // antd wrapper extensions
  title?: ColumnTitle<RecordType>;
  sorter?: boolean | CompareFn<RecordType> | ColumnSorter<RecordType>;
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  sortIcon?: (props: { sortOrder: SortOrder }) => React.ReactNode;
  showSorterTooltip?: boolean | SorterTooltipProps;

  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?: React.ReactNode | ((props: FilterDropdownProps) => React.ReactNode);
  filterOnClose?: boolean;
  filterMultiple?: boolean;
  filteredValue?: FilterValue | null;
  defaultFilteredValue?: FilterValue | null;
  filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode);
  filterMode?: 'menu' | 'tree';
  filterSearch?: FilterSearchType<ColumnFilterItem>;
  onFilter?: (value: React.Key | boolean, record: RecordType) => boolean;
  filterDropdownProps?: CoverableDropdownProps;
  filterResetToDefaultFilteredValue?: boolean;

  responsive?: Breakpoint[];

  /** @deprecated Please use `filterDropdownProps.open` instead. */
  filterDropdownOpen?: boolean;
  /** @deprecated Please use `filterDropdownProps.onOpenChange` instead. */
  onFilterDropdownOpenChange?: (visible: boolean) => void;
}

export type ColumnsType<RecordType = AnyObject> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
)[];

export type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;

// ================= Fix Column =================
export interface StickyOffsets {
  start: readonly number[];
  end: readonly number[];
  widths: readonly number[];
  isSticky?: boolean;
}

// ================= Customized =================
export type GetComponentProps<DataType> = (
  data: DataType,
  index?: number,
) => React.HTMLAttributes<any> & React.TdHTMLAttributes<any>;

type Component<P> =
  | React.ComponentType<P>
  | React.ForwardRefExoticComponent<P>
  | React.FC<P>
  | keyof React.JSX.IntrinsicElements;

export type CustomizeComponent = Component<any>;

export type OnCustomizeScroll = (info: {
  currentTarget?: HTMLElement;
  scrollLeft?: number;
}) => void;

export type CustomizeScrollBody<RecordType> = (
  data: readonly RecordType[],
  info: {
    scrollbarSize: number;
    ref: React.Ref<{ scrollLeft: number; scrollTo?: (scrollConfig: ScrollConfig) => void }>;
    onScroll: OnCustomizeScroll;
  },
) => React.ReactNode;

export interface TableComponents<RecordType> {
  table?: CustomizeComponent;
  header?: {
    table?: CustomizeComponent;
    wrapper?: CustomizeComponent;
    row?: CustomizeComponent;
    cell?: CustomizeComponent;
  };
  body?:
    | CustomizeScrollBody<RecordType>
    | {
        wrapper?: CustomizeComponent;
        row?: CustomizeComponent;
        cell?: CustomizeComponent;
      };
}

export type GetComponent = (
  path: readonly string[],
  defaultComponent?: CustomizeComponent,
) => CustomizeComponent;

// =================== Expand ===================
export type ExpandableType = false | 'row' | 'nest';

export interface LegacyExpandableProps<RecordType> {
  /** @deprecated Use `expandable.expandedRowKeys` instead */
  expandedRowKeys?: readonly Key[];
  /** @deprecated Use `expandable.defaultExpandedRowKeys` instead */
  defaultExpandedRowKeys?: readonly Key[];
  /** @deprecated Use `expandable.expandedRowRender` instead */
  expandedRowRender?: ExpandedRowRender<RecordType>;
  /** @deprecated Use `expandable.expandRowByClick` instead */
  expandRowByClick?: boolean;
  /** @deprecated Use `expandable.expandIcon` instead */
  expandIcon?: RenderExpandIcon<RecordType>;
  /** @deprecated Use `expandable.onExpand` instead */
  onExpand?: (expanded: boolean, record: RecordType) => void;
  /** @deprecated Use `expandable.onExpandedRowsChange` instead */
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void;
  /** @deprecated Use `expandable.defaultExpandAllRows` instead */
  defaultExpandAllRows?: boolean;
  /** @deprecated Use `expandable.indentSize` instead */
  indentSize?: number;
  /** @deprecated Use `expandable.expandIconColumnIndex` instead */
  expandIconColumnIndex?: number;
  /** @deprecated Use `expandable.expandedRowClassName` instead */
  expandedRowClassName?: RowClassName<RecordType>;
  /** @deprecated Use `expandable.childrenColumnName` instead */
  childrenColumnName?: string;
  title?: PanelRender<RecordType>;
}

export type ExpandedRowRender<ValueType> = (
  record: ValueType,
  index: number,
  indent: number,
  expanded: boolean,
) => React.ReactNode;

export interface RenderExpandIconProps<RecordType> {
  prefixCls: string;
  expanded: boolean;
  record: RecordType;
  expandable: boolean;
  onExpand: TriggerEventHandler<RecordType>;
}

export type RenderExpandIcon<RecordType> = (
  props: RenderExpandIconProps<RecordType>,
) => React.ReactNode;

export interface ExpandableConfig<RecordType> {
  expandedRowKeys?: readonly Key[];
  defaultExpandedRowKeys?: readonly Key[];
  expandedRowRender?: ExpandedRowRender<RecordType>;
  columnTitle?: React.ReactNode;
  expandRowByClick?: boolean;
  expandIcon?: RenderExpandIcon<RecordType>;
  onExpand?: (expanded: boolean, record: RecordType) => void;
  onExpandedRowsChange?: (expandedKeys: readonly Key[]) => void;
  defaultExpandAllRows?: boolean;
  indentSize?: number;
  /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
  expandIconColumnIndex?: number;
  showExpandColumn?: boolean;
  expandedRowClassName?: string | RowClassName<RecordType>;
  childrenColumnName?: string;
  rowExpandable?: (record: RecordType) => boolean;
  columnWidth?: number | string;
  fixed?: FixedType;
  expandedRowOffset?: number;
}

// =================== Render ===================
export type PanelRender<RecordType> = (data: readonly RecordType[]) => React.ReactNode;

// =================== Events ===================
export type TriggerEventHandler<RecordType> = (
  record: RecordType,
  event: React.MouseEvent<HTMLElement>,
) => void;

// =================== Sticky ===================
export interface TableSticky {
  offsetHeader?: number;
  offsetSummary?: number;
  offsetScroll?: number;
  getContainer?: () => Window | HTMLElement;
}

// ===================== Antd wrapper interface =====================

export type RefTable = <RecordType = AnyObject>(
  props: React.PropsWithChildren<TableProps<RecordType>> & React.RefAttributes<Reference>,
) => React.ReactElement;

export type RefInternalTable = <RecordType = AnyObject>(
  props: React.PropsWithChildren<InternalTableProps<RecordType>> & React.RefAttributes<Reference>,
) => React.ReactElement;

export type SafeKey = Exclude<Key, bigint>;

export type RowSelectionType = 'checkbox' | 'radio';

export type SelectionItemSelectFn = (currentRowKeys: Key[]) => void;

export type ExpandType = null | 'row' | 'nest';

export interface TableLocale {
  filterTitle?: string;
  filterConfirm?: React.ReactNode;
  filterReset?: React.ReactNode;
  filterEmptyText?: React.ReactNode;
  /** @deprecated Please use `filterCheckAll` instead. */
  filterCheckall?: React.ReactNode;
  filterCheckAll?: React.ReactNode;
  filterSearchPlaceholder?: string;
  emptyText?: React.ReactNode | (() => React.ReactNode);
  selectAll?: React.ReactNode;
  selectNone?: React.ReactNode;
  selectInvert?: React.ReactNode;
  selectionAll?: React.ReactNode;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
}

export type SortOrder = 'descend' | 'ascend' | null;

export type SorterTooltipTarget = 'full-header' | 'sorter-icon';

export type SorterTooltipProps = TooltipProps & {
  target?: SorterTooltipTarget;
};

const _TableActions = ['paginate', 'sort', 'filter'] as const;

export type TableAction = (typeof _TableActions)[number];

export type CompareFn<T = AnyObject> = (a: T, b: T, sortOrder?: SortOrder) => number;

export interface ColumnSorter<RecordType = AnyObject> {
  compare?: CompareFn<RecordType>;
  multiple?: number;
}

export interface ColumnFilterItem {
  text: React.ReactNode;
  value: React.Key | boolean;
  children?: ColumnFilterItem[];
}

export interface ColumnTitleProps<RecordType = AnyObject> {
  /** @deprecated Will be remove in v7, Please use `sorterColumns` instead. */
  sortOrder?: SortOrder;
  /** @deprecated Will be remove in v7, Please use `sorterColumns` instead. */
  sortColumn?: ColumnType<RecordType>;
  sortColumns?: { column: ColumnType<RecordType>; order: SortOrder }[];
  filters?: Record<string, FilterValue>;
}

export type ColumnTitle<RecordType = AnyObject> =
  | React.ReactNode
  | ((props: ColumnTitleProps<RecordType>) => React.ReactNode);

export type FilterValue = (Key | boolean)[];
export type FilterKey = (string | number)[] | null;
export type FilterSearchType<RecordType = AnyObject> =
  | boolean
  | ((input: string, record: RecordType) => boolean);
export interface FilterConfirmProps {
  closeDropdown: boolean;
}

export interface FilterResetProps {
  confirm?: boolean;
  closeDropdown?: boolean;
}

/** @deprecated Please use `FilterResetProps` instead. */
export interface FilterRestProps extends FilterResetProps {}

export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: (param?: FilterResetProps) => void;
  filters?: ColumnFilterItem[];
  close: () => void;
  visible: boolean;
}

interface CoverableDropdownProps
  extends Omit<DropdownProps, 'onOpenChange' | 'overlay' | 'visible' | 'onVisibleChange'> {
  onOpenChange?: (open: boolean) => void;
}

export interface SelectionItem {
  key: string;
  text: React.ReactNode;
  onSelect?: SelectionItemSelectFn;
}

export type SelectionSelectFn<T = AnyObject> = (
  record: T,
  selected: boolean,
  selectedRows: T[],
  nativeEvent: Event,
) => void;

export type RowSelectMethod = 'all' | 'none' | 'invert' | 'single' | 'multiple';

export interface TableRowSelection<T = AnyObject> {
  preserveSelectedRowKeys?: boolean;
  type?: RowSelectionType;
  selectedRowKeys?: Key[];
  defaultSelectedRowKeys?: Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: T[], info: { type: RowSelectMethod }) => void;
  getCheckboxProps?: (
    record: T,
  ) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>> & React.AriaAttributes;
  onSelect?: SelectionSelectFn<T>;
  /** @deprecated This function will be remove in v7 and should use `onChange` instead */
  onSelectMultiple?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated This function will be remove in v7 and should use `onChange` instead */
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  /** @deprecated This function will be remove in v7 and should use `onChange` instead */
  onSelectInvert?: (selectedRowKeys: Key[]) => void;
  /** @deprecated This function will be remove in v7 and should use `onChange` instead */
  onSelectNone?: () => void;
  selections?: INTERNAL_SELECTION_ITEM[] | boolean;
  hideSelectAll?: boolean;
  fixed?: FixedType;
  columnWidth?: string | number;
  columnTitle?: React.ReactNode | ((checkboxNode: React.ReactNode) => React.ReactNode);
  checkStrictly?: boolean;
  align?: 'left' | 'center' | 'right';
  renderCell?: (
    value: boolean,
    record: T,
    index: number,
    originNode: React.ReactNode,
  ) => React.ReactNode | RenderedCell<T>;
  onCell?: GetComponentProps<T>;
  getTitleCheckboxProps?: () => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>> &
    React.AriaAttributes;
}

export type TransformColumns<RecordType = AnyObject> = (
  columns: ColumnsType<RecordType>,
) => ColumnsType<RecordType>;

export interface TableCurrentDataSource<RecordType = AnyObject> {
  currentDataSource: RecordType[];
  action: TableAction;
}

export interface SorterResult<RecordType = AnyObject> {
  column?: ColumnType<RecordType>;
  order?: SortOrder;
  field?: Key | readonly Key[];
  columnKey?: Key;
}

export type GetPopupContainer = (triggerNode: HTMLElement) => HTMLElement;

export type TablePaginationPlacement =
  | 'topStart'
  | 'topCenter'
  | 'topEnd'
  | 'bottomStart'
  | 'bottomCenter'
  | 'bottomEnd'
  | 'none';

export type TablePaginationPosition =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'none';

export interface TablePaginationConfig extends PaginationProps {
  placement?: TablePaginationPlacement[];
  /** @deprecated please use `placement` instead */
  position?: TablePaginationPosition[];
}
