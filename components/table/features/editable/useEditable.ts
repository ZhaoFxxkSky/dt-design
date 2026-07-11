import * as React from 'react';
import type {
  ColumnsType,
  ColumnType,
  EditableConfig,
  EditableErrors,
  EditableValidateResult,
} from '../../interface';
import type { AnyObject } from '../../../_util/type';
import type { EditableContextValue } from './EditableContext';

/** 错误集合类型 — 从 interface.ts 重新导出保持兼容 */
export type { EditableErrors, EditableValidateResult };

/** 重新导出，保持 index.ts 的 API 不变 */
export type { EditableContextValue } from './EditableContext';

export interface UseEditableOptions {
  /** 列配置（含 editable 配置） */
  columns: ColumnsType;
  /** 数据源 */
  data: AnyObject[];
  /** 值变化回调 */
  onChange?: (data: AnyObject[]) => void;
  /** 校验完成回调 */
  onValidate?: (result: EditableValidateResult) => void;
  /** 行 key 获取函数 */
  getRowKey?: (record: AnyObject, index: number) => React.Key;
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

/** 叶子列类型（排除 ColumnGroupType） */
type LeafColumn<RecordType = AnyObject> = ColumnType<RecordType>;

/**
 * useEditable hook
 *
 * 管理表格的可编辑状态、校验、错误展示
 *
 * 性能优化：
 *   - flatColumns 通过 useMemo 缓存，避免每次 onCellChange / validateCell 都重新扁平化
 *   - colMap 缓存 dataIndex → column 映射，O(1) 查找
 */
function useEditable({ columns, data, onChange, onValidate, scrollToRow }: UseEditableOptions) {
  const [errors, setErrors] = React.useState<Map<string, string[]>>(() => new Map());

  const dataRef = React.useRef(data);
  dataRef.current = data;
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

  // ---- 扁平化列 + 缓存映射 ----
  // useMemo 确保 columns 引用不变时不会重复计算
  const flatColumns = React.useMemo<LeafColumn[]>(() => {
    const result: LeafColumn[] = [];
    const walk = (cols: ColumnsType) => {
      for (const col of cols) {
        if ('children' in col && col.children) {
          walk(col.children);
        } else {
          result.push(col as LeafColumn);
        }
      }
    };
    walk(columns);
    return result;
  }, [columns]);

  const colMap = React.useMemo(() => {
    const map = new Map<string, LeafColumn>();
    for (const col of flatColumns) {
      const key = String(col.dataIndex ?? col.key);
      if (key) map.set(key, col);
    }
    return map;
  }, [flatColumns]);

  const getEditableConfig = React.useCallback((col: LeafColumn): EditableConfig | null => {
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
      record: AnyObject,
      config: EditableConfig,
      colTitle?: React.ReactNode,
      dataIndex?: string | number,
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
    async (rowIndex: number, dataIndex: string | number, value: any, record: AnyObject) => {
      const col = colMap.get(String(dataIndex));
      if (!col) return;

      const config = getEditableConfig(col);
      if (!config) return;

      const messages = await validateValue(value, record, config, col.title, dataIndex);

      const key = errorKey(rowIndex, dataIndex);
      setErrors((prev) => {
        const existing = prev.get(key);
        // 错误内容没变化 → 返回旧 Map，不触发 context 重渲染
        if (
          existing &&
          existing.length === messages.length &&
          existing.every((m, i) => m === messages[i])
        ) {
          return prev;
        }
        if (!existing && messages.length === 0) {
          return prev;
        }
        // 有变化才创建新 Map
        const next = new Map(prev);
        if (messages.length > 0) {
          next.set(key, messages);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [errorKey, getEditableConfig, validateValue, colMap],
  );

  // 校验全部数据
  const validateAll = React.useCallback(
    (validateData?: AnyObject[]): EditableValidateResult => {
      const rows = validateData ?? dataRef.current;
      const nextErrors = new Map<string, string[]>();
      let firstError: EditableValidateResult['firstError'];

      rows.forEach((row, rowIndex) => {
        flatColumns.forEach((col) => {
          const config = getEditableConfig(col);
          if (!config) return;

          const dataIndex = col.dataIndex;
          const value = (row as Record<string, unknown>)[dataIndex as string];
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

      const result = {
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
    [errorKey, getEditableConfig, flatColumns],
  );

  const resetErrors = React.useCallback(() => {
    setErrors(new Map());
  }, []);

  const onCellChange = React.useCallback(
    (rowIndex: number, dataIndex: string | number, value: any, record: AnyObject) => {
      const currentData = dataRef.current;
      const newData = currentData.map((row, i) => {
        if (i === rowIndex) {
          return { ...row, [dataIndex]: value };
        }
        return row;
      });
      onChangeRef.current?.(newData);

      // 触发列的 onChange 回调 — O(1) 查找
      const col = colMap.get(String(dataIndex));
      if (col) {
        const config = getEditableConfig(col);
        config?.onChange?.(value, record, rowIndex);
      }
    },
    [getEditableConfig, colMap],
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
      scrollToError,
    }),
    [errors, validateCell, validateAll, resetErrors, onCellChange, scrollToError],
  );

  return {
    contextValue,
    errors,
    validateCell,
    validateAll,
    resetErrors,
    onCellChange,
  };
}

export default useEditable;
