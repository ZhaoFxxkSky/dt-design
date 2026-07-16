import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import MeasureCell from './MeasureCell';
import isVisible from 'rc-util/lib/Dom/isVisible';
import { useContext } from '../../../_util/context';
import TableContext from '../../shared/context/TableContext';
import type { ColumnType } from '../../interface';

export interface MeasureRowProps {
  prefixCls: string;
  onColumnResize: (key: React.Key, width: number) => void;
  columnsKey: React.Key[];
  columns: readonly ColumnType<any>[];
}

const MeasureRow: React.FC<MeasureRowProps> = ({
  prefixCls,
  columnsKey,
  onColumnResize,
  columns,
}) => {
  const ref = React.useRef<HTMLTableRowElement>(null);

  const { measureRowRender } = useContext(TableContext, ['measureRowRender']);

  const measureRow = (
    <tr
      className={`${prefixCls}-measure-row`}
      style={{ height: 0, visibility: 'hidden' }}
      ref={ref}
    >
      <ResizeObserver.Collection
        onBatchResize={(infoList) => {
          if (ref.current && isVisible(ref.current)) {
            infoList.forEach(({ data: columnKey, size }) => {
              onColumnResize(columnKey, size.offsetWidth);
            });
          }
        }}
      >
        {columnsKey.map((columnKey) => {
          const column = columns.find((col) => col.key === columnKey);
          const rawTitle = column?.title;
          // `title` can be a render function per `ColumnTitle`; `MeasureCell` only renders ReactNode
          const titleForMeasure = React.isValidElement<React.RefAttributes<any>>(rawTitle)
            ? React.cloneElement(rawTitle, { ref: null })
            : (rawTitle as React.ReactNode);
          return (
            <MeasureCell
              key={columnKey}
              columnKey={columnKey}
              onColumnResize={onColumnResize}
              title={titleForMeasure}
            />
          );
        })}
      </ResizeObserver.Collection>
    </tr>
  );

  return typeof measureRowRender === 'function' ? measureRowRender(measureRow) : measureRow;
};

export default MeasureRow;
