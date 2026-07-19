import * as React from 'react';
import { INTERNAL_COLUMN_DEFAULT_WIDTH, INTERNAL_HOOKS } from './constant';
import { convertChildrenToColumns } from './features/columns/useColumns';
import type {
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  EditableValidateResult,
  ExpandableConfig,
  ExpandType,
  FilterValue,
  GetPopupContainer,
  GetRowKey,
  Reference as RcReference,
  RefInternalTable,
  ScrollConfig,
  SorterResult,
  SorterTooltipProps,
  SortOrder,
  TableAction,
  TableCurrentDataSource,
  TableLocale,
  TablePaginationConfig,
  TablePaginationPlacement,
  TablePaginationPosition,
  TableRowSelection,
} from './interface';
import type { TableProps as RcTableProps } from './components/RcTable';
import { omit, pickAttrs } from '../_util/rcUtil';
import { clsx } from 'clsx';

import { useProxyImperativeHandle } from '../_util/hooks/useProxyImperativeHandle';
import { isFunction, isNumber, isPlainObject } from '../_util/is';
import type { Breakpoint } from '../_util/hooks/useBreakpoint';
import scrollTo from '../_util/scrollTo';
import type { AnyObject, SizeType } from '../_util/type';
import { devUseWarning } from '../_util/warning';

import { useBreakpoint } from '../_util/hooks/useBreakpoint';
import useCssVar from '../_util/hooks/useCssVar';
import Pagination from 'antd/lib/pagination';
import type { SpinProps } from 'antd/lib/spin';
import Spin from 'antd/lib/spin';
import { ConfigContext, globalConfig } from 'antd/lib/config-provider';
import renderExpandIcon from './components/ExpandIcon';
import useContainerWidth from './shared/hooks/useContainerWidth';
import useFilledColumns from './features/columns/useFilledColumns';
import type { FilterConfig, FilterState } from './features/filter/useFilter';
import useFilter, { getFilterData } from './features/filter/useFilter';
import useLazyKVMap from './shared/hooks/useLazyKVMap';
import usePagination, {
  DEFAULT_PAGE_SIZE,
  getPaginationParam,
} from './features/pagination/usePagination';
import useSelection from './features/selection/useSelection';
import type { SortState } from './features/sort/useSorter';
import useSorter, { getSortData } from './features/sort/useSorter';
import useTitleColumns from './features/columns/useTitleColumns';

import RcTable from './components/RcTable';
import RcVirtualTable from './components/VirtualTable';
import DefaultRenderEmpty from 'antd/lib/config-provider/defaultRenderEmpty';
import { transformResizableColumns, useResize } from './features/resize';
import {
  EditableCell,
  EditableContext,
  parseEditableConfig,
  useEditable,
} from './features/editable';

/** 稳定的空配置引用 */
const EMPTY_EDITABLE_CONFIG = {};

export type { ColumnsType, TablePaginationConfig };

const EMPTY_LIST: AnyObject[] = [];

type HeaderTableContextValue = {
  ariaProps?: React.AriaAttributes;
  component?: React.ElementType;
};

const HeaderTableContext = React.createContext<HeaderTableContextValue>({});

const HeaderTable: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = (props) => {
  const { ariaProps, component = 'table' } = React.useContext(HeaderTableContext);
  return React.createElement(component, {
    ...ariaProps,
    ...props,
  });
};

if (process.env.NODE_ENV !== 'production') {
  HeaderTable.displayName = 'HeaderTable';
}

interface ChangeEventInfo<RecordType = AnyObject> {
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  filters: Record<string, FilterValue | null>;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

  filterStates: FilterState<RecordType>[];
  sorterStates: SortState<RecordType>[];

  resetPagination: (current?: number, pageSize?: number) => void;
}

export interface TableProps<RecordType = AnyObject>
  extends Omit<
    RcTableProps<RecordType>,
    | 'transformColumns'
    | 'internalHooks'
    | 'internalRefs'
    | 'data'
    | 'columns'
    | 'scroll'
    | 'emptyText'
    | 'classNames'
    | 'styles'
  > {
  dropdownPrefixCls?: string;
  dataSource?: RcTableProps<RecordType>['data'];
  column?: Partial<ColumnType<RecordType>>;
  columns?: ColumnsType<RecordType>;
  pagination?: false | TablePaginationConfig;
  loading?: boolean | SpinProps;
  size?: SizeType;
  bordered?: boolean;
  locale?: TableLocale;
  rootClassName?: string;

  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
  rowSelection?: TableRowSelection<RecordType>;

  getPopupContainer?: GetPopupContainer;
  scroll?: RcTableProps<RecordType>['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  };
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | SorterTooltipProps;
  virtual?: boolean;
  /** 是否全局开启列宽拖拽调整 */
  resizable?: boolean;
  /** 列宽拖拽回调 */
  onColumnResize?: (key: React.Key, width: number) => void;
  /** 是否全局开启可编辑 */
  editable?: boolean;
  /** 数据变化回调（可编辑模式） */
  onEditableChange?: (data: RecordType[]) => void;
  /** 校验回调 */
  onValidate?: (result: EditableValidateResult) => void;
}

/** Same as `TableProps` but we need record parent render times */
export interface InternalTableProps<RecordType = AnyObject> extends TableProps<RecordType> {
  _renderTimes: number;
}

const InternalTable = <RecordType extends AnyObject = AnyObject>(
  props: InternalTableProps<RecordType>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    rootClassName,
    style,
    size: customizeSize,
    bordered,
    dropdownPrefixCls: customizeDropdownPrefixCls,
    dataSource,
    pagination,
    rowSelection: customizeRowSelection,
    rowKey: customizeRowKey,
    rowClassName,
    column,
    columns,
    children,
    childrenColumnName: legacyChildrenColumnName,
    onChange,
    getPopupContainer,
    loading,
    expandIcon,
    expandable,
    expandedRowRender,
    expandIconColumnIndex,
    indentSize,
    scroll,
    sortDirections,
    locale,
    showSorterTooltip = { target: 'full-header' },
    virtual,
    resizable = false,
    onColumnResize: onColumnResizeProp,
    editable: editableEnabled = false,
    onEditableChange,
    onValidate: onValidateProp,
  } = props;

  const warning = devUseWarning('Table');

  const rawColumns = React.useMemo(
    () => columns || (convertChildrenToColumns(children) as ColumnsType<RecordType>),
    [columns, children],
  );
  const baseColumns = useFilledColumns(rawColumns, column);
  const needResponsive = React.useMemo(
    () => baseColumns.some((col: ColumnType<RecordType>) => col.responsive),
    [baseColumns],
  );

  const screens = useBreakpoint(needResponsive);

  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter((m) => screens[m as Breakpoint]));

    return baseColumns.filter((c) => !c.responsive || c.responsive.some((r) => matched.has(r)));
  }, [baseColumns, screens]);

  // ========================= Column Resize (hasResizableColumns check only) =========================
  const hasResizableColumns = React.useMemo(
    () =>
      resizable ||
      mergedColumns.some((col) => ('resizable' in col ? col.resizable === true : false)),
    [resizable, mergedColumns],
  );

  // ========================= Editable =========================
  const hasEditableColumns = React.useMemo(
    () =>
      editableEnabled ||
      mergedColumns.some((col) => {
        const ed = ('editable' in col ? col.editable : undefined) as
          | boolean
          | { type?: string }
          | undefined;
        // 与 parseEditableConfig 语义对齐：列显式开启 = true 或任意配置对象；
        // editable === false（显式关闭）或未配置 → 非显式开启，
        // 全局开启时由 parseEditableConfig 继承、false 时优先关闭
        return ed === true || (ed !== null && typeof ed === 'object');
      }),
    [editableEnabled, mergedColumns],
  );

  const tableProps: TableProps<RecordType> = omit(props, [
    'className',
    'style',
    'column',
    'columns',
    'resizable',
    'onColumnResize',
    'editable',
    'onEditableChange',
    'onValidate',
  ]);

  const components = tableProps.components as RcTableProps<RecordType>['components'];
  const ariaProps = pickAttrs(tableProps, { aria: true }) as React.AriaAttributes;
  const hasAriaProps = Object.keys(ariaProps).length > 0;
  const headerTableContext = React.useMemo<HeaderTableContextValue>(
    () => ({
      ariaProps,
      component: components?.header?.table as React.ElementType | undefined,
    }),
    [ariaProps, components?.header?.table],
  );
  const prefixCls = globalConfig().getPrefixCls('table', customizePrefixCls);

  // ============================= Refs =============================
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tblRef = React.useRef<RcReference>(null);

  // ========================= Column Resize (hook needs rootRef) =========================
  // 内部功能列（rowSelection / expand）无 key，不参与 resize 宽度分配，
  // 但占据固定宽度——计入 resize 总宽，避免 scrollX 覆盖 scroll.x 后内容比容器宽。
  // 宽度取值优先级：显式 columnWidth（数字 / 数字字符串 / 相对 scroll.x 的百分比）
  // > RcTable 实测上报（CSS 覆盖也能跟随）> 默认 32/48
  const [measuredInternalWidths, setMeasuredInternalWidths] = React.useState<
    Record<string, number>
  >({});
  const handleAutoColumnMeasure = React.useCallback((columnType: string, width: number) => {
    setMeasuredInternalWidths((prev) =>
      prev[columnType] === width ? prev : { ...prev, [columnType]: width },
    );
  }, []);

  const internalColumnsWidth = React.useMemo(() => {
    const resolveWidth = (
      raw: number | string | undefined,
      measured: number | undefined,
      fallback: number,
    ): number => {
      if (typeof raw === 'number' && raw > 0) {
        return raw;
      }
      if (typeof raw === 'string') {
        // 百分比：相对用户显式设置的 scroll.x 解析（与 useWidthColumns 的 parseColWidth 一致）
        if (raw.endsWith('%') && typeof scroll?.x === 'number') {
          const pct = Number.parseFloat(raw);
          if (!Number.isNaN(pct)) {
            return (scroll.x * pct) / 100;
          }
        }
        const num = Number(raw);
        if (!Number.isNaN(num) && num > 0) {
          return num;
        }
      }
      return measured ?? fallback;
    };

    let width = 0;
    if (customizeRowSelection) {
      width += resolveWidth(
        (customizeRowSelection as TableRowSelection<RecordType>).columnWidth,
        measuredInternalWidths.SELECTION_COLUMN,
        INTERNAL_COLUMN_DEFAULT_WIDTH.SELECTION_COLUMN,
      );
    }
    if (expandable?.expandedRowRender || expandedRowRender) {
      width += resolveWidth(
        expandable?.columnWidth,
        measuredInternalWidths.EXPAND_COLUMN,
        INTERNAL_COLUMN_DEFAULT_WIDTH.EXPAND_COLUMN,
      );
    }
    return width;
  }, [customizeRowSelection, expandable, expandedRowRender, measuredInternalWidths, scroll?.x]);

  // 叶子列总数（含内部功能列），写入 wrapper 的 --columns-count CSS 变量：
  // resize 竖线的 z-index 需要压过按列数计算的固定列/阴影层级（见 fixed.less）
  const totalColumnCount = React.useMemo(() => {
    let count = 0;
    const walk = (cols: ColumnsType<RecordType>) => {
      cols.forEach((col) => {
        const subColumns = (col as { children?: ColumnsType<RecordType> }).children;
        if (Array.isArray(subColumns) && subColumns.length > 0) {
          walk(subColumns);
        } else {
          count += 1;
        }
      });
    };
    walk(mergedColumns);
    if (customizeRowSelection) count += 1;
    if (expandable?.expandedRowRender || expandedRowRender) count += 1;
    return count;
  }, [mergedColumns, customizeRowSelection, expandable, expandedRowRender]);

  const resizeResult = useResize({
    columns: mergedColumns as ColumnsType,
    enabled: resizable,
    containerRef: rootRef,
    onColumnResize: onColumnResizeProp,
    prefixCls,
    extraFixedWidth: internalColumnsWidth,
  });

  const mergedComponents = React.useMemo<RcTableProps<RecordType>['components']>(() => {
    if (!hasAriaProps) return components;
    return {
      ...components,
      header: {
        ...components?.header,
        table: HeaderTable,
      },
    };
  }, [components, hasAriaProps]);

  // Use antd@4 ConfigContext for locale and renderEmpty
  const {
    locale: contextLocale,
    renderEmpty,
    getPopupContainer: getContextPopupContainer,
  } = React.useContext(ConfigContext) as any;

  const tableLocale: TableLocale = {
    filterTitle: 'Filter',
    filterConfirm: 'OK',
    filterReset: 'Reset',
    filterEmptyText: 'No filters',
    filterCheckAll: 'Select all items',
    filterSearchPlaceholder: 'Search in filters',
    emptyText: renderEmpty?.('Table') || 'No data',
    selectAll: 'Select current page',
    selectInvert: 'Invert current page',
    selectNone: 'Clear all data',
    selectionAll: 'Select all data',
    sortTitle: 'Sort',
    expand: 'Expand row',
    collapse: 'Collapse row',
    triggerDesc: 'Click to sort descending',
    triggerAsc: 'Click to sort ascending',
    cancelSort: 'Click to cancel sorting',
    ...contextLocale?.Table,
    ...locale,
  };

  const rawData: readonly RecordType[] = dataSource || EMPTY_LIST;

  const dropdownPrefixCls = globalConfig().getPrefixCls('dropdown', customizeDropdownPrefixCls);

  const mergedRowSelection = React.useMemo(() => {
    return isPlainObject(customizeRowSelection)
      ? { ...customizeRowSelection }
      : customizeRowSelection;
  }, [customizeRowSelection]);

  const mergedExpandable: ExpandableConfig<RecordType> = {
    childrenColumnName: legacyChildrenColumnName,
    expandIconColumnIndex,
    ...expandable,
  };
  const { childrenColumnName = 'children' } = mergedExpandable;

  const expandType = React.useMemo<ExpandType>(() => {
    if (rawData.some((item) => item?.[childrenColumnName])) {
      return 'nest';
    }

    if (expandedRowRender || expandable?.expandedRowRender) {
      return 'row';
    }

    return null;
  }, [childrenColumnName, rawData]);

  const internalRef: NonNullable<RcTableProps['internalRefs']> = {
    body: React.useRef<HTMLDivElement>(null),
  } as NonNullable<RcTableProps['internalRefs']>;

  // ============================ Width =============================
  const getContainerWidth = useContainerWidth(prefixCls);

  // 用 resize 后的渲染宽度覆盖列的 width
  // renderWidth = column.width + 容器剩余空间分配到最后一列（撑满容器，不留空）
  const finalColumns = React.useMemo(() => {
    if (!hasResizableColumns) return mergedColumns;
    return mergedColumns.map((col) => {
      const width = resizeResult.getColumnRenderWidth(col as ColumnType);
      return width != null ? { ...col, width } : col;
    });
  }, [mergedColumns, hasResizableColumns, resizeResult.renderWidths]);

  // 用于暴露 validate / resetErrors 的 ref
  const editableMethodsRef = React.useRef<{
    validate: () => Promise<EditableValidateResult>;
    resetErrors: () => void;
  } | null>(null);

  // 跨页滚动 timer ref（防止组件卸载后 timer 泄漏）
  const scrollTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
  }, []);

  // ============================ RowKey ============================
  const rowKey = customizeRowKey || 'key';

  // ============================ Scroll ============================
  // 当 resize 启用且容器宽度已测量时，用 scrollX（= renderWidths 总和）覆盖 scroll.x
  // 确保 table 宽度 = 列宽总和，避免不匹配导致的滚动条问题
  const mergedScroll = React.useMemo(() => {
    if (hasResizableColumns && resizeResult.scrollX != null) {
      return { ...scroll, x: resizeResult.scrollX };
    }
    return scroll;
  }, [scroll, hasResizableColumns, resizeResult.scrollX]);

  if (process.env.NODE_ENV !== 'production') {
    warning(
      !(isFunction(rowKey) && rowKey.length > 1),
      'usage',
      '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
    );
  }

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (isFunction(rowKey)) {
      return rowKey;
    }

    return (record: RecordType) => record?.[rowKey as string];
  }, [rowKey]);

  const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

  // 分页偏移量 ref — 用于将 page-local rowIndex 转换为 rawData 全局 index
  // 修复 BUG: 分页时 EditableCell 收到的是 page-local index，但 useEditable 的
  // onCellChange / validateCell 用此 index 匹配 rawData，导致跨页编辑写入错误行。
  const pageOffsetRef = React.useRef(0);

  // mergedData（排序/筛选后、分页前）ref — scrollToRow 按 rowKey 定位行所在页时使用。
  // useEditable 在 mergedData 计算之前调用，所以用 ref 传递（同 paginationInfoRef 模式）。
  const mergedDataRef = React.useRef<readonly RecordType[]>(EMPTY_LIST);

  // 分页控制 ref — validate 时用于自动跳转到错误行所在页
  // useEditable 在 usePagination 之前调用，所以用 ref 传递
  const resetPaginationRef = React.useRef<(current?: number, pageSize?: number) => void>(() => {});
  const paginationInfoRef = React.useRef<{ current: number; pageSize: number; enabled: boolean }>({
    current: 1,
    pageSize: 10,
    enabled: false,
  });

  // ============================ Editable =============================
  const editableResult = useEditable({
    columns: mergedColumns as ColumnsType,
    data: rawData as AnyObject[],
    onChange: onEditableChange as ((data: AnyObject[]) => void) | undefined,
    onValidate: onValidateProp,
    getRowKey: getRowKey as (record: AnyObject, index: number) => React.Key,
    childrenColumnName,
    scrollToRow: (key: React.Key, idx: number) => {
      const { current, pageSize, enabled } = paginationInfoRef.current;
      // 在 mergedData（排序/筛选后、分页前）中按 key 定位顶层行下标；
      // 树形子行归属于其顶层祖先。定位失败（无 key / 行被过滤掉）降级为传入下标。
      const matchRow = (row: RecordType, index: number): boolean => {
        if (getRowKey(row, index) === key) return true;
        const children = row?.[childrenColumnName] as RecordType[] | undefined;
        return Array.isArray(children) && children.some((child, ci) => matchRow(child, ci));
      };
      const list = mergedDataRef.current;
      let topIndex = -1;
      for (let i = 0; i < list.length; i += 1) {
        if (matchRow(list[i], i)) {
          topIndex = i;
          break;
        }
      }
      const foundByKey = topIndex !== -1;
      if (!foundByKey) topIndex = idx;

      const scrollToRowOnPage = (pageLocalIdx: number) => {
        // key 定位成功时直接按 key 滚动（树形子行也能命中）；否则用页内下标
        if (foundByKey) {
          tblRef.current?.scrollTo({ key, align: 'center' });
        } else {
          tblRef.current?.scrollTo({ index: pageLocalIdx, align: 'center' });
        }
      };

      if (enabled && pageSize > 0) {
        const targetPage = Math.floor(topIndex / pageSize) + 1;
        if (targetPage !== current) {
          if (isPlainObject(pagination) && pagination.current !== undefined) {
            // 受控分页：current 由外部持有，内部 setState 无法换页（merge 时受控值优先），
            // 自动跳页只能通过 onChange 发起请求，由外部响应后更新 current
            pagination.onChange?.(targetPage, pageSize);
          } else {
            // 切换到错误行所在页
            resetPaginationRef.current(targetPage, pageSize);
          }
          // 等待页面渲染后滚动到错误行（page-local index）
          const localIdx = topIndex - (targetPage - 1) * pageSize;
          if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = setTimeout(() => {
            scrollToRowOnPage(localIdx);
            scrollTimerRef.current = null;
          }, 50);
          return;
        }
        // 同页：直接滚动（使用 page-local index）
        scrollToRowOnPage(topIndex - (current - 1) * pageSize);
      } else {
        // 无分页：直接用全局 index 滚动
        scrollToRowOnPage(topIndex);
      }
    },
    enabled: hasEditableColumns,
  });

  // 暴露 validate / resetErrors 到 ref
  // validate 不传参数，内部用 dataRef.current 获取最新数据
  editableMethodsRef.current = hasEditableColumns
    ? {
        validate: () => editableResult.validateAll(),
        resetErrors: editableResult.resetErrors,
      }
    : null;

  // 用于稳定 validate / resetErrors 引用，配合 useProxyImperativeHandle deps=[]
  // 避免 each render 重建 Proxy
  const validateAllRef = React.useRef(editableResult.validateAll);
  validateAllRef.current = editableResult.validateAll;
  const resetErrorsRef = React.useRef(editableResult.resetErrors);
  resetErrorsRef.current = editableResult.resetErrors;
  const resetColumnWidthsRef = React.useRef(resizeResult.resetColumnWidths);
  resetColumnWidthsRef.current = resizeResult.resetColumnWidths;

  // useImperativeHandle 在 commit 阶段执行（DOM ref 已挂载），
  // 所以直接读 rootRef.current / tblRef.current 即可。
  // deps=[] 保证只创建一次 Proxy；方法通过 ref 间接访问最新值。
  useProxyImperativeHandle(ref, () => ({
    nativeElement: rootRef.current!,
    // 惰性间接调用，不展开 tblRef.current：
    // 1. 展开会形成首次渲染快照 — RcTable 的 scrollTo 闭包捕获当次 render 的
    //    mergedData/getRowKey，dataSource/分页变化后用旧数据解析 rowKey 导致找不到/找错行；
    // 2. 展开会对 getter 提前求值（如虚拟表格 BodyGrid 的 scrollLeft/scrollTop 变成静态数字）。
    scrollTo: (config: ScrollConfig) => tblRef.current?.scrollTo?.(config),
    validate: () =>
      validateAllRef.current?.() ??
      Promise.resolve({ valid: true, errors: new Map() }),
    resetErrors: () => resetErrorsRef.current?.(),
    resetColumnWidths: () => resetColumnWidthsRef.current?.(),
  }), []);

  // 可编辑列 transform
  // 错误状态通过 EditableContext 传递，不需要重建列 transform。
  // 如果依赖 errors 会导致每次校验都重建整个列结构，引发全表重渲染，严重影响输入性能。
  const transformEditableColumns = React.useCallback(
    (cols: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      if (!hasEditableColumns) return cols;
      return cols.map((col) => {
        // 列组（表头合并）：递归处理子列
        if ('children' in col && col.children) {
          return {
            ...col,
            children: transformEditableColumns(col.children),
          } as ColumnsType<RecordType>[number];
        }

        const leafCol = col as ColumnType<RecordType>;
        const parsed = parseEditableConfig(leafCol.editable, editableEnabled);
        if (!parsed.enabled) return col;

        // 全局 editable 开启时，跳过没有 dataIndex 的列（如操作列），
        // 避免将原始 render 的返回值（React 元素）当作 value 传给 EditableCell，
        // 导致显示 [object Object]。
        // 列级显式设置 editable 时仍然生效（用户明确要求编辑此列）。
        if (!leafCol.editable && !leafCol.dataIndex && leafCol.dataIndex !== 0) {
          return col;
        }

        return {
          ...leafCol,
          render: (value: unknown, record: RecordType, index: number) => {
            // index 是 pageData 的局部索引，加上 pageOffset 后才是 rawData 全局索引。
            // rowKey 是排序/筛选/树形展开后唯一稳定的行标识：editable 链路（提交、错误查找）
            // 都以 rowKey 定位，globalRowIndex 仅作无 key 时的降级与列回调参数。
            const globalRowIndex = index + pageOffsetRef.current;
            return (
              <EditableCell
                // `EditableCell` contracts `dataIndex`/`title` as plain render values;
                // pass the column config through as-is.
                dataIndex={leafCol.dataIndex as string | number}
                title={leafCol.title as React.ReactNode}
                rowKey={getRowKey(record, index)}
                rowIndex={globalRowIndex}
                record={record as AnyObject}
                value={value}
                editableConfig={parsed.config ?? EMPTY_EDITABLE_CONFIG}
                prefixCls={prefixCls}
              />
            );
          },
        };
      });
    },
    [hasEditableColumns, editableEnabled, prefixCls, getRowKey],
  );

  // ============================ Events =============================
  const changeEventInfo: Partial<ChangeEventInfo<RecordType>> = {};

  const triggerOnChange = (
    info: Partial<ChangeEventInfo<RecordType>>,
    action: TableAction,
    reset = false,
  ) => {
    const changeInfo = {
      ...changeEventInfo,
      ...info,
    };

    if (reset) {
      changeEventInfo.resetPagination?.();

      if (changeInfo.pagination?.current) {
        changeInfo.pagination.current = 1;
      }

      if (pagination) {
        pagination.onChange?.(1, changeInfo.pagination?.pageSize!);
      }
    }

    if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRef.body.current) {
      scrollTo(0, {
        getContainer: () => internalRef.body.current!,
      });
    }

    onChange?.(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
      currentDataSource: getFilterData(
        getSortData(rawData, changeInfo.sorterStates!, childrenColumnName),
        changeInfo.filterStates!,
        childrenColumnName,
      ),
      action,
    });
  };

  // ============================ Sorter =============================
  const onSorterChange = (
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    sorterStates: SortState<RecordType>[],
  ) => {
    triggerOnChange(
      {
        sorter,
        sorterStates,
      },
      'sort',
      false,
    );
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter<RecordType>({
    prefixCls,
    mergedColumns,
    baseColumns,
    onSorterChange,
    sortDirections: sortDirections || ['ascend', 'descend'],
    tableLocale,
    showSorterTooltip,
  });

  const sortedData = React.useMemo(
    () => getSortData(rawData, sortStates, childrenColumnName),
    [childrenColumnName, rawData, sortStates],
  );

  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;

  // ============================ Filter ============================
  const onFilterChange: FilterConfig<RecordType>['onFilterChange'] = (filters, filterStates) => {
    triggerOnChange({ filters, filterStates }, 'filter', true);
  };

  const [transformFilterColumns, filterStates, filters] = useFilter<RecordType>({
    prefixCls,
    locale: tableLocale,
    dropdownPrefixCls,
    mergedColumns,
    onFilterChange,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
    rootClassName,
  });
  const mergedData = getFilterData(sortedData, filterStates, childrenColumnName);
  mergedDataRef.current = mergedData;

  changeEventInfo.filters = filters;
  changeEventInfo.filterStates = filterStates;

  // ============================ Column ============================
  const columnTitleProps = React.useMemo<ColumnTitleProps<RecordType>>(() => {
    const mergedFilters: Record<string, FilterValue> = {};
    Object.keys(filters).forEach((filterKey) => {
      if (filters[filterKey] !== null) {
        mergedFilters[filterKey] = filters[filterKey]!;
      }
    });
    return {
      ...sorterTitleProps,
      filters: mergedFilters,
    };
  }, [sorterTitleProps, filters]);

  const [transformTitleColumns] = useTitleColumns(columnTitleProps);

  // ========================== Pagination ==========================
  const onPaginationChange = (current: number, pageSize: number) => {
    triggerOnChange(
      {
        pagination: { ...changeEventInfo.pagination, current, pageSize },
      },
      'paginate',
    );
  };

  const [mergedPagination, resetPagination] = usePagination(
    mergedData.length,
    onPaginationChange,
    pagination,
  );

  changeEventInfo.pagination =
    pagination === false ? {} : getPaginationParam(mergedPagination, pagination);

  changeEventInfo.resetPagination = resetPagination;

  // 更新分页偏移量 ref — 在 transformEditableColumns 中使用
  // 必须在 pageData 计算之前更新，因为 transformEditableColumns 在渲染期间被调用
  pageOffsetRef.current =
    pagination === false || !mergedPagination.pageSize
      ? 0
      : ((mergedPagination.current ?? 1) - 1) * (mergedPagination.pageSize ?? 10);

  // 更新分页控制 ref — validate 时使用
  paginationInfoRef.current = {
    current: mergedPagination.current ?? 1,
    pageSize: mergedPagination.pageSize ?? 10,
    enabled: pagination !== false,
  };
  resetPaginationRef.current = resetPagination;

  // ============================= Data =============================
  const pageData = React.useMemo<RecordType[]>(() => {
    if (pagination === false || !mergedPagination.pageSize) {
      return mergedData;
    }

    const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination;
    warning(current > 0, 'usage', '`current` should be positive number.');

    if (mergedData.length < total!) {
      if (mergedData.length > pageSize) {
        warning(
          false,
          'usage',
          '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
        );
        return mergedData.slice((current - 1) * pageSize, current * pageSize);
      }
      return mergedData;
    }

    return mergedData.slice((current - 1) * pageSize, current * pageSize);
  }, [
    !!pagination,
    mergedData,
    mergedPagination?.current,
    mergedPagination?.pageSize,
    mergedPagination?.total,
  ]);

  // ========================== Selections ==========================
  const [transformSelectionColumns, selectedKeySet] = useSelection<RecordType>(
    {
      prefixCls,
      data: mergedData,
      pageData,
      getRowKey,
      getRecordByKey,
      expandType,
      childrenColumnName,
      locale: tableLocale,
      getPopupContainer: getPopupContainer || getContextPopupContainer,
    },
    mergedRowSelection,
  );

  const internalRowClassName = (record: RecordType, index: number, indent: number) => {
    return clsx(
      {
        [`${prefixCls}-row-selected`]: selectedKeySet.has(getRowKey(record, index)),
      },
      isFunction(rowClassName) ? rowClassName(record, index, indent) : rowClassName,
    );
  };

  // ========================== Expandable ==========================

  (mergedExpandable as any).__PARENT_RENDER_ICON__ = mergedExpandable.expandIcon;

  mergedExpandable.expandIcon =
    mergedExpandable.expandIcon || expandIcon || renderExpandIcon(tableLocale);

  if (expandType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
    mergedExpandable.expandIconColumnIndex = mergedRowSelection ? 1 : 0;
  } else if (mergedExpandable.expandIconColumnIndex! > 0 && mergedRowSelection) {
    mergedExpandable.expandIconColumnIndex! -= 1;
  }

  if (!isNumber(mergedExpandable.indentSize)) {
    mergedExpandable.indentSize = isNumber(indentSize) ? indentSize : 15;
  }

  // ============================ Render ============================
  const transformColumns = React.useCallback(
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      let result = transformTitleColumns(
        transformSelectionColumns(
          transformFilterColumns(transformSorterColumns(transformEditableColumns(innerColumns))),
        ),
      );
      // 在 transformColumns 链末端注入 resize（resize 依赖最终列结构）
      if (hasResizableColumns) {
result = transformResizableColumns(result, {
prefixCls,
enabled: hasResizableColumns,
isColumnResizable: resizeResult.isColumnResizable,
onStartResize: resizeResult.onStartResize,
onKeyboardResize: resizeResult.setColumnWidth,
});
      }
      return result;
    },
    [
      transformSorterColumns,
      transformFilterColumns,
      transformSelectionColumns,
      transformEditableColumns,
      hasResizableColumns,
      prefixCls,
      resizeResult.isColumnResizable,
      resizeResult.onStartResize,
    ],
  );

  let topPaginationNode: React.ReactNode;
  let bottomPaginationNode: React.ReactNode;
  if (pagination !== false && mergedPagination?.total) {
    let paginationSize: TablePaginationConfig['size'];
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize =
        customizeSize === 'small' || customizeSize === 'middle' ? 'small' : undefined;
    }

    const renderPagination = (placement: 'start' | 'end' | 'center' = 'end') => (
      <Pagination
        {...mergedPagination}
        className={clsx(
          `${prefixCls}-pagination ${prefixCls}-pagination-${placement}`,
          mergedPagination.className,
        )}
        size={paginationSize}
      />
    );

    const { placement, position } = mergedPagination;
    const mergedPlacement = placement ?? position;
    const normalizePlacement = (pos: TablePaginationPlacement | TablePaginationPosition) => {
      const lowerPos = pos.toLowerCase();
      if (lowerPos.includes('center')) {
        return 'center';
      }
      return lowerPos.includes('left') || lowerPos.includes('start') ? 'start' : 'end';
    };
    if (Array.isArray(mergedPlacement)) {
      const [topPos, bottomPos] = ['top', 'bottom'].map((dir) =>
        mergedPlacement.find((p) => p.includes(dir)),
      );
      const isDisable = mergedPlacement.every((p) => `${p}` === 'none');
      if (!topPos && !bottomPos && !isDisable) {
        bottomPaginationNode = renderPagination();
      }
      if (topPos) {
        topPaginationNode = renderPagination(normalizePlacement(topPos));
      }
      if (bottomPos) {
        bottomPaginationNode = renderPagination(normalizePlacement(bottomPos));
      }
    } else {
      bottomPaginationNode = renderPagination();
    }

    if (process.env.NODE_ENV !== 'production') {
      warning.deprecated(!position, 'pagination.position', 'pagination.placement');
    }
  }

  // >>>>>>>>> Spinning
  const spinProps = React.useMemo<SpinProps | undefined>(() => {
    if (typeof loading === 'boolean') {
      return { spinning: loading };
    } else if (isPlainObject(loading)) {
      return { spinning: true, ...loading };
    } else {
      return undefined;
    }
  }, [loading]);

  const wrappercls = clsx(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-wrapper-rtl`]: false,
      [`${prefixCls}-middle`]: customizeSize === 'middle',
      [`${prefixCls}-small`]: customizeSize === 'small',
      [`${prefixCls}-wrapper-resizing`]: resizeResult.resizingKey != null,
    },
    className,
    rootClassName,
  );

  // ========== empty ==========
  const mergedEmptyNode = React.useMemo<RcTableProps['emptyText']>(() => {
    // When dataSource is null/undefined (detected by reference equality with EMPTY_LIST),
    // and the table is in a loading state, we only show the loading spinner without the empty placeholder.
    // For empty arrays (datasource={[]}), both loading and empty states would normally be shown.
    // discussion https://github.com/ant-design/ant-design/issues/54601#issuecomment-3158091383
    if (spinProps?.spinning && rawData === EMPTY_LIST) {
      return null;
    }
    if (typeof locale?.emptyText !== 'undefined') {
      return locale.emptyText;
    }
    const emptyNode = renderEmpty?.('Table' as any) || DefaultRenderEmpty('Table');
    return emptyNode as RcTableProps['emptyText'];
  }, [spinProps?.spinning, rawData, locale?.emptyText, renderEmpty]);

  // ========================== Render ==========================
  const TableComponent = virtual ? RcVirtualTable : RcTable;

  // >>> Virtual Table props.
  const virtualProps: { listItemHeight?: number } = {};

  // Derive virtual row height from the CSS custom property defined in LESS.
  // Fallback values match the default token calculations when CSS is not ready.
  const fallbackItemHeight = React.useMemo(() => {
    switch (customizeSize) {
      case 'middle':
        return 47;
      case 'small':
        return 39;
      default:
        return 55;
    }
  }, [customizeSize]);

  const listItemHeight = useCssVar(rootRef, `--${prefixCls}-row-height`, fallbackItemHeight);

  if (virtual) {
    virtualProps.listItemHeight = listItemHeight;
  }

  // ========================== Resize Line ==========================
  // 竖线 DOM 通过 ref 直接操作，不需要 React state 驱动

  return (
    <div
      ref={rootRef}
      className={wrappercls}
      style={{ ...style, ['--columns-count' as any]: totalColumnCount }}
    >
      {hasResizableColumns && (
        <div ref={resizeResult.lineRef} className={`${prefixCls}-resize-line`} />
      )}
      <Spin spinning={false} {...spinProps}>
        {topPaginationNode}
        <EditableContext.Provider value={hasEditableColumns ? editableResult.contextValue : null}>
          <HeaderTableContext.Provider value={headerTableContext}>
            <TableComponent
              {...virtualProps}
              {...tableProps}
              components={mergedComponents}
              scroll={mergedScroll}
              onAutoColumnMeasure={handleAutoColumnMeasure}
              ref={tblRef}
              columns={finalColumns as RcTableProps<RecordType>['columns']}
              direction={'ltr'}
              expandable={mergedExpandable}
              prefixCls={prefixCls}
              className={clsx({
                [`${prefixCls}-middle`]: customizeSize === 'middle',
                [`${prefixCls}-small`]: customizeSize === 'small',
                [`${prefixCls}-bordered`]: bordered,
                [`${prefixCls}-empty`]: rawData.length === 0,
              })}
              data={pageData}
              rowKey={getRowKey}
              rowClassName={internalRowClassName}
              emptyText={mergedEmptyNode}
              // Internal
              internalHooks={INTERNAL_HOOKS}
              internalRefs={internalRef}
              transformColumns={transformColumns as any}
              getContainerWidth={getContainerWidth}
            />
          </HeaderTableContext.Provider>
        </EditableContext.Provider>
        {bottomPaginationNode}
      </Spin>
    </div>
  );
};

export default React.forwardRef(InternalTable) as unknown as RefInternalTable;
