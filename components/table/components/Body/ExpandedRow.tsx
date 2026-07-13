import { useContext } from '../../../_util/context';
import * as React from 'react';
import Cell from '../Cell';
import TableContext from '../../shared/context/TableContext';
import devRenderTimes from '../../shared/hooks/useRenderTimes';
import type { CustomizeComponent } from '../../interface';

export interface ExpandedRowProps {
  prefixCls: string;
  component: CustomizeComponent;
  cellComponent: CustomizeComponent;
  className: string;
  expanded: boolean;
  children: React.ReactNode;
  colSpan: number;
  isEmpty: boolean;
  stickyOffset?: number;
}

const ExpandedRow: React.FC<ExpandedRowProps> = props => {
  if (process.env.NODE_ENV !== 'production') {
    devRenderTimes(props);
  }

  const {
    prefixCls,
    children,
    component: Component,
    cellComponent,
    className,
    expanded,
    colSpan,
    isEmpty,
    stickyOffset = 0,
  } = props;

  const { scrollbarSize, fixHeader, fixColumn, componentWidth, horizonScroll } = useContext(
    TableContext,
    ['scrollbarSize', 'fixHeader', 'fixColumn', 'componentWidth', 'horizonScroll'],
  );

  // Cache render node
  let contentNode = children;

  if (isEmpty ? horizonScroll && componentWidth : fixColumn) {
    contentNode = (
      <div
        style={{
          width: componentWidth - stickyOffset - (fixHeader && !isEmpty ? scrollbarSize : 0),
          position: 'sticky',
          left: stickyOffset,
          overflow: 'hidden',
        }}
        className={`${prefixCls}-expanded-row-fixed`}
      >
        {contentNode}
      </div>
    );
  }

  return (
    <Component className={className} style={{ display: expanded ? undefined : 'none' }}>
      <Cell component={cellComponent} prefixCls={prefixCls} colSpan={colSpan}>
        {contentNode}
      </Cell>
    </Component>
  );
};

export default ExpandedRow;
