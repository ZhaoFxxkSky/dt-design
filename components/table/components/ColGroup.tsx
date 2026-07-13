import * as React from 'react';
import type { ColumnType } from '../interface';
import { INTERNAL_COL_DEFINE } from '../shared/utils/legacyUtil';
import { useContext } from '../../_util/context';
import TableContext from '../shared/context/TableContext';

/** Column injected with internal col props by internal features (e.g. expandable, selection) */
type InternalColDefineColumn<RecordType> = ColumnType<RecordType> & {
  [INTERNAL_COL_DEFINE]?: Record<string, unknown>;
};

export interface ColGroupProps<RecordType> {
  colWidths: readonly (number | string)[];
  columns?: readonly ColumnType<RecordType>[];
  columCount?: number;
}

const ColGroup = <RecordType,>(props: ColGroupProps<RecordType>) => {
  const { colWidths, columns, columCount } = props;

  const { tableLayout } = useContext(TableContext, ['tableLayout']);

  const cols: React.ReactElement<any>[] = [];
  const len = columCount || columns?.length || 0;

  // Only insert col with width & additional props
  // Skip if rest col do not have any useful info
  let mustInsert = false;
  for (let i = len - 1; i >= 0; i -= 1) {
    const width = colWidths[i];
    const column = columns && columns[i];
    let additionalProps: Record<string, unknown> | undefined;
    let minWidth: number | undefined;
    if (column) {
      additionalProps = (column as InternalColDefineColumn<RecordType>)[INTERNAL_COL_DEFINE];

      // fixed will cause layout problems
      if (tableLayout === 'auto') {
        minWidth = column.minWidth;
      }
    }

    if (width || minWidth || additionalProps || mustInsert) {
      const { columnType, ...restAdditionalProps } = additionalProps || {};
      cols.unshift(<col key={i} style={{ width, minWidth }} {...restAdditionalProps} />);
      mustInsert = true;
    }
  }

  return cols.length > 0 ? <colgroup>{cols}</colgroup> : null;
};

export default ColGroup;
