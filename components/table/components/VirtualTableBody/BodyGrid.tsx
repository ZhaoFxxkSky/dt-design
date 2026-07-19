import { useContext } from '../../../_util/context';
import VirtualList from 'rc-virtual-list';
import type { ListProps, ListRef } from 'rc-virtual-list';
import * as React from 'react';
import TableContext, { responseImmutable } from '../../shared/context/TableContext';
import useFlattenRecords from '../../features/virtual/useFlattenRecords';
import type { FlattenData } from '../../features/virtual/useFlattenRecords';
import { getAutoColumnHintWidth, isAutoWidthColumn } from '../../shared/utils/legacyUtil';
import { getColumnsKey } from '../../shared/utils/valueUtil';
import type {
  ColumnType,
  OnCustomizeScroll,
  ScrollConfig,
  VirtualScrollConfig,
} from '../../interface';
import BodyLine from './BodyLine';
import { GridContext, StaticContext } from './context';

const ALIGN_MAP: Record<string, 'top' | 'bottom' | 'auto'> = {
  start: 'top',
  end: 'bottom',
  nearest: 'auto',
};

export interface GridProps<RecordType = any> {
  data: RecordType[];
  onScroll: OnCustomizeScroll;
}

export interface GridRef {
  scrollLeft: number;
  nativeElement: HTMLDivElement;
  scrollTo: (scrollConfig: ScrollConfig) => void;
}

const Grid = React.forwardRef<GridRef, GridProps>((props, ref) => {
  const { data, onScroll } = props;

  const {
    flattenColumns,
    onColumnResize,
    getRowKey,
    expandedKeys,
    prefixCls,
    childrenColumnName,
    scrollX,
    direction,
    colWidths,
  } = useContext(TableContext, [
    'flattenColumns',
    'onColumnResize',
    'getRowKey',
    'prefixCls',
    'expandedKeys',
    'childrenColumnName',
    'scrollX',
    'direction',
    'colWidths',
  ]);

  const {
    sticky,
    scrollY,
    listItemHeight,
    getComponent,
    onScroll: onTablePropScroll,
  } = useContext(StaticContext);

  // =========================== Ref ============================
  const listRef = React.useRef<ListRef>(null);

  // =========================== Data ===========================
  const flattenData = useFlattenRecords(data, childrenColumnName, expandedKeys, getRowKey);

  // ========================== Column ==========================
  const columnsWidth = React.useMemo<[key: React.Key, width: number, total: number][]>(() => {
    const columnsKey = getColumnsKey(flattenColumns);
    let total = 0;
    return flattenColumns.map((column, index) => {
      const { width, minWidth } = column;
      // auto 内部列（rowSelection / expand 未显式设宽）：取测量管线回写的真实
      // CSS 宽度，未测量到时回退首帧提示值。
      // 普通列：与表头同源于 useWidthColumns 填充后的 width（resize 渲染宽）。
      // 不能用 max(width, minWidth)：resize 收缩后的渲染宽可能小于 minWidth，
      // max 兜底会让 body 单元格比表头 col 宽，导致表头/body 列错位。
      const finalWidth = isAutoWidthColumn(column)
        ? colWidths[index] || getAutoColumnHintWidth(column)
        : (width as number) || (minWidth as number) || 0;
      total += finalWidth;
      return [columnsKey[index], finalWidth, total];
    });
  }, [flattenColumns, colWidths]);

  const columnsOffset = React.useMemo<number[]>(
    () => columnsWidth.map((colWidth) => colWidth[2]),
    [columnsWidth],
  );

  React.useEffect(() => {
    columnsWidth.forEach(([key, width]) => {
      onColumnResize(key, width);
    });
  }, [columnsWidth]);

  // =========================== Ref ============================
  React.useImperativeHandle(ref, () => {
    const obj = {
      scrollTo: (config: VirtualScrollConfig) => {
        const { align, offset, ...restConfig } = config;

        const virtualAlign = (align && ALIGN_MAP[align]) ?? (offset ? 'top' : 'auto');

        listRef.current?.scrollTo({
          ...restConfig,
          offset,
          align: virtualAlign,
        });
      },
      nativeElement: listRef.current?.nativeElement,
    } as unknown as GridRef;

    Object.defineProperty(obj, 'scrollLeft', {
      get: () => listRef.current?.getScrollInfo().x || 0,

      set: (value: number) => {
        listRef.current?.scrollTo({
          left: value,
        });
      },
    });

    // https://github.com/ant-design/ant-design/issues/54734
    Object.defineProperty(obj, 'scrollTop', {
      get: () => listRef.current?.getScrollInfo().y || 0,

      set: (value: number) => {
        listRef.current?.scrollTo({
          top: value,
        });
      },
    });

    return obj;
  });

  // ======================= Col/Row Span =======================
  const getRowSpan = (column: ColumnType<any>, index: number): number => {
    const record = flattenData[index]?.record;
    const { onCell } = column;

    if (onCell) {
      const cellProps = onCell(record, index) as React.TdHTMLAttributes<HTMLElement>;
      return cellProps?.rowSpan ?? 1;
    }
    return 1;
  };

  const extraRender: ListProps<any>['extraRender'] = (info) => {
    const { start, end, getSize, offsetY } = info;

    // Do nothing if no data
    if (end < 0) {
      return null;
    }

    // Find first rowSpan column
    let firstRowSpanColumns = flattenColumns.filter(
      // rowSpan is 0
      (column) => getRowSpan(column, start) === 0,
    );

    let startIndex = start;
    for (let i = start; i >= 0; i -= 1) {
      firstRowSpanColumns = firstRowSpanColumns.filter((column) => getRowSpan(column, i) === 0);

      if (!firstRowSpanColumns.length) {
        startIndex = i;
        break;
      }
    }

    // Find last rowSpan column
    let lastRowSpanColumns = flattenColumns.filter(
      // rowSpan is not 1
      (column) => getRowSpan(column, end) !== 1,
    );

    let endIndex = end;
    for (let i = end; i < flattenData.length; i += 1) {
      lastRowSpanColumns = lastRowSpanColumns.filter((column) => getRowSpan(column, i) !== 1);

      if (!lastRowSpanColumns.length) {
        endIndex = Math.max(i - 1, end);
        break;
      }
    }

    // Collect the line who has rowSpan
    const spanLines: number[] = [];

    for (let i = startIndex; i <= endIndex; i += 1) {
      const item = flattenData[i];

      // This code will never reach, just incase
      if (!item) {
        continue;
      }

      if (flattenColumns.some((column) => getRowSpan(column, i) > 1)) {
        spanLines.push(i);
      }
    }

    // Patch extra line on the page
    const nodes = spanLines.map<React.ReactElement<any>>((index) => {
      const item = flattenData[index];

      const rowKey = getRowKey(item.record, index);

      const getHeight = (rowSpan: number) => {
        const endItemIndex = index + rowSpan - 1;
        const endItem = flattenData[endItemIndex];

        if (!endItem || !endItem.record) {
          // clamp 到当前可用的最后一行，或退化为默认高度
          const safeEndIndex = Math.min(endItemIndex, flattenData.length - 1);
          const safeEndItem = flattenData[safeEndIndex];

          const endItemKey = getRowKey(safeEndItem.record, safeEndIndex);
          const sizeInfo = getSize(rowKey, endItemKey);
          return sizeInfo.bottom - sizeInfo.top;
        }

        const endItemKey = getRowKey(endItem.record, endItemIndex);

        const sizeInfo = getSize(rowKey, endItemKey);
        return sizeInfo.bottom - sizeInfo.top;
      };

      const sizeInfo = getSize(rowKey);

      return (
        <BodyLine
          key={index}
          data={item}
          rowKey={rowKey}
          index={index}
          style={{
            top: -offsetY + sizeInfo.top,
          }}
          extra
          getHeight={getHeight}
        />
      );
    });

    return nodes;
  };

  // ========================= Context ==========================
  const gridContext = React.useMemo(() => ({ columnsOffset }), [columnsOffset]);

  // ========================== Render ==========================
  const tblPrefixCls = `${prefixCls}-tbody`;

  // default 'div' in rc-virtual-list
  const wrapperComponent = getComponent(['body', 'wrapper']);

  // ========================== Sticky Scroll Bar ==========================
  const horizontalScrollBarStyle: React.CSSProperties = {};
  if (sticky) {
    horizontalScrollBarStyle.position = 'sticky';
    horizontalScrollBarStyle.bottom = 0;
    if (typeof sticky === 'object' && sticky.offsetScroll) {
      horizontalScrollBarStyle.bottom = sticky.offsetScroll;
    }
  }

  return (
    <GridContext.Provider value={gridContext}>
      <VirtualList<FlattenData<any>>
        fullHeight={false}
        ref={listRef}
        prefixCls={`${tblPrefixCls}-virtual`}
        styles={{ horizontalScrollBar: horizontalScrollBarStyle }}
        className={tblPrefixCls}
        height={scrollY}
        itemHeight={listItemHeight || 24}
        data={flattenData}
        itemKey={(item) => getRowKey(item.record)}
        component={wrapperComponent}
        scrollWidth={scrollX as number}
        direction={direction}
        onVirtualScroll={({ x }) => {
          onScroll({
            currentTarget: listRef.current?.nativeElement,
            scrollLeft: x,
          });
        }}
        onScroll={onTablePropScroll}
        extraRender={extraRender}
      >
        {(item, index, itemProps) => {
          const rowKey = getRowKey(item.record, index);
          return <BodyLine data={item} rowKey={rowKey} index={index} style={itemProps.style} />;
        }}
      </VirtualList>
    </GridContext.Provider>
  );
});

const ResponseGrid = responseImmutable(Grid);

if (process.env.NODE_ENV !== 'production') {
  ResponseGrid.displayName = 'ResponseGrid';
}

export default ResponseGrid;
