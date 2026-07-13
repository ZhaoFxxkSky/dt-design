import type { AnyObject } from '../../../_util/type';
import type { ColumnType } from '../../interface';

export interface ColumnProps<RecordType = AnyObject> extends ColumnType<RecordType> {
  children?: null;
}

const Column = <RecordType extends AnyObject>(_: ColumnProps<RecordType>) => null;

export default Column;
