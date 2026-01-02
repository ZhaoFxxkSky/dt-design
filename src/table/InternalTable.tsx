import React from 'react';
import { devUseWarning } from '@dtjoy/dt-design/_util/warning';
import type { Reference as RcReference, TableProps as RcTableProps } from '@rc-component/table';
import { convertChildrenToColumns } from '@rc-component/table/lib/hooks/useColumns';
import { Pagination, Spin, SpinProps, TooltipProps } from 'antd';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { ConfigContext } from 'antd/lib/config-provider';
import defaultRenderEmpty from 'antd/lib/config-provider/defaultRenderEmpty';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import SizeContext from 'antd/lib/config-provider/SizeContext';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import defaultLocale from 'antd/lib/locale/en_US';
import renderExpandIcon from 'antd/lib/table/ExpandIcon';
import type { FilterState } from 'antd/lib/table/hooks/useFilter';
import useFilter, { getFilterData } from 'antd/lib/table/hooks/useFilter';
import useLazyKVMap from 'antd/lib/table/hooks/useLazyKVMap';
import usePagination, {
    DEFAULT_PAGE_SIZE,
    getPaginationParam,
} from 'antd/lib/table/hooks/usePagination';
import useSelection from 'antd/lib/table/hooks/useSelection';
import useSorter, { getSortData, SortState } from 'antd/lib/table/hooks/useSorter';
import useTitleColumns from 'antd/lib/table/hooks/useTitleColumns';
import type { ColumnTitleProps, FilterValue } from 'antd/lib/table/interface';
import classNames from 'classnames';
import { omit } from 'lodash-es';
import { INTERNAL_HOOKS } from 'rc-table/lib/Table';
import './style';

import { useProxyImperativeHandle } from '../_util/hooks';
import scrollTo from '../_util/scrollTo';
import { AnyObject } from '../_util/type';
import RcVirtualTable from './RcTable/VirtualTable';
import type {
    ColumnsType,
    ColumnType,
    ExpandableConfig,
    ExpandType,
    GetPopupContainer,
    GetRowKey,
    RefInternalTable,
    SorterResult,
    SortOrder,
    TableAction,
    TableCurrentDataSource,
    TableLocale,
    TablePaginationConfig,
    TableRowSelection,
} from './interface';
import RcTable from './RcTable';

export { ColumnsType, TablePaginationConfig };

const EMPTY_LIST: any[] = [];

interface ChangeEventInfo<RecordType> {
    pagination: {
        current?: number;
        pageSize?: number;
        total?: number;
    };
    filters: Record<string, FilterValue | null>;
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[];

    filterStates: FilterState<RecordType>[];
    sorterStates: SortState<RecordType>[];

    resetPagination: Function;
}

export interface TableProps<RecordType>
    extends Omit<
        RcTableProps<RecordType>,
        | 'transformColumns'
        | 'internalHooks'
        | 'internalRefs'
        | 'data'
        | 'columns'
        | 'scroll'
        | 'emptyText'
    > {
    dropdownPrefixCls?: string;
    dataSource?: RcTableProps<RecordType>['data'];
    columns?: ColumnsType<RecordType>;
    pagination?: false | TablePaginationConfig;
    loading?: boolean | SpinProps;
    size?: SizeType;
    bordered?: boolean;
    locale?: TableLocale;

    virtual?: boolean;

    onChange?: (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
        extra: TableCurrentDataSource<RecordType>
    ) => void;
    rowSelection?: TableRowSelection<RecordType>;

    getPopupContainer?: GetPopupContainer;
    scroll?: RcTableProps<RecordType>['scroll'] & {
        scrollToFirstRowOnChange?: boolean;
    };
    sortDirections?: SortOrder[];
    showSorterTooltip?: boolean | TooltipProps;
}

export interface InternalTableProps<RecordType = AnyObject> extends TableProps<RecordType> {
    _renderTimes: number;
}

const InternalTable = <RecordType extends AnyObject = AnyObject>(
    props: InternalTableProps<RecordType>,
    ref: React.Ref<HTMLDivElement>
) => {
    const {
        prefixCls: customizePrefixCls,
        className,
        style,
        size: customizeSize,
        bordered,
        dropdownPrefixCls: customizeDropdownPrefixCls,
        dataSource,
        pagination,
        rowSelection,
        rowKey = 'key',
        rowClassName,
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
        showSorterTooltip = true,
        virtual,
    } = props;

    const warning = devUseWarning('Table');

    warning(
        !(typeof rowKey === 'function' && rowKey.length > 1),
        'usage',
        '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.'
    );

    [
        ['filterDropdownVisible', 'filterDropdownOpen'],
        ['onFilterDropdownVisibleChange', 'onFilterDropdownOpenChange'],
    ].forEach(([deprecatedName, newName]) => {
        warning(
            !(deprecatedName in props),
            'usage',
            `\`${deprecatedName}\` is deprecated which will be removed in next major version.Please use \`${newName}\` instead. `
        );
    });

    const baseColumns = React.useMemo(
        () => columns || (convertChildrenToColumns(children) as ColumnsType<RecordType>),
        [columns, children]
    );
    const needResponsive = React.useMemo(
        () => baseColumns.some((col: ColumnType<RecordType>) => col.responsive),
        [baseColumns]
    );

    const screens = useBreakpoint(needResponsive);

    const mergedColumns = React.useMemo(() => {
        const matched = new Set(Object.keys(screens).filter((m) => screens[m as Breakpoint]));

        return baseColumns.filter(
            (c) => !c.responsive || c.responsive.some((r: Breakpoint) => matched.has(r))
        );
    }, [baseColumns, screens]);

    const tableProps = omit(props, ['className', 'style', 'columns']) as TableProps<RecordType>;

    const size = React.useContext(SizeContext);
    const {
        locale: contextLocale = defaultLocale,
        renderEmpty,
        direction,
    } = React.useContext(ConfigContext);
    const mergedSize = customizeSize || size;
    const tableLocale = { ...contextLocale.Table, ...locale } as TableLocale;
    const rawData: readonly RecordType[] = dataSource || EMPTY_LIST;

    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('table', customizePrefixCls);
    const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

    const mergedExpandable: ExpandableConfig<RecordType> = {
        childrenColumnName: legacyChildrenColumnName,
        expandIconColumnIndex,
        ...expandable,
    };
    const { childrenColumnName = 'children' } = mergedExpandable;

    const expandType = React.useMemo<ExpandType>(() => {
        if (rawData.some((item) => (item as any)?.[childrenColumnName])) {
            return 'nest';
        }

        if (expandedRowRender || (expandable && expandable.expandedRowRender)) {
            return 'row';
        }

        return null;
    }, [rawData]);

    const internalRefs: NonNullable<RcTableProps['internalRefs']> = {
        body: React.useRef<HTMLDivElement>(null),
    } as NonNullable<RcTableProps['internalRefs']>;

    // ============================= Refs =============================
    const rootRef = React.useRef<HTMLDivElement>(null);
    const tblRef = React.useRef<RcReference>(null);

    useProxyImperativeHandle(ref, () => ({
        ...tblRef.current!,
        nativeElement: rootRef.current!,
    }));

    // ========================== Render ==========================
    const TableComponent = virtual ? RcVirtualTable : RcTable;

    // ============================ RowKey ============================
    const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
        if (typeof rowKey === 'function') {
            return rowKey;
        }

        return (record: RecordType) => (record as any)?.[rowKey as string];
    }, [rowKey]);

    const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

    // ============================ Events =============================
    const changeEventInfo: Partial<ChangeEventInfo<RecordType>> = {};

    const triggerOnChange = (
        info: Partial<ChangeEventInfo<RecordType>>,
        action: TableAction,
        reset = false
    ) => {
        const changeInfo = {
            ...changeEventInfo,
            ...info,
        };

        if (reset) {
            changeEventInfo.resetPagination!();

            // Reset event param
            if (changeInfo.pagination!.current) {
                changeInfo.pagination!.current = 1;
            }

            // Trigger pagination events
            if (pagination && pagination.onChange) {
                pagination.onChange(1, changeInfo.pagination!.pageSize!);
            }
        }

        if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body.current) {
            scrollTo(0, {
                getContainer: () => internalRefs.body.current!,
            });
        }

        onChange?.(changeInfo.pagination!, changeInfo.filters!, changeInfo.sorter!, {
            currentDataSource: getFilterData(
                getSortData(rawData, changeInfo.sorterStates!, childrenColumnName),
                changeInfo.filterStates!
            ),
            action,
        });
    };

    /**
     * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?) to read
     * state out and then put it back to title render. Move these code into `hooks` but still too
     * complex. We should provides Table props like `sorter` & `filter` to handle control in next big
     * version.
     */

    // ============================ Sorter =============================
    const onSorterChange = (
        sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
        sorterStates: SortState<RecordType>[]
    ) => {
        triggerOnChange(
            {
                sorter,
                sorterStates,
            },
            'sort',
            false
        );
    };
    const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] =
        useSorter<RecordType>({
            prefixCls,
            mergedColumns,
            onSorterChange,
            sortDirections: sortDirections || ['ascend', 'descend'],
            tableLocale,
            showSorterTooltip,
        } as any);
    const sortedData = React.useMemo(
        () => getSortData(rawData, sortStates, childrenColumnName),
        [rawData, sortStates]
    );

    changeEventInfo.sorter = getSorters() as any;
    changeEventInfo.sorterStates = sortStates;

    // ============================ Filter ============================
    const onFilterChange = (
        filters: Record<string, FilterValue>,
        filterStates: FilterState<RecordType>[]
    ) => {
        triggerOnChange(
            {
                filters,
                filterStates,
            },
            'filter',
            true
        );
    };

    const [transformFilterColumns, filterStates, filters] = useFilter<RecordType>({
        prefixCls,
        locale: tableLocale,
        dropdownPrefixCls,
        mergedColumns,
        onFilterChange,
        getPopupContainer,
    } as any);
    const mergedData = getFilterData(sortedData, filterStates);

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
            'paginate'
        );
    };

    const [mergedPagination, resetPagination] = usePagination(
        mergedData.length,
        pagination as any,
        onPaginationChange
    );

    changeEventInfo.pagination =
        pagination === false ? {} : getPaginationParam(pagination as any, mergedPagination);

    changeEventInfo.resetPagination = resetPagination;

    // ============================= Data =============================
    const pageData = React.useMemo<RecordType[]>(() => {
        if (pagination === false || !mergedPagination.pageSize) {
            return mergedData;
        }

        const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination;
        warning(current > 0, 'usage', '`current` should be positive number.');

        // Dynamic table data
        if (mergedData.length < total!) {
            if (mergedData.length > pageSize) {
                warning(
                    false,
                    'usage',
                    '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.'
                );
                return mergedData.slice((current - 1) * pageSize, current * pageSize);
            }
            return mergedData;
        }

        return mergedData.slice((current - 1) * pageSize, current * pageSize);
    }, [
        !!pagination,
        mergedData,
        mergedPagination && mergedPagination.current,
        mergedPagination && mergedPagination.pageSize,
        mergedPagination && mergedPagination.total,
    ]);

    // ========================== Selections ==========================
    const [transformSelectionColumns, selectedKeySet] = useSelection<RecordType>(
        rowSelection as any,
        {
            prefixCls,
            data: mergedData,
            pageData,
            getRowKey,
            getRecordByKey,
            expandType,
            childrenColumnName,
            locale: tableLocale,
            getPopupContainer,
        }
    );

    const internalRowClassName = (record: RecordType, index: number, indent: number) => {
        let mergedRowClassName: string;
        if (typeof rowClassName === 'function') {
            mergedRowClassName = classNames(rowClassName(record, index, indent));
        } else {
            mergedRowClassName = classNames(rowClassName);
        }

        return classNames(
            {
                [`${prefixCls}-row-selected`]: selectedKeySet.has(getRowKey(record, index)),
            },
            mergedRowClassName
        );
    };

    // ========================== Expandable ==========================

    // Pass origin render status into `rc-table`, this can be removed when refactor with `rc-table`
    (mergedExpandable as any).__PARENT_RENDER_ICON__ = mergedExpandable.expandIcon;

    // Customize expandable icon
    mergedExpandable.expandIcon =
        mergedExpandable.expandIcon || expandIcon || renderExpandIcon(tableLocale!);

    // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
    if (expandType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
        mergedExpandable.expandIconColumnIndex = rowSelection ? 1 : 0;
    } else if (mergedExpandable.expandIconColumnIndex! > 0 && rowSelection) {
        mergedExpandable.expandIconColumnIndex! -= 1;
    }

    // Indent size
    if (typeof mergedExpandable.indentSize !== 'number') {
        mergedExpandable.indentSize = typeof indentSize === 'number' ? indentSize : 15;
    }

    // ============================ Render ============================
    const transformColumns = React.useCallback(
        (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> =>
            transformTitleColumns(
                transformSelectionColumns(
                    transformFilterColumns(transformSorterColumns(innerColumns as any))
                )
            ) as any,
        [transformSorterColumns, transformFilterColumns, transformSelectionColumns]
    );

    let topPaginationNode: React.ReactNode;
    let bottomPaginationNode: React.ReactNode;
    if (pagination !== false && mergedPagination?.total) {
        let paginationSize: TablePaginationConfig['size'];
        if (mergedPagination.size) {
            paginationSize = mergedPagination.size;
        } else {
            paginationSize =
                mergedSize === 'small' || mergedSize === 'middle' ? 'small' : undefined;
        }

        const renderPagination = (position: string) => (
            <Pagination
                {...mergedPagination}
                className={classNames(
                    `${prefixCls}-pagination ${prefixCls}-pagination-${position}`,
                    mergedPagination.className
                )}
                size={paginationSize}
            />
        );
        const defaultPosition = direction === 'rtl' ? 'left' : 'right';
        const { position } = mergedPagination;
        if (position !== null && Array.isArray(position)) {
            const topPos = position.find((p) => p.includes('top'));
            const bottomPos = position.find((p) => p.includes('bottom'));
            const isDisable = position.every((p) => `${p}` === 'none');
            if (!topPos && !bottomPos && !isDisable) {
                bottomPaginationNode = renderPagination(defaultPosition);
            }
            if (topPos) {
                topPaginationNode = renderPagination(topPos!.toLowerCase().replace('top', ''));
            }
            if (bottomPos) {
                bottomPaginationNode = renderPagination(
                    bottomPos!.toLowerCase().replace('bottom', '')
                );
            }
        } else {
            bottomPaginationNode = renderPagination(defaultPosition);
        }
    }

    // >>>>>>>>> Spinning
    let spinProps: SpinProps | undefined;
    if (typeof loading === 'boolean') {
        spinProps = {
            spinning: loading,
        };
    } else if (typeof loading === 'object') {
        spinProps = {
            spinning: true,
            ...loading,
        };
    }

    const wrapperClassNames = classNames(
        `${prefixCls}-wrapper`,
        {
            [`${prefixCls}-wrapper-rtl`]: direction === 'rtl',
        },
        className
    );
    return (
        <div ref={rootRef} className={wrapperClassNames} style={style}>
            <Spin spinning={false} {...spinProps}>
                {topPaginationNode}
                <TableComponent<RecordType>
                    {...tableProps}
                    ref={tblRef}
                    columns={mergedColumns as RcTableProps<RecordType>['columns']}
                    direction={direction}
                    expandable={mergedExpandable}
                    prefixCls={prefixCls}
                    className={classNames({
                        [`${prefixCls}-middle`]: mergedSize === 'middle',
                        [`${prefixCls}-small`]: mergedSize === 'small',
                        [`${prefixCls}-bordered`]: bordered,
                        [`${prefixCls}-empty`]: rawData.length === 0,
                    })}
                    data={pageData}
                    rowKey={getRowKey}
                    rowClassName={internalRowClassName}
                    emptyText={
                        (locale && locale.emptyText) || (renderEmpty || defaultRenderEmpty)('Table')
                    }
                    // Internal
                    internalHooks={INTERNAL_HOOKS}
                    internalRefs={internalRefs as any}
                    transformColumns={
                        transformColumns as unknown as RcTableProps<RecordType>['transformColumns']
                    }
                />
                {bottomPaginationNode}
            </Spin>
        </div>
    );
};

export default React.forwardRef(InternalTable) as RefInternalTable;
