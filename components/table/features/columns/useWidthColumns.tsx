import * as React from 'react';
import { VIRTUAL_MISSING_WIDTH_COLUMN_MIN } from '../../constant';
import type { ColumnsType, Key } from '../../interface';
import { getAutoColumnHintWidth, isAutoWidthColumn } from '../../shared/utils/legacyUtil';
import { getColumnsKey } from '../../shared/utils/valueUtil';

function parseColWidth(totalWidth: number, width: string | number = '') {
  if (typeof width === 'number') {
    return width;
  }

  if (width.endsWith('%')) {
    return (totalWidth * Number.parseFloat(width)) / 100;
  }
  return null;
}

/**
 * Fill all column with width
 *
 * auto 内部列（rowSelection / expand 未显式设宽）不参与弹性分配：
 * 宽度保持 undefined（虚拟模式下由 CSS 类驱动 + 测量管线接管），
 * 仅以 测量值 / 首帧提示值 计入总宽，保证其余列分配时为其留出空间。
 */
export default function useWidthColumns(
  flattenColumns: ColumnsType<any>,
  scrollWidth: number,
  clientWidth: number,
  measuredWidths?: ReadonlyMap<Key, number>,
) {
  return React.useMemo<[columns: ColumnsType<any>, realScrollWidth: number]>(() => {
    // Fill width if needed
    if (scrollWidth && scrollWidth > 0) {
      const columnsKey = getColumnsKey(flattenColumns);

      // auto 列的已知宽度（测量值优先，回退首帧提示值）；非 auto 列返回 null
      const getAutoWidth = (col: any, index: number): number | null => {
        if (!isAutoWidthColumn(col)) {
          return null;
        }
        return measuredWidths?.get(columnsKey[index]) || getAutoColumnHintWidth(col);
      };

      let totalWidth = 0;
      let autoTotal = 0;
      let missWidthCount = 0;

      // collect not given width column
      flattenColumns.forEach((col: any, index: number) => {
        const autoWidth = getAutoWidth(col, index);
        if (autoWidth != null) {
          autoTotal += autoWidth;
          return;
        }

        const colWidth = parseColWidth(scrollWidth, col.width);

        if (colWidth) {
          totalWidth += colWidth;
        } else {
          missWidthCount += 1;
        }
      });

      // Fill width
      const maxFitWidth = Math.max(scrollWidth, clientWidth);
      // 非 auto 列的可用空间：为 auto 列预留宽度
      const availWidth = maxFitWidth - autoTotal;
      // 无宽列填充下限：空间不足时每列保底 60（antd 原生会压到 1px，不可用）
      let restWidth = Math.max(
        availWidth - totalWidth,
        missWidthCount * VIRTUAL_MISSING_WIDTH_COLUMN_MIN,
      );
      let restCount = missWidthCount;
      const avgWidth = restWidth / missWidthCount;

      let realTotal = 0;

      const filledColumns = flattenColumns.map((col: any, index: number) => {
        const clone = {
          ...col,
        };

        if (getAutoWidth(col, index) != null) {
          // auto 列保持 width undefined，不参与填充
          return clone;
        }

        const colWidth = parseColWidth(scrollWidth, clone.width);

        if (colWidth) {
          clone.width = colWidth;
        } else {
          const colAvgWidth = Math.floor(avgWidth);

          // 列上显式 minWidth 优先于平均填充值
          clone.width = Math.max(
            restCount === 1 ? restWidth : colAvgWidth,
            (clone.minWidth as number) || 0,
          );

          restWidth -= colAvgWidth;
          restCount -= 1;
        }

        realTotal += clone.width;

        return clone;
      });

      // antd 原生 scale-up：列宽总和小于可用空间时，等比放大撑满（只增不减）。
      // 仅放大非 auto 列，目标为 availWidth（已为 auto 列预留空间）；
      // 最后一个非 auto 列吸收舍入误差（auto 列可能是最后一列，且其 width
      // 为 undefined，Math.floor(undefined * scale) = NaN，必须跳过）
      if (realTotal > 0 && realTotal < availWidth) {
        const scale = availWidth / realTotal;

        restWidth = availWidth;

        let lastFillIndex = -1;
        filledColumns.forEach((col: any, index: number) => {
          if (getAutoWidth(col, index) == null) {
            lastFillIndex = index;
          }
        });

        filledColumns.forEach((col: any, index: number) => {
          if (getAutoWidth(col, index) != null) {
            return;
          }

          const colWidth = Math.floor(col.width * scale);

          col.width = index === lastFillIndex ? restWidth : colWidth;

          restWidth -= colWidth;
        });

        realTotal = availWidth;
      }

      return [filledColumns, realTotal + autoTotal];
    }

    return [flattenColumns, scrollWidth];
  }, [flattenColumns, scrollWidth, clientWidth, measuredWidths]);
}
