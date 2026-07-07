import React from 'react';
import type { TableColumn, VirtualTableValidateResult } from '../types';
import { cellErrorKey, getFieldState, isEmpty } from '../utils';

const useTableValidation = (
  columns: TableColumn[],
  value: Record<string, any>[],
  onValidate?: (result: VirtualTableValidateResult) => void,
) => {
  const errorsRef = React.useRef<Set<string>>(new Set());
  const [validateVersion, setValidateVersion] = React.useState(0);
  const onValidateRef = React.useRef(onValidate);
  onValidateRef.current = onValidate;
  const valueRef = React.useRef(value);
  valueRef.current = value;

  const validateCell = React.useCallback(
    (rowIndex: number, field: TableColumn, fieldValue: any, record?: Record<string, any>) => {
      const row = record ?? valueRef.current[rowIndex];
      const state = row ? getFieldState(row, field) : { required: field.required ?? false };
      const key = cellErrorKey(rowIndex, field.key);
      const empty = isEmpty(fieldValue, field.component);
      const prev = errorsRef.current.has(key);
      if (state.required) {
        if (empty === prev) return;
        if (empty) errorsRef.current.add(key);
        else errorsRef.current.delete(key);
      } else if (prev) {
        errorsRef.current.delete(key);
      }
    },
    [],
  );

  const validate = React.useCallback(
    (data?: Record<string, any>[]): VirtualTableValidateResult => {
      const rows = data ?? value;
      const nextErrors = new Set<string>();
      const errorsMap = new Map<string, string[]>();
      let firstError: VirtualTableValidateResult['firstError'];

      rows.forEach((row, rowIndex) => {
        columns.forEach((col) => {
          const state = getFieldState(row, col);
          if (!state.required || state.hidden || state.disabled) return;
          if (isEmpty(row[col.key], col.component)) {
            const key = cellErrorKey(rowIndex, col.key);
            const message = `${col.name} 必填`;
            nextErrors.add(key);
            if (!errorsMap.has(key)) errorsMap.set(key, []);
            errorsMap.get(key)!.push(message);
            if (!firstError) firstError = { rowIndex, fieldKey: col.key, message };
          }
        });
      });

      errorsRef.current = nextErrors;
      setValidateVersion((v) => v + 1);
      const result = { valid: nextErrors.size === 0, firstError, errors: errorsMap };
      onValidateRef.current?.(result);
      return result;
    },
    [columns, value],
  );

  const resetErrors = React.useCallback(() => {
    errorsRef.current = new Set();
    setValidateVersion((v) => v + 1);
  }, []);

  return { errorsRef, validate, validateCell, resetErrors, validateVersion };
};

export default useTableValidation;
