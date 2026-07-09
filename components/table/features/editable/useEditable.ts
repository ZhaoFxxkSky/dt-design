import * as React from 'react';
import type { EditableConfig } from '../../interface';
import type { EditableContextValue } from './EditableContext';

export type EditableErrors = Map<string, string[]>;

export interface EditableValidateResult {
  valid: boolean;
  firstError?: { rowIndex: number; dataIndex: string | number; message: string };
  errors: EditableErrors;
}

// 重新导出，保持 index.ts 的 API 不变
export type { EditableContextValue } from './EditableContext';

export interface UseEditableOptions {
  /** 列配置（含 editable 配置） */
  columns: any[];
  /** 数据源 */
  data: any[];
  /** 值变化回调 */
  onChange?: (data: any[]) => void;
  /** 校验完成回调 */
  onValidate?: (result: EditableValidateResult) => void;
  /** 行 key 获取函数 */
  getRowKey?: (record: any, index: number) => React.Key;
  /** 滚动到行 */
  scrollToRow?: (index: number) => void;
  /** 是否启用编辑 */
  enabled?: boolean;
}

/**
 * 解析列的 editable 配置
 */
export function parseEditableConfig(
  editable: boolean | EditableConfig | undefined,
  globalEnabled?: boolean,
): { enabled: boolean; config: EditableConfig | null } {
  if (editable === true) return { enabled: true, config: {} };
  if (editable && typeof editable === 'object') return { enabled: true, config: editable };
  if (globalEnabled) return { enabled: true, config: {} };
  return { enabled: false, config: null };
}

/**
 * useEditable hook
 *
 * 管理表格的可编辑状态、校验、错误展示
 */
function useEditable({ columns, data, onChange, onValidate, scrollToRow }: UseEditableOptions) {
  const [errors, setErrors] = React.useState<EditableErrors>(new Map());
  const [errorsVersion, setErrorsVersion] = React.useState(0);

  const dataRef = React.useRef(data);
  dataRef.current = data;
  const columnsRef = React.useRef(columns);
  columnsRef.current = columns;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const onValidateRef = React.useRef(onValidate);
  onValidateRef.current = onValidate;
  const scrollToRowRef = React.useRef(scrollToRow);
  scrollToRowRef.current = scrollToRow;

  const errorKey = React.useCallback(
    (rowIndex: number, dataIndex: string | number) => `${rowIndex}-${dataIndex}`,
    [],
  );

  const getEditableConfig = React.useCallback((col: any): EditableConfig | null => {
    if (!col) return null;
    const ed = col.editable;
    if (ed === true) return {};
    if (ed && typeof ed === 'object') return ed as EditableConfig;
    return null;
  }, []);

  // 校验单个值
  const validateValue = React.useCallback(
    async (
      value: any,
      record: any,
      config: EditableConfig,
      colTitle?: any,
      dataIndex?: any,
    ): Promise<string[]> => {
      const messages: string[] = [];

      if (config.rules) {
        for (const rule of config.rules) {
          if (rule.required) {
            const isEmpty =
              value === undefined ||
              value === null ||
              value === '' ||
              (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
              messages.push(rule.message || `${colTitle || dataIndex} 必填`);
              continue;
            }
          }

          if (rule.pattern && value != null && value !== '') {
            if (!rule.pattern.test(String(value))) {
              messages.push(rule.message || `${colTitle || dataIndex} 格式不正确`);
              continue;
            }
          }

          if (rule.validator) {
            const msg = await rule.validator(value, record);
            if (msg) messages.push(msg);
          }
        }
      }

      return messages;
    },
    [],
  );

  // 校验单个单元格
  const validateCell = React.useCallback(
    async (rowIndex: number, dataIndex: string | number, value: any, record: any) => {
      const col = columnsRef.current.find((c: any) => c.dataIndex === dataIndex);
      if (!col) return;

      const config = getEditableConfig(col);
      if (!config) return;

      const messages = await validateValue(value, record, config, col.title, dataIndex);

      const key = errorKey(rowIndex, dataIndex);
      setErrors((prev) => {
        const next = new Map(prev);
        if (messages.length > 0) {
          next.set(key, messages);
        } else {
          next.delete(key);
        }
        return next;
      });
      setErrorsVersion((v) => v + 1);
    },
    [errorKey, getEditableConfig, validateValue],
  );

  // 校验全部数据
  const validateAll = React.useCallback(
    (validateData?: any[]): EditableValidateResult => {
      const rows = validateData ?? dataRef.current;
      const nextErrors = new Map<string, string[]>();
      let firstError: EditableValidateResult['firstError'];

      rows.forEach((row, rowIndex) => {
        columnsRef.current.forEach((col: any) => {
          const config = getEditableConfig(col);
          if (!config) return;

          const dataIndex = col.dataIndex;
          const value = row[dataIndex];
          const messages: string[] = [];

          if (config.rules) {
            for (const rule of config.rules) {
              if (rule.required) {
                const isEmpty =
                  value === undefined ||
                  value === null ||
                  value === '' ||
                  (Array.isArray(value) && value.length === 0);
                if (isEmpty) {
                  messages.push(rule.message || `${col.title || dataIndex} 必填`);
                  continue;
                }
              }

              if (rule.pattern && value != null && value !== '') {
                if (!rule.pattern.test(String(value))) {
                  messages.push(rule.message || `${col.title || dataIndex} 格式不正确`);
                  continue;
                }
              }

              if (rule.validator) {
                const msg = rule.validator(value, row);
                if (typeof msg === 'string') messages.push(msg);
              }
            }
          }

          if (messages.length > 0) {
            const key = errorKey(rowIndex, dataIndex);
            nextErrors.set(key, messages);
            if (!firstError) {
              firstError = { rowIndex, dataIndex, message: messages[0] };
            }
          }
        });
      });

      setErrors(nextErrors);
      setErrorsVersion((v) => v + 1);

      const result: EditableValidateResult = {
        valid: nextErrors.size === 0,
        firstError,
        errors: nextErrors,
      };

      onValidateRef.current?.(result);

      if (!result.valid && firstError && scrollToRowRef.current) {
        scrollToRowRef.current(firstError.rowIndex);
      }

      return result;
    },
    [errorKey, getEditableConfig],
  );

  const resetErrors = React.useCallback(() => {
    setErrors(new Map());
    setErrorsVersion((v) => v + 1);
  }, []);

  const onCellChange = React.useCallback(
    (rowIndex: number, dataIndex: string | number, value: any, record: any) => {
      const currentData = dataRef.current;
      const newData = currentData.map((row, i) => {
        if (i === rowIndex) {
          return { ...row, [dataIndex]: value };
        }
        return row;
      });
      onChangeRef.current?.(newData);

      // 触发列的 onChange 回调
      const col = columnsRef.current.find((c: any) => c.dataIndex === dataIndex);
      const config = getEditableConfig(col);
      config?.onChange?.(value, record, rowIndex);
    },
    [getEditableConfig],
  );

  const scrollToError = React.useCallback((rowIndex: number) => {
    scrollToRowRef.current?.(rowIndex);
  }, []);

  const contextValue: EditableContextValue = React.useMemo(
    () => ({
      errors,
      validateCell,
      validateAll,
      resetErrors,
      onCellChange,
      errorsVersion,
      scrollToError,
    }),
    [errors, errorsVersion, validateCell, validateAll, resetErrors, onCellChange, scrollToError],
  );

  return {
    contextValue,
    errors,
    errorsVersion,
    validateCell,
    validateAll,
    resetErrors,
    onCellChange,
  };
}

export default useEditable;
