import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import useLayoutEffect from '../../../_util/hooks/useLayoutEffect';

export interface MeasureCellProps {
  columnKey: React.Key;
  onColumnResize: (key: React.Key, width: number) => void;
  title?: React.ReactNode;
}

const MeasureCell: React.FC<MeasureCellProps> = (props) => {
  const { columnKey, onColumnResize, title } = props;

  const cellRef = React.useRef<HTMLTableCellElement>(null);

  useLayoutEffect(() => {
    if (cellRef.current) {
      onColumnResize(columnKey, cellRef.current.offsetWidth);
    }
  }, [columnKey, onColumnResize]);

  return (
    <ResizeObserver data={columnKey}>
      <td
        ref={cellRef}
        style={{ paddingTop: 0, paddingBottom: 0, borderTop: 0, borderBottom: 0, height: 0 }}
      >
        <div style={{ height: 0, overflow: 'hidden', fontWeight: 'bold' }}>{title || '\xA0'}</div>
      </td>
    </ResizeObserver>
  );
};

export default MeasureCell;
