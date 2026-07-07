import * as React from 'react';
import { INTERNAL_HOOKS } from './constant';
import { convertChildrenToColumns } from './features/columns/useColumns';
import type { Reference as RcReference } from './interface';
import type { TableProps as RcTableProps } from './components/RcTable';
import { omit, pickAttrs } from '../_util/rcUtil';
import { clsx } from 'clsx';

import { useProxyImperativeHandle } from '../_util/hooks/useProxyImperativeHandle';
import { isFunction, isNumber, isPlainObject } from '../_util/is';
import type { Breakpoint } from '../_util/hooks/useBreakpoint';
import scrollTo from '../_util/scrollTo';
import type { AnyObject } from '../_util/type';
import { devUseWarning } from '../_util/warning';
import type { SizeType } from '../_util/type';
import { useBreakpoint } from '../_util/hooks/useBreakpoint';
import useCssVar from '../_util/hooks/useCssVar';
import Pagination from 'antd/es/pagination';
import type { SpinProps } from 'antd/es/spin';
import Spin from 'antd/es/spin';
import { ConfigContext, globalConfig } from 'antd/es/config-provider';
import renderExpandIcon from './components/ExpandIcon';
import useContainerWidth from './shared/hooks/useContainerWidth';
import useFilledColumns from './features/columns/useFilledColumns';
import type { FilterConfig, FilterState } from './features/filter/useFilter';
import useFilter, { getFilterData } from './features/filter/useFilter';
import useLazyKVMap from './shared/hooks/useLazyKVMap';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './features/pagination/usePagination';
import useSelection from './features/selection/useSelection';
import type { SortState } from './features/sort/useSorter';
import useSorter, { getSortData } from './features/sort/useSorter';
import useTitleColumns from './features/columns/useTitleColumns';
import type {
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  ExpandableConfig,
  ExpandType,
  FilterValue,
  GetPopupContainer,
  GetRowKey,
  RefInternalTable,
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
import RcTable from './components/RcTable';
import RcVirtualTable from './components/VirtualTable';
import DefaultRenderEmpty from 'antd/es/config-provider/defaultRenderEmpty';
import { useResize } from './features/resize';
import ResizeContext from './features/resize/ResizeContext';
import { useEditable, EditableCell, EditableContext } from './features/editable';
import type { EditableValidateResult } from './features/editable';

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
  onEditableChange?: (data: any[]) => void;
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

  // ========================= Column Resize =========================
  const hasResizableColumns = React.useMemo(
    () => resizable || mergedColumns.some((col: any) => col?.resize?.resizable),
    [resizable, mergedColumns],
  );

  const resizeResult = useResize({
    columns: mergedColumns as ColumnsType,
    enabled: resizable,
    onColumnResize: onColumnResizeProp,
  });

  // 用 resize 后的宽度覆盖列的 width
  const finalColumns = React.useMemo(() => {
    if (!hasResizableColumns) return mergedColumns;
    return mergedColumns.map(col => {
      const width = resizeResult.getColumnWidth(col as ColumnType);
      return width != null ? { ...col, width } : col;
    });
  }, [mergedColumns, hasResizableColumns, resizeResult.columnWidths, resizeResult.resizingKey, resizeResult.draggingWidth]);

  const resizeContextValue = React.useMemo(
    () =>
      hasResizableColumns
        ? {
            resizingKey: resizeResult.resizingKey,
            draggingWidth: resizeResult.draggingWidth,
            getColumnWidth: resizeResult.getColumnWidth,
            isColumnResizable: resizeResult.isColumnResizable,
            onStartResize: resizeResult.onStartResize,
          }
        : null,
    [
      hasResizableColumns,
      resizeResult.resizingKey,
      resizeResult.draggingWidth,
      resizeResult.getColumnWidth,
      resizeResult.isColumnResizable,
      resizeResult.onStartResize,
    ],
  );

  // ========================= Editable (moved below after getRowKey/tblRef) =========================
  const hasEditableColumns = React.useMemo(
    () => editableEnabled || mergedColumns.some((col: any) => col?.editable?.editable),
    [editableEnabled, mergedColumns],
  );

  const tableProps: TableProps<RecordType> = omit(props, [
    'className',
    'style',
    'column',
    'columns',
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
  const mergedComponents = React.useMemo<RcTableProps<RecordType>['components']>(() => {
    if (!hasAriaProps) {
      return components;
    }

    return {
      ...components,
      header: {
        ...components?.header,
        table: HeaderTable,
      },
    };
  }, [components, hasAriaProps]);

  // Use antd@4 ConfigContext for locale and renderEmpty
  const { locale: contextLocale, renderEmpty, getPopupContainer: getContextPopupContainer } =
    React.useContext(ConfigContext) as any;


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

  const prefixCls = globalConfig().getPrefixCls('table', customizePrefixCls);
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

  // ============================= Refs =============================
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tblRef = React.useRef<RcReference>(null);

  // 用于暴露 validate / resetErrors 的 ref
  const editableMethodsRef = React.useRef<{
    validate: () => import('./features/editable').EditableValidateResult;
    resetErrors: () => void;
  } | null>(null);

  useProxyImperativeHandle(ref, () => ({
    ...tblRef.current!,
    nativeElement: rootRef.current!,
    validate: () => editableMethodsRef.current?.validate() ?? { valid: true, errors: new Map() },
    resetErrors: () => editableMethodsRef.current?.resetErrors(),
  }));

  // ============================ RowKey ============================
  const rowKey = customizeRowKey || 'key';

  // ============================ Scroll ============================
  const mergedScroll = scroll;

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

  // ============================ Editable =============================
  const editableResult = useEditable({
    columns: mergedColumns as any[],
    data: rawData as any[],
    onChange: onEditableChange,
    onValidate: onValidateProp,
    getRowKey: getRowKey as any,
    scrollToRow: (idx: number) => {
      tblRef.current?.scrollTo({ index: idx, align: 'center' });
    },
    enabled: hasEditableColumns,
  });

  // 暴露 validate / resetErrors 到 ref
  editableMethodsRef.current = hasEditableColumns
    ? {
        validate: () => editableResult.validateAll(rawData as any[], getRowKey as any),
        resetErrors: editableResult.resetErrors,
      }
    : null;

  // 可编辑列 transform
  const transformEditableColumns = React.useCallback(
    (cols: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      if (!hasEditableColumns) return cols;
      return cols.map((col: any) => {
        const editableCfg = col.editable;
        if (!editableCfg || (!editableCfg.editable && !editableEnabled)) return col;

        const originalRender = col.render;
        const mergedEditableCfg = {
          ...editableCfg,
          editable: editableCfg.editable ?? editableEnabled,
        };

        return {
          ...col,
          render: (value: any, record: any, index: number) => {
            const displayNode = originalRender ? originalRender(value, record, index) : value;
            return (
              <EditableCell
                dataIndex={col.dataIndex}
                title={col.title}
                rowIndex={index}
                record={record}
                value={value}
                editableConfig={mergedEditableCfg}
                prefixCls={prefixCls}
              >
                {displayNode as React.ReactNode}
              </EditableCell>
            );
          },
        };
      });
    },
    [hasEditableColumns, editableEnabled, prefixCls, editableResult.errorsVersion],
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
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> =>
      transformTitleColumns(
        transformSelectionColumns(
          transformFilterColumns(
            transformSorterColumns(transformEditableColumns(innerColumns)),
          ),
        ),
      ),
    [transformSorterColumns, transformFilterColumns, transformSelectionColumns, transformEditableColumns],
  );

  let topPaginationNode: React.ReactNode;
  let bottomPaginationNode: React.ReactNode;
  if (pagination !== false && mergedPagination?.total) {
    let paginationSize: TablePaginationConfig['size'];
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize = customizeSize === 'small' || customizeSize === 'middle' ? 'small' : undefined;
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
    return renderEmpty?.('Table') || <DefaultRenderEmpty componentName="Table" />;
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

  return (
    <div ref={rootRef} className={wrappercls} style={style}>
      <Spin spinning={false} {...spinProps}>
        {topPaginationNode}
        <ResizeContext.Provider value={resizeContextValue}>
          <EditableContext.Provider value={hasEditableColumns ? editableResult.contextValue : null}>
            <HeaderTableContext.Provider value={headerTableContext}>
              <TableComponent
                {...virtualProps}
                {...tableProps}
                components={mergedComponents}
                scroll={mergedScroll}
                ref={tblRef}
                columns={finalColumns as RcTableProps<RecordType>['columns']}
                direction={'ltr'}
                expandable={mergedExpandable}
                prefixCls={prefixCls}
                className={clsx(
                  {
                    [`${prefixCls}-middle`]: customizeSize === 'middle',
                    [`${prefixCls}-small`]: customizeSize === 'small',
                    [`${prefixCls}-bordered`]: bordered,
                    [`${prefixCls}-empty`]: rawData.length === 0,
                  },
                )}
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
        </ResizeContext.Provider>
        {bottomPaginationNode}
      </Spin>
    </div>
  );
};

export default React.forwardRef(InternalTable) as unknown as RefInternalTable;
