import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import classNames from 'classnames';
import React from 'react';
import FieldDisplay from '../../FieldDisplay';
import type { FieldDisplayRenderer } from '../../FieldDisplay/types';
import FieldEditor from '../../FieldEditor';
import type { FieldRenderer } from '../../FieldEditor/types';
import type { TableColumn } from '../types';
import { getEmptyValue, getFieldState } from '../utils';
import styles from '../style.less';

export type CellProps = {
  field: TableColumn;
  record: Record<string, any>;
  rowIndex: number;
  editable?: boolean;
  validateCell: (rowIndex: number, field: TableColumn, value: any, record?: Record<string, any>) => void;
  updateRowRef: React.MutableRefObject<(rowIndex: number, fieldKey: string, value: any) => void>;
  hasError: boolean;
  fieldRenderers?: Record<string, FieldRenderer>;
  displayRenderers?: Record<string, FieldDisplayRenderer>;
};

const Cell: React.FC<CellProps> = React.memo(
  ({
    field,
    record,
    rowIndex,
    editable = true,
    validateCell,
    updateRowRef,
    hasError,
    fieldRenderers,
    displayRenderers,
  }) => {
    const [focused, setFocused] = React.useState(false);
    const value = record[field.key];
    const state = getFieldState(record, field);
    const recordRef = React.useRef(record);
    recordRef.current = record;

    // 当联动规则要求清空且当前值非空时，自动清空
    React.useEffect(() => {
      if (!state.clearValue) return;
      if (state.hidden || state.disabled) {
        if (value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)) {
          updateRowRef.current(rowIndex, field.key, getEmptyValue(value));
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.clearValue, state.hidden, state.disabled, rowIndex, field.key, value]);

    // 当字段由必填变为非必填（隐藏/禁用）时，清除已有的校验错误
    React.useEffect(() => {
      if (!state.required && hasError) {
        validateCell(rowIndex, field, value, recordRef.current);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.required, hasError]);

    const handleChange = React.useCallback(
      (nextValue: any) => {
        if (state.required) {
          validateCell(rowIndex, field, nextValue, recordRef.current);
        }
        updateRowRef.current(rowIndex, field.key, nextValue);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [field, rowIndex, validateCell, state.required],
    );

    if (state.hidden) {
      return (
        <div className={styles.cellWrapper}>
          <span className={styles.emptyText}>-</span>
        </div>
      );
    }

    if (!editable) {
      return (
        <div className={styles.cellWrapper}>
          <FieldDisplay field={field} value={value} renderers={displayRenderers} />
        </div>
      );
    }

    return (
      <div
        className={styles.cellWrapper}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setFocused(false);
          }
        }}
      >
        <Popover
          getPopupContainer={() => document.body}
          content={
            <div className={styles.errorPopoverContent}>
              <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
              <span className={styles.errorPopoverText}>{`${field.name} 必填`}</span>
            </div>
          }
          trigger="focus"
          placement="topLeft"
          overlayClassName={styles.cellErrorOverlay}
          open={hasError && focused}
          destroyTooltipOnHide
        >
          <div className={classNames(styles.cellErrorTrigger, hasError && styles.cellError)}>
            <FieldEditor
              field={field}
              value={value}
              hasError={hasError}
              disabled={state.disabled || field.disabled}
              readOnly={field.readOnly}
              renderers={fieldRenderers}
              onChange={handleChange}
            />
          </div>
        </Popover>
      </div>
    );
  },
);

export default Cell;
