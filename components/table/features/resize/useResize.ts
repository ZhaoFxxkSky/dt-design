import * as React from 'react';
import type { ColumnsType, ColumnType, Key } from '../../interface';

export interface UseResizeOptions {
  columns: ColumnsType;
  /** 是否全局启用 resize */
  enabled?: boolean;
  /** 全局最小列宽 */
  defaultMinWidth?: number;
  /** 表格容器 ref（用于定位竖线） */
  containerRef?: React.RefObject<HTMLElement>;
  /** 列宽变化回调 */
  onColumnResize?: (key: Key, width: number) => void;
  /** 样式前缀，用于查找表格本体容器 */
  prefixCls: string;
}

/**
 * 表头拖拽改变列宽的 hook
 *
 * 核心交互策略（对齐 Element Plus table-layout）：
 *
 * **弹性列 vs 固定列**：
 * - 未被用户拖拽过的列 = "弹性列"，可吸收容器剩余空间
 * - 被用户拖拽过的列 = "固定列"，使用用户设定的宽度
 *
 * **remainder 分配规则（与 Element Plus 一致）**：
 * - 列宽之和 < 容器宽度时，差额（remainder）按各弹性列的 baseWidth 比例平分
 * - 第一个弹性列吸收舍入误差，确保 totalRender === containerWidth
 * - 随着列被逐个拖拽，弹性列逐渐减少，remainder 在剩余弹性列间重新平分
 * - 所有列都被拖拽过后，不分配 remainder（纯用户控制）
 *
 * **拖拽精度**：
 * - 使用 th.offsetWidth（实际渲染宽度）作为拖拽起点
 * - 用户拖 N px → 新宽度 = 渲染宽度 ± N px，松手后变固定列，视觉无跳变
 *
 * **其他特性**：
 * - 容器宽度测量滚动区域 clientWidth，自动排除垂直滚动条
 * - scrollX = 列宽总和，覆盖 scroll.x 避免 table-layout:fixed 下的浏览器重分配
 * - rAF + 直接 DOM 操作实现高性能拖拽
 */
function useResize({
  columns,
  enabled = false,
  defaultMinWidth = 60,
  containerRef,
  onColumnResize,
  prefixCls,
}: UseResizeOptions) {
  // 扁平化列（仅叶子列可以 resize）
  const flattenColumns = React.useMemo(() => {
    const result: ColumnType[] = [];
    function walk(cols: ColumnsType) {
      cols.forEach((col) => {
        const children = (col as any).children;
        if (children && children.length > 0) {
          walk(children);
        } else {
          result.push(col);
        }
      });
    }
    walk(columns);
    return result;
  }, [columns]);

  // 初始化列宽（从 column.width 读取）
  const [columnWidths, setColumnWidths] = React.useState<Map<Key, number>>(() => {
    const map = new Map<Key, number>();
    flattenColumns.forEach((col) => {
      const key = (col.key ?? col.dataIndex ?? '') as Key;
      if (col.width != null) {
        map.set(key, Number(col.width));
      }
    });
    return map;
  });

  // 记录用户拖拽过的列 key（被拖拽过的列变为"固定列"，不再吸收 remainder）
  const [resizedKeys, setResizedKeys] = React.useState<Set<Key>>(new Set());

  // 同步外部 columns 变化
  React.useEffect(() => {
    setColumnWidths((prev) => {
      const next = new Map(prev);
      flattenColumns.forEach((col) => {
        const key = (col.key ?? col.dataIndex ?? '') as Key;
        if (col.width != null && !next.has(key)) {
          next.set(key, Number(col.width));
        }
      });
      return next;
    });
  }, [flattenColumns]);

  // 拖拽状态：正在拖拽的列 key（使用 state 驱动渲染）
  const [resizingKey, setResizingKey] = React.useState<Key | null>(null);

  // 竖线 DOM ref（直接操作 DOM 避免频繁 state 更新）
  const lineRef = React.useRef<HTMLDivElement>(null);

  // 拖拽过程中的 ref（避免闭包陷阱）
  const dragRef = React.useRef<{
    key: Key;
    startX: number;
    startWidth: number;
    minWidth: number;
    maxWidth?: number;
    latestWidth: number;
    latestClientX: number;
    rafId: number | null;
  } | null>(null);

  // 获取列的可调整配置
  const getResizeConfig = React.useCallback(
    (col: ColumnType): { enabled: boolean; minWidth: number; maxWidth?: number } => {
      const colEnabled = col.resizable ?? enabled;
      return {
        enabled: colEnabled,
        minWidth: col.minWidth ?? defaultMinWidth,
        maxWidth: col.maxWidth,
      };
    },
    [enabled, defaultMinWidth],
  );

  // ========================= 容器宽度测量 =========================
  // 测量表格滚动区域的 clientWidth，自动排除垂直滚动条宽度。
  //
  // 优先级：
  //   1. .{prefixCls}-tbody   — 虚拟滚动模式（Grid 组件）
  //   2. .{prefixCls}-body    — fixHeader 模式，body 有 overflowY: scroll
  //   3. .{prefixCls}-content  — unique table 模式
  //   4. .{prefixCls}-container — 回退
  //
  // 使用 useLayoutEffect 在浏览器绘制前完成首次测量，避免初始化闪烁。
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const wrapper = containerRef?.current;
    if (!wrapper) return;

    // 查找滚动区域元素（优先级：tbody > body > content > container）
    const findScrollElement = (): HTMLElement | null => {
      // 虚拟滚动模式（Grid 组件使用 ${prefixCls}-tbody class）
      const tbody = wrapper.querySelector<HTMLElement>(`.${prefixCls}-tbody`);
      if (tbody) return tbody;
      // fixHeader 模式（body 有 overflowY: scroll，clientWidth 已排除滚动条）
      const body = wrapper.querySelector<HTMLElement>(`.${prefixCls}-body`);
      if (body) return body;
      // unique table 模式
      const content = wrapper.querySelector<HTMLElement>(`.${prefixCls}-content`);
      if (content) return content;
      // 回退到 container
      const container = wrapper.querySelector<HTMLElement>(`.${prefixCls}-container`);
      return container;
    };

    const measure = () => {
      const el = findScrollElement();
      if (el) {
        setContainerWidth(el.clientWidth);
      }
    };

    // 首次测量
    measure();

    // 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    // 观察 container（外层尺寸变化）
    const container = wrapper.querySelector<HTMLElement>(`.${prefixCls}-container`);
    if (container) {
      resizeObserver.observe(container);
    }

    // 也观察滚动区域（滚动条出现/消失时 clientWidth 会变化）
    const scrollEl = findScrollElement();
    if (scrollEl && scrollEl !== container) {
      resizeObserver.observe(scrollEl);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, prefixCls]);

  // ========================= 渲染宽度计算 =========================
  // renderWidths: 实际传给 colgroup 的宽度
  // scrollX: renderWidths 的总和，用于覆盖 scroll.x
  //
  // 策略（对齐 Element Plus updateColumnsWidth）：
  //   1. 收集所有列的 baseWidth，计算 totalWidth
  //   2. flexColumns = 未在 resizedKeys 中的列（弹性列）
  //   3. remainder = containerWidth - totalWidth
  //   4. remainder > 0 且有弹性列时，按 baseWidth 比例平分 remainder 给弹性列
  //      - 第一个弹性列吸收舍入误差，确保 totalRender === containerWidth
  //   5. remainder <= 0 或无弹性列时，使用 baseWidth（可能出现滚动条或留空）
  const { renderWidths, scrollX } = React.useMemo(() => {
    const map = new Map<Key, number>();

    // 1. 收集每列的基础宽度
    const entries: { key: Key; width: number; flex: boolean }[] = [];
    let totalWidth = 0;

    flattenColumns.forEach((col) => {
      const key = (col.key ?? col.dataIndex ?? '') as Key;
      const mapWidth = columnWidths.get(key);
      const baseWidth = mapWidth ?? (col.width ? Number(col.width) : 0);
      const flex = !resizedKeys.has(key) && baseWidth > 0;
      entries.push({ key, width: baseWidth, flex });
      totalWidth += baseWidth;
    });

    // 2. 收集弹性列
    const flexEntries = entries.filter((e) => e.flex);

    // 3. 计算剩余空间
    const remainder =
      containerWidth > 0 && flexEntries.length > 0 ? containerWidth - totalWidth : 0;

    // 4. 分配
    if (remainder > 0) {
      // 按 baseWidth 比例平分 remainder（与 Element Plus 一致）
      const flexTotal = flexEntries.reduce((sum, e) => sum + e.width, 0);
      const ratio = remainder / flexTotal;

      let assigned = 0;
      flexEntries.forEach((entry, index) => {
        if (index === 0) return; // 第一个弹性列最后计算，吸收舍入误差
        const flex = Math.floor(entry.width * ratio);
        assigned += flex;
        map.set(entry.key, entry.width + flex);
      });
      // 第一个弹性列 = remainder - 其他弹性列已分配的量
      const firstFlex = remainder - assigned;
      map.set(flexEntries[0].key, flexEntries[0].width + firstFlex);
    }

    // 非弹性列 + remainder <= 0 时的弹性列，使用 baseWidth
    let totalRender = 0;
    entries.forEach((entry) => {
      if (!map.has(entry.key)) {
        map.set(entry.key, entry.width);
      }
      totalRender += map.get(entry.key)!;
    });

    // scrollX: 当 containerWidth > 0 时使用 totalRender（列宽总和）
    //          当 containerWidth = 0（尚未测量）时返回 null，由 InternalTable 回退到用户 scroll.x
    const sx = containerWidth > 0 ? totalRender : null;

    return { renderWidths: map, scrollX: sx };
  }, [flattenColumns, columnWidths, containerWidth, resizedKeys]);

  // 更新竖线位置（直接操作 DOM，不触发 React 重渲染）
  // 竖线覆盖表格本体（.xxx-container），不覆盖分页等外部区域
  const updateLinePosition = React.useCallback(
    (clientX: number) => {
      const line = lineRef.current;
      const wrapper = containerRef?.current;
      if (!line || !wrapper) return;

      // 查找表格本体容器（排除分页、title、footer、spin 等区域）
      const tableContainer = wrapper.querySelector(`.${prefixCls}-container`);
      if (!tableContainer) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const tableRect = tableContainer.getBoundingClientRect();

      // 竖线的 top / height 基于表格本体相对于 wrapper 的偏移
      const topOffset = tableRect.top - wrapperRect.top;
      const tableHeight = tableRect.height;

      // 水平位置：竖线是 absolute 定位在 wrapper 内，直接用 clientX 减去 wrapper 左边界
      // wrapper 本身不滚动（滚动发生在 .ant-table-container 内部），所以不需要 scrollLeft
      let left = clientX - wrapperRect.left;

      // 限制在表格容器范围内
      const minLeft = tableRect.left - wrapperRect.left;
      const maxLeft = minLeft + tableRect.width;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      line.style.left = `${left}px`;
      line.style.top = `${topOffset}px`;
      line.style.height = `${tableHeight}px`;
      line.style.display = 'block';
    },
    [containerRef, prefixCls],
  );

  // 隐藏竖线
  const hideLine = React.useCallback(() => {
    if (lineRef.current) {
      lineRef.current.style.display = 'none';
    }
  }, []);

  // 开始拖拽
  // actualWidth 由 ResizeHandle 从 th.offsetWidth 测量后传入，确保与实际渲染宽度一致
  const onStartResize = React.useCallback(
    (e: React.MouseEvent, col: ColumnType, actualWidth?: number) => {
      const key = (col.key ?? col.dataIndex ?? '') as Key;
      const config = getResizeConfig(col);
      if (!config.enabled) return;

      e.preventDefault();
      e.stopPropagation();

      // 使用 DOM 测量的实际渲染宽度作为拖拽起点（包含 remainder）
      // 参考 Element Plus：columnWidth = finalLeft - startColumnLeft
      // 用户拖 3px → 新宽度 = 渲染宽度 - 3px，松手后变固定列，视觉无跳变
      const baseWidth = columnWidths.get(key) ?? (col.width ? Number(col.width) : 0);
      const currentWidth = actualWidth ?? baseWidth;

      dragRef.current = {
        key,
        startX: e.clientX,
        startWidth: currentWidth,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        latestWidth: currentWidth,
        latestClientX: e.clientX,
        rafId: null,
      };

      setResizingKey(key);

      // 立即显示竖线
      updateLinePosition(e.clientX);

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;

        // 始终存储最新的 clientX，rAF 回调中使用此值
        dragRef.current.latestClientX = ev.clientX;

        // 使用 rAF 节流：如果上一帧还没执行完，跳过本次调度
        if (dragRef.current.rafId != null) return;

        dragRef.current.rafId = requestAnimationFrame(() => {
          if (!dragRef.current) return;
          dragRef.current.rafId = null;

          // 使用最新存储的 clientX 计算，而非闭包中的 ev
          const delta = dragRef.current.latestClientX - dragRef.current.startX;
          let newWidth = dragRef.current.startWidth + delta;
          newWidth = Math.max(newWidth, dragRef.current.minWidth);
          if (dragRef.current.maxWidth != null) {
            newWidth = Math.min(newWidth, dragRef.current.maxWidth);
          }
          dragRef.current.latestWidth = newWidth;

          // 直接操作 DOM 更新竖线位置（不触发 React 重渲染）
          updateLinePosition(dragRef.current.latestClientX);
        });
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // 取消未执行的 rAF
        if (dragRef.current?.rafId != null) {
          cancelAnimationFrame(dragRef.current.rafId);
        }

        if (dragRef.current) {
          const { key: k, latestWidth } = dragRef.current;

          // 更新列宽 state
          setColumnWidths((prev) => {
            const next = new Map(prev);
            next.set(k, latestWidth);
            return next;
          });

          // 标记该列为已拖拽（变为固定列，不再吸收 remainder）
          setResizedKeys((prev) => {
            const next = new Set(prev);
            next.add(k);
            return next;
          });

          // 触发回调
          onColumnResize?.(k, latestWidth);

          // 触发列的 onResize 回调
          const col = flattenColumns.find((c) => ((c.key ?? c.dataIndex ?? '') as Key) === k);
          col?.onResize?.(latestWidth);
        }

        // 隐藏竖线
        hideLine();

        dragRef.current = null;
        setResizingKey(null);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [
      columnWidths,
      renderWidths,
      getResizeConfig,
      onColumnResize,
      flattenColumns,
      updateLinePosition,
      hideLine,
    ],
  );

  // 获取列的用户宽度（拖拽过程中不返回 draggingWidth，保持原宽度，松开后才更新）
  const getColumnWidth = React.useCallback(
    (col: ColumnType): number | undefined => {
      const key = (col.key ?? col.dataIndex ?? '') as Key;
      const mapWidth = columnWidths.get(key);
      if (mapWidth != null) return mapWidth;
      if (col.width != null) return Number(col.width);
      return undefined;
    },
    [columnWidths],
  );

  // 获取列的渲染宽度（= 用户宽度 + 剩余空间分配）
  const getColumnRenderWidth = React.useCallback(
    (col: ColumnType): number | undefined => {
      const key = (col.key ?? col.dataIndex ?? '') as Key;
      const renderWidth = renderWidths.get(key);
      if (renderWidth != null) return renderWidth;
      const mapWidth = columnWidths.get(key);
      if (mapWidth != null) return mapWidth;
      if (col.width != null) return Number(col.width);
      return undefined;
    },
    [renderWidths, columnWidths],
  );

  // 检查某列是否可调整
  const isColumnResizable = React.useCallback(
    (col: ColumnType): boolean => {
      return getResizeConfig(col).enabled;
    },
    [getResizeConfig],
  );

  // 重置列宽（同时清空 resizedKeys，恢复所有列为弹性列）
  const resetColumnWidths = React.useCallback(() => {
    setColumnWidths(new Map());
    setResizedKeys(new Set());
  }, []);

  return {
    resizingKey,
    lineRef,
    columnWidths,
    renderWidths,
    scrollX,
    getColumnWidth,
    getColumnRenderWidth,
    isColumnResizable,
    onStartResize,
    resetColumnWidths,
  };
}

export default useResize;
