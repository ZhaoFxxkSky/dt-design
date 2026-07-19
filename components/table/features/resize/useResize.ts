import * as React from 'react';
import type { ColumnsType, ColumnType, Direction, Key } from '../../interface';

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
  /**
   * 内部功能列（rowSelection / expand）占据的固定宽度。
   * 这些列无 key/dataIndex，不参与宽度分配与拖拽，但占据表格宽度；
   * 计入总宽可避免 scrollX 覆盖 scroll.x 后内容比预期宽出内部列宽。
   */
  extraFixedWidth?: number;
  /** 文本方向：RTL 下手柄在列左缘，拖拽 delta 取反 */
  direction?: Direction;
}

/**
 * 获取列宽追踪用的列标识。
 * 无 key 且无 dataIndex 的列（如 selection / expand 等功能列）不可标识，返回 null：
 * 不注入拖拽手柄，也不进入 widths Map，避免多列共用 '' 键互相覆盖。
 */
function getColumnKey(col: ColumnType): Key | null {
  const key = col.key ?? col.dataIndex;
  return key != null ? (key as Key) : null;
}

/**
 * 表头拖拽改变列宽的 hook
 *
 * 核心交互策略：
 *
 * **初始弹性分配**（显式 width 列只增不减）：
 * - 显式设了 width 的列：宽度是下限，绝不收缩；容器有富余且没有无宽列时，
 *   所有未冻结列等比放大撑满容器（对齐 antd useWidthColumns 的 scale-up）
 * - 未设 width 的列为"弹性列"（基础宽 defaultMinWidth）：富余优先膨胀给它，
 *   容器不足时先收缩它（下限各自的 minWidth），显式列不动
 * - 收缩到底仍超出容器时出现横向滚动条
 *
 * **拖拽冻结**：
 * - 松手时，将所有列的 baseWidth 冻结为当前渲染宽度，并全部标记为固定列
 * - 这样松手后 remainder ≈ 0，不会触发 flex 重分配
 * - 列边界精确停留在鼠标位置（跟手）
 * - 总宽 = 渲染宽度之和，可能 ≠ containerWidth（出现滚动条或空白）
 * - 用户可调用 resetColumnWidths 恢复无宽列为弹性列
 *
 * **拖拽精度**：
 * - 使用 th.offsetWidth（实际渲染宽度）作为拖拽起点
 * - 用户拖 N px → 新宽度 = 渲染宽度 ± N px，松手后冻结，视觉无跳变
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
  extraFixedWidth = 0,
  direction = 'ltr',
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
      const key = getColumnKey(col);
      if (key == null) return;
      if (col.width != null) {
        const w = Number(col.width);
        if (!Number.isNaN(w)) map.set(key, w);
      }
    });
    return map;
  });

  // 记录用户拖拽过的列 key（被拖拽过的列变为"固定列"，不再吸收 remainder）
  const [resizedKeys, setResizedKeys] = React.useState<Set<Key>>(() => new Set());

  // 同步外部 columns 变化
  React.useEffect(() => {
    setColumnWidths((prev) => {
      const next = new Map(prev);
      flattenColumns.forEach((col) => {
        const key = getColumnKey(col);
        if (key == null) return;
        if (col.width != null && !next.has(key)) {
          const w = Number(col.width);
          if (!Number.isNaN(w)) next.set(key, w);
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

  // 存储当前拖拽的事件监听器清理函数
  // 用于：1) 组件卸载时清理泄漏的监听器  2) 重复 mousedown 时清理旧拖拽
  const cleanupDragListenersRef = React.useRef<(() => void) | null>(null);

  // columnWidths / flattenColumns / onColumnResize 的 ref 镜像
  // 用于稳定 onStartResize 引用，避免每次拖拽松手后 transformColumns 链重跑
  const columnWidthsRef = React.useRef(columnWidths);
  columnWidthsRef.current = columnWidths;
  const flattenColumnsRef = React.useRef(flattenColumns);
  flattenColumnsRef.current = flattenColumns;
  const onColumnResizeRef = React.useRef(onColumnResize);
  onColumnResizeRef.current = onColumnResize;
  // renderWidthsRef 在 renderWidths memo 之后初始化
  const renderWidthsRef = React.useRef<Map<Key, number>>(new Map());

  // 获取列的可调整配置
  const getResizeConfig = React.useCallback(
    (col: ColumnType): { enabled: boolean; minWidth: number; maxWidth?: number } => {
      // 不可标识的列（无 key/dataIndex，如 selection / expand 列）不可调整
      const colEnabled = (col.resizable ?? enabled) && getColumnKey(col) != null;
      return {
        enabled: colEnabled,
        minWidth: col.minWidth ?? defaultMinWidth,
        maxWidth: col.maxWidth,
      };
    },
    [enabled, defaultMinWidth],
  );

  // ========================= 滚动区域查找 =========================
  // 查找表格滚动区域元素，用于容器宽度测量和竖线定位。
  //
  // 优先级：
  //   1. .{prefixCls}-tbody   — 虚拟滚动模式（Grid 组件）
  //   2. .{prefixCls}-body    — fixHeader 模式，body 有 overflowY: scroll
  //   3. .{prefixCls}-content  — unique table 模式
  //   4. .{prefixCls}-container — 回退
  const findScrollElement = React.useCallback(
    (wrapper: HTMLElement): HTMLElement | null => {
      const tbody = wrapper.querySelector<HTMLElement>(`.${prefixCls}-tbody`);
      if (tbody) return tbody;
      const body = wrapper.querySelector<HTMLElement>(`.${prefixCls}-body`);
      if (body) return body;
      const content = wrapper.querySelector<HTMLElement>(`.${prefixCls}-content`);
      if (content) return content;
      return wrapper.querySelector<HTMLElement>(`.${prefixCls}-container`);
    },
    [prefixCls],
  );

  // ========================= 容器宽度测量 =========================
  // 测量表格滚动区域的 clientWidth，自动排除垂直滚动条宽度。
  // 使用 useLayoutEffect 在浏览器绘制前完成首次测量，避免初始化闪烁。
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const wrapper = containerRef?.current;
    if (!wrapper) return;

    const measure = () => {
      const el = findScrollElement(wrapper);
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
    const scrollEl = findScrollElement(wrapper);
    if (scrollEl && scrollEl !== container) {
      resizeObserver.observe(scrollEl);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, findScrollElement]);

  // ========================= 渲染宽度计算 =========================
  // renderWidths: 实际传给 colgroup 的宽度
  // scrollX: renderWidths 的总和，用于覆盖 scroll.x
  //
  // 策略（显式 width 列只增不减，对齐 antd useWidthColumns）：
  //   1. 收集所有列的 baseWidth，计算 totalWidth（含内部功能列固定宽）
  //   2. flexColumns = 未显式设 width 且未在 resizedKeys 中的列（弹性列）
  //   3. remainder = containerWidth - totalWidth
  //   4. remainder > 0（膨胀）：富余优先按 baseWidth 比例分配给弹性列；
  //      无弹性列（全是显式 width 列）时等比放大所有未冻结列撑满容器
  //   5. remainder < 0（收缩）：只从弹性列扣除，下限各自的 minWidth；
  //      显式 width 列不缩，扣完仍超出则出现横向滚动条
  //   6. remainder = 0 时，使用 baseWidth
  const { renderWidths, scrollX } = React.useMemo(() => {
    const map = new Map<Key, number>();

    // 1. 收集每列的基础宽度（totalWidth 含内部功能列固定宽，确保弹性分配为其预留空间）
    const entries: { key: Key; width: number; flex: boolean; minWidth: number }[] = [];
    let totalWidth = extraFixedWidth;

    flattenColumns.forEach((col) => {
      const key = getColumnKey(col);
      // 不可标识的列不参与宽度分配，保留自身 width / 自然宽度
      if (key == null) return;
      const mapWidth = columnWidths.get(key);
      // Guard against NaN: non-numeric string widths are treated as missing
      const rawW = col.width != null ? Number(col.width) : 0;
      const hasExplicitWidth = !Number.isNaN(rawW) && rawW > 0;
      // 未设 width 且未被拖拽冻结的列：以 minWidth（若有，否则 defaultMinWidth）为
      // 基础宽度参与弹性分配，避免渲染宽度被覆盖为 0 而塌陷为 0~1px
      const baseWidth = mapWidth ?? (hasExplicitWidth ? rawW : Math.max(defaultMinWidth, col.minWidth ?? 0));
      // 弹性列 = 未显式设 width 且未被拖拽冻结的列；
      // 显式 width 列只增不减（膨胀时等比放大，收缩时不动）
      const flex = !resizedKeys.has(key) && !hasExplicitWidth;
      entries.push({ key, width: baseWidth, flex, minWidth: col.minWidth ?? defaultMinWidth });
      totalWidth += baseWidth;
    });

    // 2. 收集弹性列（无宽列，膨胀/收缩都优先作用于它们）
    const flexEntries = entries.filter((e) => e.flex);

    // 3. 计算剩余空间
    const remainder = containerWidth > 0 ? containerWidth - totalWidth : 0;

    // 4. 分配
    if (remainder > 0) {
      // 膨胀：富余优先给弹性列；全是显式 width 列时，等比放大所有未冻结列
      // 撑满容器（对齐 antd useWidthColumns 的 scale-up：显式列只增不减）。
      // 冻结列（已拖拽）不参与，保证松手后的布局不漂移。
      const growEntries =
        flexEntries.length > 0 ? flexEntries : entries.filter((e) => !resizedKeys.has(e.key));
      const growTotal = growEntries.reduce((sum, e) => sum + e.width, 0);

      if (growEntries.length > 0 && growTotal > 0) {
        const ratio = remainder / growTotal;
        let assigned = 0;
        growEntries.forEach((entry, index) => {
          if (index === 0) return; // 第一个列最后计算，吸收舍入误差
          const grow = Math.floor(entry.width * ratio);
          assigned += grow;
          map.set(entry.key, entry.width + grow);
        });
        map.set(growEntries[0].key, growEntries[0].width + (remainder - assigned));
      }
    } else if (remainder < 0 && flexEntries.length > 0) {
      // 收缩：只从无宽弹性列扣除，下限各自的 minWidth（显式 width 列一像素不动）
      const deficit = -remainder; // 需要扣除的总量
      const flexTotal = flexEntries.reduce((sum, e) => sum + e.width, 0);
      const ratio = deficit / flexTotal;

      // 先计算每列的扣除量，确保不低于 minWidth
      let actualDeducted = 0;
      const deductions = flexEntries.map((entry, index) => {
        if (index === 0) return 0; // 第一个弹性列最后计算
        const maxDeduct = Math.max(0, entry.width - entry.minWidth);
        const deduct = Math.min(Math.floor(entry.width * ratio), maxDeduct);
        actualDeducted += deduct;
        return deduct;
      });

      // 第一个弹性列扣除剩余量，但不低于 minWidth
      const firstDeduct = Math.min(
        deficit - actualDeducted,
        Math.max(0, flexEntries[0].width - flexEntries[0].minWidth),
      );
      deductions[0] = firstDeduct;

      // 应用扣除
      flexEntries.forEach((entry, index) => {
        map.set(entry.key, entry.width - deductions[index]);
      });

      // 弹性列全部到 minWidth 仍不够扣除：totalRender > containerWidth，
      // 出现横向滚动条（显式 width 列依然不缩）
    }

    // 非弹性列 + remainder = 0 时的弹性列，使用 baseWidth
    // totalRender 含内部功能列固定宽（extraFixedWidth）
    let totalRender = extraFixedWidth;
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
  }, [flattenColumns, columnWidths, containerWidth, resizedKeys, defaultMinWidth, extraFixedWidth]);

  // 同步 renderWidths 到 ref（供 onUp 中读取当前渲染宽度）
  renderWidthsRef.current = renderWidths;

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

      // 查找滚动区域元素（与 containerWidth 测量使用相同的优先级）
      // 使用 scrollEl.clientWidth 计算右边界，自动排除垂直滚动条宽度
      const scrollEl = findScrollElement(wrapper);
      if (!scrollEl) return;
      const wrapperRect = wrapper.getBoundingClientRect();
      const tableRect = tableContainer.getBoundingClientRect();
      const scrollRect = scrollEl.getBoundingClientRect();

      // 竖线的 top / height 基于表格本体相对于 wrapper 的偏移
      const topOffset = tableRect.top - wrapperRect.top;
      const tableHeight = tableRect.height;

      // 水平位置：竖线是 absolute 定位在 wrapper 内，直接用 clientX 减去 wrapper 左边界
      // wrapper 本身不滚动（滚动发生在 .ant-table-container 内部），所以不需要 scrollLeft
      let left = clientX - wrapperRect.left;

      // 限制在滚动区域范围内（使用 scrollEl.clientWidth 排除垂直滚动条）
      const minLeft = scrollRect.left - wrapperRect.left;
      const maxLeft = minLeft + scrollEl.clientWidth;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      line.style.left = `${left}px`;
      line.style.top = `${topOffset}px`;
      line.style.height = `${tableHeight}px`;
      line.style.display = 'block';
    },
    [containerRef, findScrollElement, prefixCls],
  );

  // 隐藏竖线
  const hideLine = React.useCallback(() => {
    if (lineRef.current) {
      lineRef.current.style.display = 'none';
    }
  }, []);

  // 组件卸载时清理残留的拖拽监听器，防止内存泄漏
  React.useEffect(() => {
    return () => {
      cleanupDragListenersRef.current?.();
      cleanupDragListenersRef.current = null;
      if (dragRef.current?.rafId != null) {
        cancelAnimationFrame(dragRef.current.rafId);
      }
      dragRef.current = null;
    };
  }, []);

  // 开始拖拽
  // actualWidth 由 ResizeHandle 从 th.offsetWidth 测量后传入，确保与实际渲染宽度一致
  const onStartResize = React.useCallback(
    (e: React.MouseEvent, col: ColumnType, actualWidth?: number) => {
      const key = getColumnKey(col);
      const config = getResizeConfig(col);
      if (key == null || !config.enabled) return;

      e.preventDefault();
      e.stopPropagation();

      // 如果有正在进行的拖拽，先清理旧的事件监听器（防止重复 mousedown 导致监听器堆积）
      cleanupDragListenersRef.current?.();
      cleanupDragListenersRef.current = null;

      // 使用 DOM 测量的实际渲染宽度作为拖拽起点（包含 remainder）
      // 参考 Element Plus：columnWidth = finalLeft - startColumnLeft
      // 用户拖 3px → 新宽度 = 渲染宽度 - 3px，松手后变固定列，视觉无跳变
      // Guard against NaN: if col.width is a non-numeric string (e.g. 'auto'),
      // Number(col.width) returns NaN, which would corrupt the drag math.
      const rawWidth = col.width != null ? Number(col.width) : 0;
      const baseWidth = columnWidthsRef.current.get(key) ?? (Number.isNaN(rawWidth) ? 0 : rawWidth);
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

          // 使用最新存储的 clientX 计算，而非闭包中的 ev。
          // RTL 下手柄在列左缘：向左拖（delta 为负）变宽，delta 取反
          const rawDelta = dragRef.current.latestClientX - dragRef.current.startX;
          const delta = direction === 'rtl' ? -rawDelta : rawDelta;
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
        cleanupDragListenersRef.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        // 取消未执行的 rAF
        if (dragRef.current?.rafId != null) {
          cancelAnimationFrame(dragRef.current.rafId);
        }

        if (dragRef.current) {
          const { key: k, latestWidth } = dragRef.current;

          // 核心修复：冻结所有列的 baseWidth 为当前渲染宽度
          // 这样松手后 renderWidths 重算时，baseWidth === renderedWidth，
          // remainder ≈ 0，不会触发 flex 重分配，列边界精确停留在鼠标位置。
          // 同时将所有列标记为固定列（不再参与 flex 分配）。
          const currentRendered = renderWidthsRef.current;
          setColumnWidths((prev) => {
            const next = new Map(prev);
            // 冻结所有列的 baseWidth 为当前渲染宽度
            currentRendered.forEach((w, key) => {
              // 不冻结 0 / NaN：未分配到渲染宽度的列保持弹性，避免塌陷宽度被永久化
              if (w > 0 && !Number.isNaN(w)) next.set(key, w);
            });
            // 被拖拽的列使用用户拖拽的最终宽度
            next.set(k, latestWidth);
            return next;
          });

          // 将所有列标记为固定列（不再参与 flex 分配）
          setResizedKeys((prev) => {
            const next = new Set(prev);
            flattenColumnsRef.current.forEach((col) => {
              const key = getColumnKey(col);
              if (key != null) next.add(key);
            });
            return next;
          });

          // 触发回调
          onColumnResizeRef.current?.(k, latestWidth);

          // 触发列的 onResize 回调
          const col = flattenColumnsRef.current.find((c) => getColumnKey(c) === k);
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

      // 存储清理函数，用于组件卸载或重复 mousedown 时清理
      cleanupDragListenersRef.current = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
    },
    [getResizeConfig, updateLinePosition, hideLine, direction],
  );

  // 获取列的渲染宽度（= 用户宽度 + 剩余空间分配）
  const getColumnRenderWidth = React.useCallback(
    (col: ColumnType): number | undefined => {
      const key = getColumnKey(col);
      // 不可标识的列不注入覆盖宽度
      if (key == null) return undefined;
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

  // 键盘调整列宽（不走 MouseEvent 路径，直接更新 state）
  const setColumnWidth = React.useCallback(
    (col: ColumnType, newWidth: number) => {
      const key = getColumnKey(col);
      const config = getResizeConfig(col);
      if (key == null || !config.enabled) return;

      // clamp 到 minWidth / maxWidth
      newWidth = Math.max(newWidth, config.minWidth);
      if (config.maxWidth != null) {
        newWidth = Math.min(newWidth, config.maxWidth);
      }

      // 冻结所有列的 baseWidth 为当前渲染宽度，标记为固定列
      const currentRendered = renderWidthsRef.current;
      setColumnWidths((prev) => {
        const next = new Map(prev);
        currentRendered.forEach((w, k) => {
          // 不冻结 0 / NaN：未分配到渲染宽度的列保持弹性，避免塌陷宽度被永久化
          if (w > 0 && !Number.isNaN(w)) next.set(k, w);
        });
        next.set(key, newWidth);
        return next;
      });

      setResizedKeys((prev) => {
        const next = new Set(prev);
        flattenColumnsRef.current.forEach((c) => {
          const k = getColumnKey(c);
          if (k != null) next.add(k);
        });
        return next;
      });

      onColumnResizeRef.current?.(key, newWidth);
      col.onResize?.(newWidth);
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
    renderWidths,
    scrollX,
    getColumnRenderWidth,
    isColumnResizable,
    onStartResize,
    setColumnWidth,
    resetColumnWidths,
  };
}

export default useResize;
