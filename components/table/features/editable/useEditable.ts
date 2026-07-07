import * as React from 'react';

/**
 * 可编辑单元格的配置
 */
export interface EditableColumnConfig {
  /** 是否可编辑 */
  editable?: boolean;
  /** 是否必填 */
  required?: boolean;
  /** 校验规则 */
  rules?: EditableRule[];
  /** 编辑器类型 */
  editor?: 'input' | 'input-number' | 'select' | 'date' | 'textarea' | 'switch';
  /** 编辑器额外属性 */
  editorProps?: Record<string, any>;
  /** 下拉选项（editor 为 select 时使用） */
  options?: { label: React.ReactNode; value: any }[];
  /** 只读 */
  readOnly?: boolean;
}

export interface EditableRule {
  /** 校验函数，返回错误消息或 undefined */
  validator: (value: any, record: any) => string | undefined | Promise<string | undefined>;
  /** 触发时机 */
  trigger?: 'onChange' | 'onBlur';
}

export type EditableErrors = Map<string, string[]>;

export interface EditableContextValue {
  /** 错误 Map: key = `${rowIndex}-${dataIndex}` */
  errors: EditableErrors;
  /** 校验单个单元格 */
  validateCell: (rowIndex: number, dataIndex: string | number, value: any, record: any) => void;
  /** 校验全部数据 */
  validateAll: (data: any[], getRowKey?: (record: any, index: number) => React.Key) => EditableValidateResult;
  /** 重置所有错误 */
  resetErrors: () => void;
  /** 更新单元格值 */
  onCellChange: (rowIndex: number, dataIndex: string | number, value: any, record: any) => void;
  /** 错误版本号（驱动重渲染） */
  errorsVersion: number;
  /** 滚动到错误行 */
  scrollToError: (rowIndex: number) => void;
}

export interface EditableValidateResult {
  valid: boolean;
  firstError?: { rowIndex: number; dataIndex: string | number; message: string };
  errors: EditableErrors;
}

/**
 * useEditable hook
 *
 * 管理表格的可编辑状态、校验、错误展示
 *
 * 特性：
 * - 单元格级别的值管理（通过 onCellChange 回调）
 * - 校验规则支持同步和异步
 * - 校验失败时 Popover 提示错误
 * - 自动滚动到第一个错误行
 */
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

function useEditable({
  columns,
  data,
  onChange,
  onValidate,
  scrollToRow,
}: UseEditableOptions) {
  // 错误 Map
  const [errors, setErrors] = React.useState<EditableErrors>(new Map());
  const [errorsVersion, setErrorsVersion] = React.useState(0);

  // ref 保持最新值
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

  // 错误 key 生成
  const errorKey = React.useCallback(
    (rowIndex: number, dataIndex: string | number) => `${rowIndex}-${dataIndex}`,
    [],
  );

  // 获取列的可编辑配置
  const getEditableConfig = React.useCallback((col: any): EditableColumnConfig | null => {
    if (!col) return null;
    const editableCfg = col.editable;
    if (!editableCfg) return null;
    if (typeof editableCfg === 'boolean') {
      return { editable: true };
    }
    return editableCfg as EditableColumnConfig;
  }, []);

  // 校验单个单元格
  const validateCell = React.useCallback(
    async (rowIndex: number, dataIndex: string | number, value: any, record: any) => {
      const col = columnsRef.current.find((c: any) => c.dataIndex === dataIndex);
      if (!col) return;

      const config = getEditableConfig(col);
      if (!config) return;

      const messages: string[] = [];

      // 必填校验
      if (config.required) {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          messages.push(`${col.title || dataIndex} 必填`);
        }
      }

      // 自定义规则校验
      if (config.rules) {
        for (const rule of config.rules) {
          const msg = await rule.validator(value, record);
          if (msg) messages.push(msg);
        }
      }

      const key = errorKey(rowIndex, dataIndex);
      setErrors(prev => {
        const next = new Map(prev);
        if (messages.length > 0) {
          next.set(key, messages);
        } else {
          next.delete(key);
        }
        return next;
      });
      setErrorsVersion(v => v + 1);
    },
    [errorKey, getEditableConfig],
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

          // 必填校验
          if (config.required) {
            const isEmpty =
              value === undefined ||
              value === null ||
              value === '' ||
              (Array.isArray(value) && value.length === 0);
            if (isEmpty) {
              messages.push(`${col.title || dataIndex} 必填`);
            }
          }

          // 同步规则校验
          if (config.rules) {
            for (const rule of config.rules) {
              const msg = rule.validator(value, row);
              if (typeof msg === 'string') messages.push(msg);
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
      setErrorsVersion(v => v + 1);

      const result: EditableValidateResult = {
        valid: nextErrors.size === 0,
        firstError,
        errors: nextErrors,
      };

      onValidateRef.current?.(result);

      // 自动滚动到第一个错误行
      if (!result.valid && firstError && scrollToRowRef.current) {
        scrollToRowRef.current(firstError.rowIndex);
      }

      return result;
    },
    [errorKey, getEditableConfig],
  );

  // 重置所有错误
  const resetErrors = React.useCallback(() => {
    setErrors(new Map());
    setErrorsVersion(v => v + 1);
  }, []);

  // 更新单元格值
  const onCellChange = React.useCallback(
    (rowIndex: number, dataIndex: string | number, value: any, _record: any) => {
      const currentData = dataRef.current;
      const newData = currentData.map((row, i) => {
        if (i === rowIndex) {
          return { ...row, [dataIndex]: value };
        }
        return row;
      });
      onChangeRef.current?.(newData);
    },
    [],
  );

  // 滚动到错误行
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
