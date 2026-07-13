import { useContext } from '../../../_util/context';
import TableContext from '../../shared/context/TableContext';
import type { OnHover } from '../../features/hover/useHover';

/** Check if cell is in hover range */
function inHoverRange(cellStartRow: number, cellRowSpan: number, startRow: number, endRow: number) {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
}

export default function useHoverState(
  rowIndex: number,
  rowSpan: number,
): [hovering: boolean, onHover: OnHover] {
  return useContext(TableContext, ctx => {
    const hovering = inHoverRange(rowIndex, rowSpan || 1, ctx.hoverStartRow, ctx.hoverEndRow);

    return [hovering, ctx.onHover];
  });
}
