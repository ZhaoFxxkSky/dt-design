/**
 * Feature:
 *  - fixed not need to set width
 *  - support `rowExpandable` to config row expand logic
 *  - add `summary` to support `() => ReactNode`
 *
 * Update:
 *  - `dataIndex` is `array[]` now
 *  - `expandable` wrap all the expand related props
 *
 * Removed:
 *  - expandIconAsCell
 *  - useFixedHeader
 *  - rowRef
 *  - columns[number].onCellClick
 *  - onRowClick
 *  - onRowDoubleClick
 *  - onRowMouseEnter
 *  - onRowMouseLeave
 *  - getBodyWrapper
 *  - bodyStyle
 *
 * Deprecated:
 *  - All expanded props, move into expandable
 */

import { clsx } from 'clsx';
import ResizeObserver from 'rc-resize-observer';
import { getDOM } from 'rc-util/lib/Dom/findDOMNode';
import getValue from 'rc-util/lib/utils/get';
import { getTargetScrollBarSize } from 'rc-util/lib/getScrollBarSize';
import isEqual from 'rc-util/lib/isEqual';
import { pickAttrs } from '../../_util/rcUtil';
import useEvent from '../../_util/hooks/useEvent';
import useLayoutEffect from '../../_util/hooks/useLayoutEffect';
import warning from 'rc-util/lib/warning';
import * as React from 'react';
import type { AnyObject } from '../../_util/type';
import type { InternalTableProps } from '../InternalTable';
import Body from './Body';
import ColGroup from './ColGroup';
import { INTERNAL_HOOKS } from '../constant';
import TableContext, { makeImmutable } from '../shared/context/TableContext';
import type { ScrollInfoType, TableContextProps } from '../shared/context/TableContext';
import type { FixedHeaderProps } from './FixedHolder';
import FixedHolder from './FixedHolder';
import Footer from './Footer';
import type { SummaryProps } from './Footer/Summary';
import Summary from './Footer/Summary';
import Header from './Header/Header';
import useColumns from '../features/columns/useColumns';
import useExpand from '../features/expand/useExpand';
import useFixedInfo from '../features/fixed/useFixedInfo';
import { useTimeoutLock } from '../features/virtual/useFrame';
import useHover from '../features/hover/useHover';
import useSticky from '../features/sticky/useSticky';
import useStickyOffsets from '../features/fixed/useStickyOffsets';
import useAutoColumnMeasure from '../features/virtual/useAutoColumnMeasure';
import type {
  ColumnsType,
  ColumnType,
  CustomizeScrollBody,
  DefaultRecordType,
  Direction,
  ExpandableConfig,
  GetComponent,
  GetComponentProps,
  GetRowKey,
  LegacyExpandableProps,
  PanelRender,
  Reference,
  RowClassName,
  TableComponents,
  TableLayout,
  TableSticky,
} from '../interface';
import Panel from './Panel';
import StickyScrollBar from '../features/sticky/stickyScrollBar';

import { getColumnsKey, validateValue, validNumberValue } from '../shared/utils/valueUtil';
import { getAutoColumnHintWidth, getInternalColumnType, INTERNAL_COL_DEFINE, isAutoWidthColumn } from '../shared/utils/legacyUtil';

export type CompareProps<T extends React.ComponentType<any>> = (
  prevProps: Readonly<React.ComponentProps<T>>,
  nextProps: Readonly<React.ComponentProps<T>>,
) => boolean;

export const DEFAULT_PREFIX = 'rc-table';

// Used for conditions cache
const EMPTY_DATA: any[] = [];

// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};

export type SemanticName = 'section' | 'title' | 'footer' | 'content';
export type ComponentsSemantic = 'wrapper' | 'cell' | 'row';

export interface TableProps<RecordType = any>
  extends Omit<LegacyExpandableProps<RecordType>, 'showExpandColumn'> {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  classNames?: Partial<Record<SemanticName, string>> & {
    body?: Partial<Record<ComponentsSemantic, string>>;
    header?: Partial<Record<ComponentsSemantic, string>>;
  };
  styles?: Partial<Record<SemanticName, React.CSSProperties>> & {
    body?: Partial<Record<ComponentsSemantic, React.CSSProperties>>;
    header?: Partial<Record<ComponentsSemantic, React.CSSProperties>>;
  };
  children?: React.ReactNode;
  data?: readonly RecordType[];
  columns?: ColumnsType<RecordType>;
  rowKey?: string | keyof RecordType | GetRowKey<RecordType>;
  tableLayout?: TableLayout;

  // Fixed Columns
  scroll?: { x?: number | true | string; y?: number | string };

  // Expandable
  /** Config expand rows */
  expandable?: ExpandableConfig<RecordType>;
  indentSize?: number;
  rowClassName?: string | RowClassName<RecordType>;

  // Additional Part
  footer?: PanelRender<RecordType>;
  summary?: (data: readonly RecordType[]) => React.ReactNode;
  caption?: React.ReactNode;

  // Customize
  id?: string;
  showHeader?: boolean;
  components?: TableComponents<RecordType>;
  onRow?: GetComponentProps<RecordType>;
  onHeaderRow?: GetComponentProps<readonly ColumnType<RecordType>[]>;
  emptyText?: React.ReactNode | (() => React.ReactNode);

  direction?: Direction;

  sticky?: boolean | TableSticky;

  rowHoverable?: boolean;

  // Events
  onScroll?: React.UIEventHandler<HTMLDivElement>;

  // =================================== Internal ===================================
  /**
   * @private Internal usage, may remove by refactor. Should always use `columns` instead.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  internalHooks?: string;

  /**
   * @private Internal usage, may remove by refactor. Should always use `columns` instead.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Used for antd table transform column with additional column
  transformColumns?: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Force trade scrollbar as 0 size.
  // Force column to be average width if not set
  tailor?: boolean;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  // Pass the way to get real width. e.g. exclude the border width
  getContainerWidth?: (ele: HTMLElement, width: number) => number;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  internalRefs?: {
    body: React.MutableRefObject<HTMLDivElement | null>;
  };
  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  measureRowRender?: (measureRow: React.ReactNode) => React.ReactNode;

  /**
   * @private Internal usage, may remove by refactor.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   *
   * auto 内部列（rowSelection / expand 未显式设宽）实测宽度上报。
   * 虚拟模式来自 useAutoColumnMeasure，非虚拟模式来自 MeasureRow，
   * 统一在 colsWidths 更新后上报，供 InternalTable 的 resize 总宽账目使用。
   */
  onAutoColumnMeasure?: (columnType: string, width: number) => void;
}

function defaultEmpty() {
  return 'No Data';
}

const Table = <RecordType extends DefaultRecordType>(
  tableProps: TableProps<RecordType>,
  ref: React.Ref<Reference>,
) => {
  const props = {
    rowKey: 'key',
    prefixCls: DEFAULT_PREFIX,
    emptyText: defaultEmpty,
    ...tableProps,
  };

  const {
    prefixCls,
    className,
    rowClassName,
    style,
    classNames,
    styles,
    data,
    rowKey,
    scroll,
    tableLayout,
    direction,

    // Additional Part
    title,
    footer,
    summary,
    caption,

    // Customize
    id,
    showHeader,
    components,
    emptyText,
    onRow,
    onHeaderRow,

    // Measure Row
    measureRowRender,

    // Events
    onScroll,

    // Internal
    internalHooks,
    transformColumns,
    internalRefs,
    tailor,
    getContainerWidth,
    onAutoColumnMeasure,

    sticky,
    rowHoverable = true,
  } = props;

  const mergedData = data || EMPTY_DATA;
  const hasData = !!mergedData.length;

  const useInternalHooks = internalHooks === INTERNAL_HOOKS;

  // ===================== Warning ======================
  if (process.env.NODE_ENV !== 'production') {
    [
      'onRowClick',
      'onRowDoubleClick',
      'onRowContextMenu',
      'onRowMouseEnter',
      'onRowMouseLeave',
    ].forEach((name) => {
      warning(
        props[name as keyof typeof props] === undefined,
        `\`${name}\` is removed, please use \`onRow\` instead.`,
      );
    });

    warning(
      !('getBodyWrapper' in props),
      '`getBodyWrapper` is deprecated, please use custom `components` instead.',
    );
  }

  // ==================== Customize =====================
  const getComponent = React.useCallback<GetComponent>(
    (path, defaultComponent) => getValue(components, path) || defaultComponent,
    [components],
  );

  const getRowKey = React.useMemo<GetRowKey<RecordType>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }
    return (record: RecordType) => {
      const key = record && record[rowKey];

      if (process.env.NODE_ENV !== 'production') {
        warning(
          key !== undefined,
          'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.',
        );
      }

      return key;
    };
  }, [rowKey]);

  const customizeScrollBody = getComponent(['body']) as CustomizeScrollBody<RecordType>;

  // ====================== Hover =======================
  const [startRow, endRow, onHover] = useHover();

  // ====================== Expand ======================
  const [
    expandableConfig,
    expandableType,
    mergedExpandedKeys,
    mergedExpandIcon,
    mergedChildrenColumnName,
    onTriggerExpand,
  ] = useExpand(props, mergedData, getRowKey);

  // ====================== Column ======================
  const scrollX = scroll?.x;
  const [componentWidth, setComponentWidth] = React.useState(0);
  // 列实测宽度（测量行 / 虚拟测量管线回写）。需先于 useColumns 声明：
  // 虚拟模式下 auto 内部列的实测宽度会回传给 useWidthColumns 参与弹性分配。
  const [colsWidths, updateColsWidths] = React.useState(() => new Map<React.Key, number>());

  const [columns, flattenColumns, flattenScrollX] = useColumns(
    {
      ...props,
      ...expandableConfig,
      expandable: !!expandableConfig.expandedRowRender,
      columnTitle: expandableConfig.columnTitle,
      expandedKeys: mergedExpandedKeys,
      getRowKey,
      // https://github.com/ant-design/ant-design/issues/23894
      onTriggerExpand,
      expandIcon: mergedExpandIcon,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex,
      direction,
      scrollWidth: useInternalHooks && tailor && typeof scrollX === 'number' ? scrollX : undefined,
      clientWidth: componentWidth,
      measuredWidths: colsWidths,
    },
    // `useColumns` guards the call with `if (transformColumns)`, so `null`
    // ("no transform") is a valid runtime value here.
    (useInternalHooks ? transformColumns : null) as (
      columns: ColumnsType<RecordType>,
    ) => ColumnsType<RecordType>,
  );
  const mergedScrollX = flattenScrollX ?? scrollX;

  const columnContext = React.useMemo(
    () => ({ columns, flattenColumns }),
    [columns, flattenColumns],
  );

  // ======================= Refs =======================
  const fullTableRef = React.useRef<HTMLDivElement>(null);
  const scrollHeaderRef = React.useRef<HTMLDivElement>(null);
  const scrollBodyRef = React.useRef<HTMLDivElement>(null);
  const scrollBodyContainerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => {
    return {
      nativeElement: fullTableRef.current,
      scrollTo: (config) => {
        if (scrollBodyRef.current instanceof HTMLElement) {
          // Native scroll
          const { index, top, key, offset, align = 'nearest' } = config;

          if (validNumberValue(top)) {
            // In top mode, offset is ignored
            scrollBodyRef.current?.scrollTo({ top });
          } else {
            const mergedKey =
              key ?? (index !== undefined ? getRowKey(mergedData[index]) : undefined);
            const targetElement = scrollBodyRef.current.querySelector(
              `[data-row-key="${mergedKey}"]`,
            );
            if (targetElement) {
              targetElement.scrollIntoView({ block: align });
              if (offset) {
                const container = scrollBodyRef.current;
                container.scrollTo({ top: container.scrollTop + offset });
              }
            }
          }
        } else if ((scrollBodyRef.current as any)?.scrollTo) {
          // Pass to proxy
          (scrollBodyRef.current as any).scrollTo(config);
        }
      },
      // `validate` / `resetErrors` / `resetColumnWidths` are provided by the
      // `InternalTable` wrapper, which spreads this handle and overrides them
      // (see InternalTable.tsx). `nativeElement` is attached after mount.
    } as Reference;
  });

  // ====================== Scroll ======================
  const scrollSummaryRef = React.useRef<HTMLDivElement>(null);
  const [shadowStart, setShadowStart] = React.useState(false);
  const [shadowEnd, setShadowEnd] = React.useState(false);

  // Convert map to number width
  const colsKeys = getColumnsKey(flattenColumns);
  const pureColWidths = flattenColumns.map((column, index) => {
    const measured = colsWidths.get(colsKeys[index]);
    // 虚拟模式 auto 内部列：实测值就绪前先填提示值，
    // 避免首帧固定列偏移（stickyOffsets）按 0 计算造成闪动
    if (
      measured === undefined &&
      typeof customizeScrollBody === 'function' &&
      isAutoWidthColumn(column)
    ) {
      return getAutoColumnHintWidth(column);
    }
    return measured;
  });
  // `Map.get` may yield `undefined` for unmeasured columns; all consumers
  // (`useStickyOffsets`, `FixedHolder`, `ColGroup`) tolerate that at runtime.
  const colWidths = React.useMemo(() => pureColWidths as number[], [pureColWidths.join('_')]);

  // auto 内部列实测宽度上报（供 InternalTable 的 resize 总宽账目）：
  // 虚拟模式由 useAutoColumnMeasure 写入，非虚拟由 MeasureRow 写入，统一在此上报
  const autoMeasureReportedRef = React.useRef<Record<string, number>>({});
  React.useEffect(() => {
    if (!onAutoColumnMeasure) {
      return;
    }
    const columnsKey = getColumnsKey(flattenColumns);
    flattenColumns.forEach((column, index) => {
      if (!isAutoWidthColumn(column)) {
        return;
      }
      const columnType = getInternalColumnType(column) as string;
      const width = colsWidths.get(columnsKey[index]);
      if (width && autoMeasureReportedRef.current[columnType] !== width) {
        autoMeasureReportedRef.current[columnType] = width;
        onAutoColumnMeasure(columnType, width);
      }
    });
  }, [colsWidths, flattenColumns, onAutoColumnMeasure]);
  const stickyOffsets = useStickyOffsets(colWidths, flattenColumns);
  const fixHeader = !!scroll && validateValue(scroll.y);
  const horizonScroll = (scroll && validateValue(mergedScrollX)) || Boolean(expandableConfig.fixed);
  const fixColumn = horizonScroll && flattenColumns.some(({ fixed }) => fixed);

  // Sticky
  const stickyRef = React.useRef<{
    setScrollLeft: (left: number) => void;
    checkScrollBarVisible: () => void;
  }>(null);

  const { isSticky, offsetHeader, offsetSummary, offsetScroll, stickyClassName, container } =
    useSticky(sticky ?? false, prefixCls);

  // Footer (Fix footer must fixed header)
  const summaryNode = React.useMemo(() => summary?.(mergedData), [summary, mergedData]);
  const fixFooter =
    (fixHeader || isSticky) &&
    React.isValidElement(summaryNode) &&
    summaryNode.type === Summary &&
    (summaryNode.props as SummaryProps).fixed;

  // Scroll
  let scrollXStyle: React.CSSProperties = {};
  let scrollYStyle: React.CSSProperties = {};
  let scrollTableStyle: React.CSSProperties = {};

  if (fixHeader) {
    scrollYStyle = {
      overflowY: hasData ? 'scroll' : 'auto',
      maxHeight: scroll.y,
    };
  }

  if (horizonScroll) {
    scrollXStyle = { overflowX: 'auto' };
    // When no vertical scrollbar, should hide it
    // https://github.com/ant-design/ant-design/pull/20705
    // https://github.com/ant-design/ant-design/issues/21879
    if (!fixHeader) {
      scrollYStyle = { overflowY: 'hidden' };
    }
    scrollTableStyle = {
      width: mergedScrollX === true ? 'auto' : mergedScrollX,
      minWidth: '100%',
    };
  }

  const onColumnResize = React.useCallback((columnKey: React.Key, width: number) => {
    updateColsWidths((widths) => {
      if (widths.get(columnKey) !== width) {
        const newWidths = new Map(widths);
        newWidths.set(columnKey, width);
        return newWidths;
      }
      return widths;
    });
  }, []);

  // 虚拟模式：测量 auto 内部列（rowSelection / expand 未显式设宽）的真实 CSS 宽度，
  // 回写 colsWidths 驱动 body 网格 / 固定列偏移 / 弹性分配。
  // showHeader=false 时没有表头，改用隐藏探针（probeRef）承载 CSS 类宽度
  const autoColumnProbeRef = React.useRef<HTMLTableElement>(null);
  useAutoColumnMeasure(
    typeof customizeScrollBody === 'function',
    flattenColumns,
    scrollHeaderRef,
    onColumnResize,
    autoColumnProbeRef,
  );

  const [setScrollTarget, getScrollTarget] = useTimeoutLock<object | null>(null);

  function forceScroll(
    scrollLeft: number,
    target: HTMLDivElement | ((left: number) => void) | null | undefined,
  ) {
    if (!target) {
      return;
    }
    if (typeof target === 'function') {
      target(scrollLeft);
    } else if (target.scrollLeft !== scrollLeft) {
      target.scrollLeft = scrollLeft;

      // Delay to force scroll position if not sync
      // ref: https://github.com/ant-design/ant-design/issues/37179
      if (target.scrollLeft !== scrollLeft) {
        setTimeout(() => {
          target.scrollLeft = scrollLeft;
        }, 0);
      }
    }
  }

  const [scrollInfo, setScrollInfo] = React.useState<ScrollInfoType>([0, 0]);

  const onInternalScroll = useEvent(
    ({ currentTarget, scrollLeft }: { currentTarget?: HTMLElement; scrollLeft?: number }) => {
      const mergedScrollLeft =
        typeof scrollLeft === 'number' ? scrollLeft : (currentTarget?.scrollLeft ?? 0);

      const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
      if (!getScrollTarget() || getScrollTarget() === compareTarget) {
        setScrollTarget(compareTarget);

        forceScroll(mergedScrollLeft, scrollHeaderRef.current);
        forceScroll(mergedScrollLeft, scrollBodyRef.current);
        forceScroll(mergedScrollLeft, scrollSummaryRef.current);
        forceScroll(mergedScrollLeft, stickyRef.current?.setScrollLeft);
      }

      const measureTarget = currentTarget || scrollHeaderRef.current;
      if (measureTarget) {
        const scrollWidth =
          // Should use mergedScrollX in virtual table(useInternalHooks && tailor === true)
          useInternalHooks && tailor && typeof mergedScrollX === 'number'
            ? mergedScrollX
            : measureTarget.scrollWidth;
        const clientWidth = measureTarget.clientWidth;

        const absScrollStart = Math.abs(mergedScrollLeft);
        setScrollInfo((ori) => {
          const nextScrollInfo: ScrollInfoType = [absScrollStart, scrollWidth - clientWidth];
          return isEqual(ori, nextScrollInfo) ? ori : nextScrollInfo;
        });

        // There is no space to scroll
        if (scrollWidth === clientWidth) {
          setShadowStart(false);
          setShadowEnd(false);
          return;
        }
        setShadowStart(absScrollStart > 0);
        setShadowEnd(absScrollStart < scrollWidth - clientWidth - 1);
      }
    },
  );

  const onBodyScroll = useEvent((e: React.UIEvent<HTMLDivElement>) => {
    onInternalScroll(e);
    onScroll?.(e);
  });

  const triggerOnScroll = () => {
    if (horizonScroll && scrollBodyRef.current) {
      onInternalScroll({
        currentTarget: getDOM(scrollBodyRef.current) as HTMLElement,
        scrollLeft: scrollBodyRef.current?.scrollLeft,
      });
    } else {
      setShadowStart(false);
      setShadowEnd(false);
    }
  };

  const onFullTableResize = (offsetWidth?: number) => {
    stickyRef.current?.checkScrollBarVisible();
    let mergedWidth = offsetWidth ?? fullTableRef.current?.offsetWidth ?? 0;
    if (useInternalHooks && getContainerWidth && fullTableRef.current) {
      mergedWidth = getContainerWidth(fullTableRef.current, mergedWidth) || mergedWidth;
    }

    if (mergedWidth !== componentWidth) {
      triggerOnScroll();
      setComponentWidth(mergedWidth);
    }
  };

  // fix https://github.com/ant-design/ant-design/issues/49279
  useLayoutEffect(() => {
    if (horizonScroll) {
      onFullTableResize();
    }
  }, [horizonScroll]);

  // Sync scroll bar when init or `horizonScroll`, `data` and `columns.length` changed
  const mounted = React.useRef(false);
  React.useEffect(() => {
    // onFullTableResize will be trigger once when ResizeObserver is mounted
    // This will reduce one duplicated triggerOnScroll time
    if (mounted.current) {
      triggerOnScroll();
    }
  }, [horizonScroll, data, columns.length]);
  React.useEffect(() => {
    mounted.current = true;
  }, []);

  // ===================== Effects ======================
  const [scrollbarSize, setScrollbarSize] = React.useState(0);

  useLayoutEffect(() => {
    if (!tailor || !useInternalHooks) {
      if (scrollBodyRef.current instanceof Element) {
        setScrollbarSize(getTargetScrollBarSize(scrollBodyRef.current).width);
      } else {
        setScrollbarSize(getTargetScrollBarSize(scrollBodyContainerRef.current!).width);
      }
    }
  }, []);

  // ================== INTERNAL HOOKS ==================
  React.useEffect(() => {
    if (useInternalHooks && internalRefs) {
      internalRefs.body.current = scrollBodyRef.current;
    }
  });

  // ========================================================================
  // ==                               Render                               ==
  // ========================================================================
  // =================== Render: Func ===================
  const renderFixedHeaderTable = React.useCallback<FixedHeaderProps<RecordType>['children']>(
    (fixedHolderPassProps) => (
      <>
        <Header {...fixedHolderPassProps} />
        {fixFooter === 'top' && <Footer {...fixedHolderPassProps}>{summaryNode}</Footer>}
      </>
    ),
    [fixFooter, summaryNode],
  );

  const renderFixedFooterTable = React.useCallback<FixedHeaderProps<RecordType>['children']>(
    (fixedHolderPassProps) => <Footer {...fixedHolderPassProps}>{summaryNode}</Footer>,
    [summaryNode],
  );

  // =================== Render: Node ===================
  const TableComponent = getComponent(['table'], 'table');

  // Table layout
  const mergedTableLayout = React.useMemo<TableLayout>(() => {
    if (tableLayout) {
      return tableLayout;
    }
    // https://github.com/ant-design/ant-design/issues/25227
    // When scroll.x is max-content, no need to fix table layout
    // it's width should stretch out to fit content
    if (fixColumn) {
      return mergedScrollX === 'max-content' ? 'auto' : 'fixed';
    }
    if (fixHeader || isSticky || flattenColumns.some(({ ellipsis }) => ellipsis)) {
      return 'fixed';
    }
    return 'auto';
  }, [fixHeader, fixColumn, flattenColumns, tableLayout, isSticky]);

  let groupTableNode: React.ReactNode;

  // Header props
  const headerProps = {
    colWidths,
    columCount: flattenColumns.length,
    stickyOffsets,
    // `HeaderRow` guards `onHeaderRow` with a truthiness check, so `undefined`
    // is a valid runtime value here.
    onHeaderRow: onHeaderRow as GetComponentProps<readonly ColumnType<RecordType>[]>,
    fixHeader,
    scroll,
  };

  // Empty
  const emptyNode = React.useMemo<React.ReactNode>(() => {
    if (hasData) {
      return null;
    }

    if (typeof emptyText === 'function') {
      return emptyText();
    }
    return emptyText;
  }, [hasData, emptyText]);

  // Body
  const bodyTable = (
    <Body data={mergedData} measureColumnWidth={fixHeader || horizonScroll || isSticky} />
  );

  const bodyColGroup = (
    // A column without `width` renders an unset `<col>` width; `ColGroup`
    // treats falsy widths as "no width", so the value is safe at runtime.
    <ColGroup colWidths={flattenColumns.map(({ width }) => width!)} columns={flattenColumns} />
  );

  const captionElement =
    caption !== null && caption !== undefined ? (
      <caption className={`${prefixCls}-caption`}>{caption}</caption>
    ) : undefined;

  const dataProps = pickAttrs(props, { data: true });
  const ariaProps = pickAttrs(props, { aria: true });

  if (fixHeader || isSticky) {
    // >>>>>> Fixed Header
    let bodyContent: React.ReactNode;

    if (typeof customizeScrollBody === 'function') {
      bodyContent = customizeScrollBody(mergedData, {
        scrollbarSize,
        ref: scrollBodyRef,
        onScroll: onInternalScroll,
      });

      // 表头最后一列需为纵向滚动条让出宽度；若最后一列是 auto 内部列
      // （宽度由 CSS 驱动，不可内联调整），则由最后一个非 auto 列承担
      let lastWidthColumnIndex = -1;
      flattenColumns.forEach((column, index) => {
        if (!isAutoWidthColumn(column)) {
          lastWidthColumnIndex = index;
        }
      });

      headerProps.colWidths = flattenColumns.map((column, index) => {
        const { width } = column;

        // auto 内部列（rowSelection / expand 未显式设宽）：不写内联宽度，
        // 交由 CSS 类驱动（LESS 变量 / 用户覆盖均可生效），实测宽度由测量管线同步
        if (isAutoWidthColumn(column)) {
          return undefined as unknown as number;
        }

        const colWidth =
          index === lastWidthColumnIndex ? (width as number) - scrollbarSize : width;
        if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
          return colWidth;
        }

        if (process.env.NODE_ENV !== 'production') {
          warning(
            props.columns?.length === 0,
            'When use `components.body` with render props. Each column should have a fixed `width` value.',
          );
        }
        return 0;
      }) as number[];
    } else {
      bodyContent = (
        <div
          style={{
            ...scrollXStyle,
            ...scrollYStyle,
          }}
          onScroll={onBodyScroll}
          ref={scrollBodyRef}
          className={`${prefixCls}-body`}
        >
          <TableComponent
            style={{
              ...scrollTableStyle,
              tableLayout: mergedTableLayout,
            }}
            {...ariaProps}
          >
            {captionElement}
            {bodyColGroup}
            {bodyTable}
            {!fixFooter && summaryNode && (
              <Footer stickyOffsets={stickyOffsets} flattenColumns={flattenColumns}>
                {summaryNode}
              </Footer>
            )}
          </TableComponent>
        </div>
      );
    }

    // Fixed holder share the props
    const fixedHolderProps = {
      noData: !mergedData.length,
      maxContentScroll: horizonScroll && mergedScrollX === 'max-content',
      ...headerProps,
      ...columnContext,
      // `FixedHolder` only compares `direction === 'rtl'`, so the `'ltr'`
      // fallback behaves exactly like `undefined`.
      direction: direction ?? 'ltr',
      stickyClassName,
      scrollX: mergedScrollX,
      tableLayout: mergedTableLayout,
      onScroll: onInternalScroll,
    };

    groupTableNode = (
      <>
        {/* Header Table */}
        {showHeader !== false && (
          <FixedHolder
            {...fixedHolderProps}
            stickyTopOffset={offsetHeader}
            className={`${prefixCls}-header`}
            ref={scrollHeaderRef}
            colGroup={bodyColGroup}
          >
            {renderFixedHeaderTable}
          </FixedHolder>
        )}

        {/* Body Table */}
        {bodyContent}

        {/* Summary Table */}
        {fixFooter && fixFooter !== 'top' && (
          <FixedHolder
            {...fixedHolderProps}
            stickyBottomOffset={offsetSummary}
            className={`${prefixCls}-summary`}
            ref={scrollSummaryRef}
            colGroup={bodyColGroup}
          >
            {renderFixedFooterTable}
          </FixedHolder>
        )}

        {isSticky && scrollBodyRef.current && scrollBodyRef.current instanceof Element && (
          <StickyScrollBar
            ref={stickyRef}
            offsetScroll={offsetScroll}
            scrollBodyRef={scrollBodyRef}
            onScroll={onInternalScroll}
            container={container}
            // Only compared against `'rtl'` inside `StickyScrollBar`, so the
            // `'ltr'` fallback behaves exactly like `undefined`.
            direction={direction ?? 'ltr'}
          />
        )}
      </>
    );
  } else {
    // >>>>>> Unique table
    groupTableNode = (
      <div
        style={{ ...scrollXStyle, ...scrollYStyle, ...styles?.content }}
        className={clsx(`${prefixCls}-content`, classNames?.content)}
        onScroll={onInternalScroll}
        ref={scrollBodyRef}
      >
        <TableComponent
          style={{ ...scrollTableStyle, tableLayout: mergedTableLayout }}
          {...ariaProps}
        >
          {captionElement}
          {bodyColGroup}
          {showHeader !== false && <Header {...headerProps} {...columnContext} />}
          {bodyTable}
          {summaryNode && (
            <Footer stickyOffsets={stickyOffsets} flattenColumns={flattenColumns}>
              {summaryNode}
            </Footer>
          )}
        </TableComponent>
      </div>
    );
  }

  const tableStyle: React.CSSProperties & Record<string, unknown> = {
    ...style,
  };

  // Add css var for sticky header `zIndex` calc
  if (isSticky) {
    tableStyle['--columns-count'] = flattenColumns.length;
  }

  let fullTable = (
    <div
      className={clsx(prefixCls, className, {
        [`${prefixCls}-rtl`]: direction === 'rtl',
        [`${prefixCls}-fix-start-shadow`]: horizonScroll,
        [`${prefixCls}-fix-end-shadow`]: horizonScroll,
        [`${prefixCls}-fix-start-shadow-show`]: horizonScroll && shadowStart,
        [`${prefixCls}-fix-end-shadow-show`]: horizonScroll && shadowEnd,
        [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
        [`${prefixCls}-fixed-header`]: fixHeader,
        /** No used but for compatible */
        [`${prefixCls}-fixed-column`]: fixColumn,
        [`${prefixCls}-scroll-horizontal`]: horizonScroll,
        [`${prefixCls}-has-fix-start`]: flattenColumns[0]?.fixed,
        [`${prefixCls}-has-fix-end`]: flattenColumns[flattenColumns.length - 1]?.fixed === 'end',
      })}
      style={tableStyle}
      id={id}
      ref={fullTableRef}
      {...dataProps}
    >
      {/* showHeader=false 的虚拟表格没有表头可测 auto 内部列宽，
          渲染隐藏探针承载同样的 CSS 类（col 类宽 + th padding）供测量 */}
      {typeof customizeScrollBody === 'function' &&
        showHeader === false &&
        flattenColumns.some(isAutoWidthColumn) && (
          <table
            aria-hidden
            ref={autoColumnProbeRef}
            style={{
              position: 'absolute',
              insetInlineStart: -99999,
              top: 0,
              visibility: 'hidden',
              tableLayout: 'fixed',
              pointerEvents: 'none',
            }}
          >
            <colgroup>
              {flattenColumns.filter(isAutoWidthColumn).map((column, index) => {
                const { columnType, ...restAdditionalProps } =
                  (column as Record<string, any>)[INTERNAL_COL_DEFINE] || {};
                return <col key={columnType || index} {...restAdditionalProps} />;
              })}
            </colgroup>
            <tbody>
              <tr>
                {flattenColumns.filter(isAutoWidthColumn).map((column, index) => {
                  const { columnType } = (column as Record<string, any>)[INTERNAL_COL_DEFINE] || {};
                  return (
                    <th key={columnType || index} className={column.className as string} />
                  );
                })}
              </tr>
            </tbody>
          </table>
        )}
      {title && (
        <Panel
          className={clsx(`${prefixCls}-title`, classNames?.title)}
          style={styles?.title ?? {}}
        >
          {title(mergedData)}
        </Panel>
      )}
      <div
        ref={scrollBodyContainerRef}
        className={clsx(`${prefixCls}-container`, classNames?.section)}
        style={styles?.section}
      >
        {groupTableNode}
      </div>
      {footer && (
        <Panel
          className={clsx(`${prefixCls}-footer`, classNames?.footer)}
          style={styles?.footer ?? {}}
        >
          {footer(mergedData)}
        </Panel>
      )}
    </div>
  );

  if (horizonScroll) {
    fullTable = (
      <ResizeObserver onResize={({ offsetWidth }) => onFullTableResize(offsetWidth)}>
        {fullTable}
      </ResizeObserver>
    );
  }

  const fixedInfoList = useFixedInfo(flattenColumns, stickyOffsets);

  const TableContextValue = React.useMemo(
    () => ({
      // Scroll
      scrollX: mergedScrollX,
      scrollInfo,

      classNames,
      styles,

      // Table
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList,
      isSticky,

      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,

      // Body
      tableLayout: mergedTableLayout,
      rowClassName,
      expandedRowClassName: expandableConfig.expandedRowClassName,
      expandIcon: mergedExpandIcon,
      expandableType,
      expandRowByClick: expandableConfig.expandRowByClick,
      expandedRowRender: expandableConfig.expandedRowRender,
      expandedRowOffset: expandableConfig.expandedRowOffset,
      onTriggerExpand,
      expandIconColumnIndex: expandableConfig.expandIconColumnIndex,
      indentSize: expandableConfig.indentSize,
      allColumnsFixedLeft: flattenColumns.every((col) => col.fixed === 'start'),
      emptyNode,

      // Column
      columns,
      flattenColumns,
      onColumnResize,
      colWidths,

      // Row
      hoverStartRow: startRow,
      hoverEndRow: endRow,
      onHover,
      rowExpandable: expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      expandedKeys: mergedExpandedKeys,
      childrenColumnName: mergedChildrenColumnName,

      rowHoverable,

      // Measure Row
      measureRowRender,
    }),
    [
      // Scroll
      mergedScrollX,
      scrollInfo,
      classNames,
      styles,

      // Table
      prefixCls,
      getComponent,
      scrollbarSize,
      direction,
      fixedInfoList,
      isSticky,

      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll,

      // Body
      mergedTableLayout,
      rowClassName,
      expandableConfig.expandedRowClassName,
      mergedExpandIcon,
      expandableType,
      expandableConfig.expandRowByClick,
      expandableConfig.expandedRowRender,
      expandableConfig.expandedRowOffset,
      onTriggerExpand,
      expandableConfig.expandIconColumnIndex,
      expandableConfig.indentSize,
      emptyNode,

      // Column
      columns,
      flattenColumns,
      onColumnResize,
      colWidths,

      // Row
      startRow,
      endRow,
      onHover,
      expandableConfig.rowExpandable,
      onRow,

      getRowKey,
      mergedExpandedKeys,
      mergedChildrenColumnName,

      rowHoverable,

      measureRowRender,
    ],
  );

  return (
    // Several fields (e.g. `scrollX`, `direction`, `indentSize`) can be
    // `undefined` at runtime and all context consumers already guard them;
    // the context type (declared outside this file) marks them required.
    <TableContext.Provider value={TableContextValue as TableContextProps<RecordType>}>
      {fullTable}
    </TableContext.Provider>
  );
};

export type ForwardGenericTable = (<RecordType extends DefaultRecordType = any>(
  props: TableProps<RecordType> & React.RefAttributes<Reference>,
) => React.ReactElement<any>) & { displayName?: string };

const RefTable = React.forwardRef(Table) as ForwardGenericTable;

if (process.env.NODE_ENV !== 'production') {
  RefTable.displayName = 'Table';
}

export const genTable = (shouldTriggerRender?: CompareProps<ForwardGenericTable>) => {
  return makeImmutable(RefTable, shouldTriggerRender);
};

const RcTable = genTable((prev, next) => {
  const { _renderTimes: prevRenderTimes } = prev as Readonly<InternalTableProps<AnyObject>>;
  const { _renderTimes: nextRenderTimes } = next as Readonly<InternalTableProps<AnyObject>>;
  return prevRenderTimes !== nextRenderTimes;
});

export default RcTable;
