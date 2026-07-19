import warning from 'rc-util/lib/warning';
import { INTERNAL_COLUMN_DEFAULT_WIDTH } from '../../constant';
import type { ColumnType, ExpandableConfig, LegacyExpandableProps } from '../../interface';

export const INTERNAL_COL_DEFINE = 'RC_TABLE_INTERNAL_COL_DEFINE';

/** 读取内部注入列（选择列 / 展开列）的 columnType 标记 */
export function getInternalColumnType<RecordType>(
  column: ColumnType<RecordType>,
): string | undefined {
  return (column as Record<string, any>)?.[INTERNAL_COL_DEFINE]?.columnType;
}

/**
 * 是否为 "auto 宽度" 内部列：由内部功能注入（选择列 / 展开列）且未显式设置 width。
 * auto 列在虚拟模式下不参与弹性宽度分配，宽度由 CSS 类驱动并经测量管线同步。
 */
export function isAutoWidthColumn<RecordType>(column: ColumnType<RecordType>): boolean {
  const columnType = getInternalColumnType(column);
  return (
    columnType != null && columnType in INTERNAL_COLUMN_DEFAULT_WIDTH && column.width == null
  );
}

/** auto 内部列的首帧提示宽度（见 INTERNAL_COLUMN_DEFAULT_WIDTH） */
export function getAutoColumnHintWidth<RecordType>(column: ColumnType<RecordType>): number {
  const columnType = getInternalColumnType(column);
  return (columnType && INTERNAL_COLUMN_DEFAULT_WIDTH[columnType]) || 0;
}

export function getExpandableProps<RecordType>(
  props: LegacyExpandableProps<RecordType> & {
    expandable?: ExpandableConfig<RecordType>;
  },
): ExpandableConfig<RecordType> {
  const { expandable, ...legacyExpandableConfig } = props;
  let config: ExpandableConfig<RecordType>;

  if ('expandable' in props) {
    config = {
      ...legacyExpandableConfig,
      ...expandable,
    };
  } else {
    if (
      process.env.NODE_ENV !== 'production' &&
      [
        'indentSize',
        'expandedRowKeys',
        'defaultExpandedRowKeys',
        'defaultExpandAllRows',
        'expandedRowRender',
        'expandRowByClick',
        'expandIcon',
        'onExpand',
        'onExpandedRowsChange',
        'expandedRowClassName',
        'expandIconColumnIndex',
        'showExpandColumn',
        'title',
      ].some((prop) => prop in props)
    ) {
      warning(false, 'expanded related props have been moved into `expandable`.');
    }

    config = legacyExpandableConfig;
  }

  if (config.showExpandColumn === false) {
    config.expandIconColumnIndex = -1;
  }

  return config;
}
