import type * as React from 'react';
import useLayoutEffect from '../../../_util/hooks/useLayoutEffect';
import type { ColumnType } from '../../interface';
import { isAutoWidthColumn } from '../../shared/utils/legacyUtil';
import { getColumnsKey } from '../../shared/utils/valueUtil';

/**
 * 虚拟模式下 auto 内部列（rowSelection / expand 未显式设宽）的宽度测量。
 *
 * 这些列的表头 `<col>` 不写内联宽度，列宽完全由 CSS 类决定（LESS 变量、
 * modifyVars、用户自定义覆盖均可生效）。此处测量表头单元格的真实渲染宽度
 * （th.offsetWidth，表头为 table-layout: fixed，th 跟随 col），并写入
 * onColumnResize 管线，驱动 body 网格列宽、固定列偏移与弹性分配。
 *
 * ResizeObserver 持续监听：运行时主题切换 / CSS 变化会自动跟随。
 * 测量结果为 0 时（jsdom、表格隐藏）不写回，保留首帧提示值。
 */
export default function useAutoColumnMeasure<RecordType>(
  enabled: boolean,
  flattenColumns: readonly ColumnType<RecordType>[],
  headerRef: React.RefObject<HTMLDivElement | null>,
  onColumnResize: (key: React.Key, width: number) => void,
  /** showHeader=false 时无表头可测，改用隐藏探针（承载同样的 CSS 类宽度） */
  probeRef?: React.RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const headerEle = headerRef.current ?? probeRef?.current ?? null;
    if (!headerEle) {
      return;
    }

    const columnsKey = getColumnsKey(flattenColumns);
    const measureTargets: { th: HTMLElement; key: React.Key }[] = [];

    flattenColumns.forEach((col, index) => {
      if (!isAutoWidthColumn(col)) {
        return;
      }

      // 内部列的 column.className 会打在表头 th 上（Header.tsx），取首个 class 定位
      const className = (col.className || '').split(' ')[0];
      if (!className) {
        return;
      }
      const th = headerEle.querySelector<HTMLElement>(`th.${className}`);
      if (!th) {
        return;
      }

      measureTargets.push({ th, key: columnsKey[index] });
    });

    if (!measureTargets.length) {
      return;
    }

    const measure = () => {
      measureTargets.forEach(({ th, key }) => {
        const width = th.offsetWidth;
        if (width > 0) {
          onColumnResize(key, width);
        }
      });
    };
    measure();

    const observer = new ResizeObserver(measure);
    measureTargets.forEach(({ th }) => observer.observe(th));

    return () => {
      observer.disconnect();
    };
  }, [enabled, flattenColumns, headerRef, probeRef, onColumnResize]);
}
