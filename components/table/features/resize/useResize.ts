import * as React from 'react';
import type { ColumnsType, ColumnType, Key } from '../../interface';

export interface ResizeColumnConfig {
  /** 是否可拖拽调整列宽，默认 false */
  resizable?: boolean;
  /** 最小列宽 (px)，默认 60 */
  minWidth?: number;
  /** 最大列宽 (px) */
  maxWidth?: number;
}

export interface UseResizeOptions {
  columns: ColumnsType;
  /** 是否全局启用 resize */
  enabled?: boolean;
  /** 全局最小列宽 */
  defaultMinWidth?: number;
  /** 列宽变化回调 */
  onColumnResize?: (key: Key, width: number) => void;
  /** 拖拽完成回调 */
  onResizeEnd?: (widths: Map<Key, number>) => void;
}

/**
 * 表头拖拽改变列宽的 hook
 *
 * 特性：
 * - 鼠标悬停在列右边框时高亮（粗边框提示）
 * - 拖动时显示竖线指示器（不改变宽度）
 * - 松开鼠标后才改变实际列宽
 */
function useResize({
  columns,
  enabled = false,
  defaultMinWidth = 60,
  onColumnResize,
  onResizeEnd,
}: UseResizeOptions) {
  // 扁平化列（仅叶子列可以 resize）
  const flattenColumns = React.useMemo(() => {
    const result: ColumnType[] = [];
    function walk(cols: ColumnsType) {
      cols.forEach(col => {
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
    flattenColumns.forEach(col => {
      const key = col.key ?? col.dataIndex ?? '';
      if (col.width != null) {
        map.set(key, Number(col.width));
      }
    });
    return map;
  });

  // 同步外部 columns 变化
  React.useEffect(() => {
    setColumnWidths(prev => {
      const next = new Map(prev);
      flattenColumns.forEach(col => {
        const key = col.key ?? col.dataIndex ?? '';
        if (col.width != null && !next.has(key)) {
          next.set(key, Number(col.width));
        }
      });
      return next;
    });
  }, [flattenColumns]);

  // 拖拽状态：正在拖拽的列 key
  const [resizingKey, setResizingKey] = React.useState<Key | null>(null);
  // 拖拽时的实时宽度（仅用于竖线指示器位置）
  const [draggingWidth, setDraggingWidth] = React.useState<number | null>(null);

  // 拖拽过程中的 ref（避免闭包陷阱）
  const dragRef = React.useRef<{
    key: Key;
    startX: number;
    startWidth: number;
    minWidth: number;
    maxWidth?: number;
    latestWidth: number;
  } | null>(null);

  // 获取列的可调整配置
  const getResizeConfig = React.useCallback(
    (col: ColumnType): { enabled: boolean; minWidth: number; maxWidth?: number } => {
      const resizeCfg = (col as any).resize as ResizeColumnConfig | undefined;
      const colEnabled = resizeCfg?.resizable ?? enabled;
      return {
        enabled: colEnabled,
        minWidth: resizeCfg?.minWidth ?? defaultMinWidth,
        maxWidth: resizeCfg?.maxWidth,
      };
    },
    [enabled, defaultMinWidth],
  );

  // 开始拖拽
  const onStartResize = React.useCallback(
    (e: React.MouseEvent, col: ColumnType) => {
      const key = col.key ?? col.dataIndex ?? '';
      const config = getResizeConfig(col);
      if (!config.enabled) return;

      e.preventDefault();
      e.stopPropagation();

      const currentWidth = columnWidths.get(key) ?? (col.width ? Number(col.width) : 100);

      dragRef.current = {
        key,
        startX: e.clientX,
        startWidth: currentWidth,
        minWidth: config.minWidth,
        maxWidth: config.maxWidth,
        latestWidth: currentWidth,
      };

      setResizingKey(key);
      setDraggingWidth(currentWidth);

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const delta = ev.clientX - dragRef.current.startX;
        let newWidth = dragRef.current.startWidth + delta;
        newWidth = Math.max(newWidth, dragRef.current.minWidth);
        if (dragRef.current.maxWidth != null) {
          newWidth = Math.min(newWidth, dragRef.current.maxWidth);
        }
        dragRef.current.latestWidth = newWidth;
        setDraggingWidth(newWidth);
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        if (dragRef.current) {
          const { key: k, latestWidth } = dragRef.current;
          setColumnWidths(prev => {
            const next = new Map(prev);
            next.set(k, latestWidth);
            return next;
          });
          onColumnResize?.(k, latestWidth);
          onResizeEnd?.(new Map(columnWidths).set(k, latestWidth));
        }

        dragRef.current = null;
        setResizingKey(null);
        setDraggingWidth(null);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [columnWidths, getResizeConfig, onColumnResize, onResizeEnd],
  );

  // 获取列宽（优先用拖拽中的值，其次用 Map 中的值，最后用 column.width）
  const getColumnWidth = React.useCallback(
    (col: ColumnType): number | undefined => {
      const key = col.key ?? col.dataIndex ?? '';
      if (resizingKey === key && draggingWidth != null) {
        return draggingWidth;
      }
      const mapWidth = columnWidths.get(key);
      if (mapWidth != null) return mapWidth;
      if (col.width != null) return Number(col.width);
      return undefined;
    },
    [resizingKey, draggingWidth, columnWidths],
  );

  // 检查某列是否可调整
  const isColumnResizable = React.useCallback(
    (col: ColumnType): boolean => {
      return getResizeConfig(col).enabled;
    },
    [getResizeConfig],
  );

  // 重置列宽
  const resetColumnWidths = React.useCallback(() => {
    setColumnWidths(new Map());
  }, []);

  return {
    resizingKey,
    draggingWidth,
    columnWidths,
    getColumnWidth,
    isColumnResizable,
    onStartResize,
    resetColumnWidths,
  };
}

export default useResize;
