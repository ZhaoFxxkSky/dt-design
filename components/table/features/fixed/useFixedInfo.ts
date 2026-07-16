import isEqual from 'rc-util/lib/isEqual';
import useMemo from 'rc-util/lib/hooks/useMemo';
import type { ColumnType, StickyOffsets } from '../../interface';
import { getCellFixedInfo } from './fixUtil';
import * as React from 'react';

export default function useFixedInfo<RecordType>(
  flattenColumns: readonly ColumnType<RecordType>[],
  stickyOffsets: StickyOffsets,
) {
  const fixedInfoList = React.useMemo(
    () =>
      flattenColumns.map((_, colIndex) =>
        getCellFixedInfo(colIndex, colIndex, flattenColumns, stickyOffsets),
      ),
    [flattenColumns, stickyOffsets],
  );

  return useMemo(
    () => fixedInfoList,
    [fixedInfoList],
    (prev, next) => !isEqual(prev, next),
  );
}
