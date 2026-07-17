import * as React from 'react';
import type {
  ColumnsType,
  ColumnTitle,
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
  /** 树形子数据字段名（用于在 children 中定位记录） */
  childrenColumnName?: string;
  /** 滚动到行（rowKey 定位；rowIndex 为无 key 时的降级下标） */
  scrollToRow?: (rowKey: React.Key, rowIndex: number) => void;
  /** 是否启用编辑 */
  enabled?: boolean;
}

/** 空配置常量 — 保证引用稳定，使 React.memo 比较生效 */
const EMPTY_EDITABLE_CONFIG: EditableConfig = Object.freeze({});

/** 扁平化后的行：rowIndex 为 DFS 扁平序号（无 children 时 = data 下标） */
interface FlatEditableRow {
  record: AnyObject;
  rowIndex: number;
  rowKey: React.Key | undefined;
}

/**
 * 深度优先扁平化数据（含树形 children）。
 * 排序/筛选/展开子行都会改变"展示下标"，只有 rowKey 能稳定标识一条记录。
 */
function flattenEditableRows(
  rows: AnyObject[],
  childrenColumnName: string,
  getRowKey?: (record: AnyObject, index: number) => React.Key,
): FlatEditableRow[] {
  const flat: FlatEditableRow[] = [];
  const dig = (list: AnyObject[]) => {
    list.forEach((record, index) => {
      flat.push({ record, rowIndex: flat.length, rowKey: getRowKey?.(record, index) });
      const children = record?.[childrenColumnName];
      if (Array.isArray(children)) dig(children as AnyObject[]);
    });
  };
  dig(rows);
  return flat;
}

/**
 * 按 rowKey 在（含树形 children 的）数据中不可变更新一条记录。
 *
 * 返回 `undefined` 表示无法按 key 唯一定位（未命中或 key 重复），
 * 调用方需降级为索引更新，以保持与历史行为兼容。
 */
function updateRecordByKey(
  data: AnyObject[],
  childrenColumnName: string,
  getRowKey: (record: AnyObject, index: number) => React.Key,
  targetKey: React.Key,
  dataIndex: string | number,
  value: any,
): AnyObject[] | undefined {
  let matches = 0;

  const walk = (rows: AnyObject[]): AnyObject[] => {
    let changed = false;
    const next = rows.map((row, index) => {
      if (getRowKey(row, index) === targetKey) {
        matches += 1;
        changed = true;
        return { ...row, [dataIndex]: value };
      }
      const children = row?.[childrenColumnName];
      if (Array.isArray(children)) {
        const nextChildren = walk(children as AnyObject[]);
        if (nextChildren !== children) {
          changed = true;
          return { ...row, [childrenColumnName]: nextChildren };
        }
      }
      return row;
    });
    return changed ? next : rows;
  };

  const result = walk(data);
  // 仅当 key 唯一命中时才按 key 更新
  return matches === 1 ? result : undefined;
}

/**
 * validateCell 的写入记录 — validateAll 竞态合并用。
 * 记录完整错误消息与定位信息，使合并成为纯函数（不依赖 setState 时机读取 prev）。
 */
interface TouchedCellError {
  /** 写入序号（全局单调递增） */
  seq: number;
  /** 该单元格最新错误消息（空数组 = 错误已清除） */
  messages: string[];
  /** 行标识（rowKey，无 key 时为 rowIndex）— 合并后重建 firstError 用 */
  rowId: React.Key;
  dataIndex: string | number;
  rowIndex?: number;
}

/**
 * validateAll 完成时的错误合并（纯函数 — setErrors 与返回值共用同一份合并结果）。
 * 校验期间被用户重新编辑（validateCell 写入，seq > startSeq）的单元格保留其最新错误状态；
 * 未被触碰的单元格应用 validateAll 的校验结果。
 */
function mergeValidatedErrors(
  validated: Map<string, string[]>,
  touchedCells: ReadonlyMap<string, TouchedCellError>,
  startSeq: number,
): Map<string, string[]> {
  let next: Map<string, string[]> | null = null;
  for (const [key, touched] of touchedCells) {
    if (touched.seq > startSeq) {
      if (!next) next = new Map(validated);
      if (touched.messages.length > 0) {
        next.set(key, touched.messages);
      } else {
        next.delete(key);
      }
    }
  }
  // 无校验期编辑 → 直接复用校验结果，避免额外 Map 分配
  return next ?? validated;
}

/**
 * 解析列的 editable 配置
 */
export function parseEditableConfig(
  editable: boolean | EditableConfig | undefined,
  globalEnabled?: boolean,
): { enabled: boolean; config: EditableConfig | null } {
  if (editable === true) return { enabled: true, config: EMPTY_EDITABLE_CONFIG };
  if (editable && typeof editable === 'object') return { enabled: true, config: editable };
  // 列级显式关闭优先于全局开关：editable === false → 该列禁用编辑
  if (editable === false) return { enabled: false, config: null };
  // 列未配置 → 继承全局开关
  if (globalEnabled) return { enabled: true, config: EMPTY_EDITABLE_CONFIG };
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
function useEditable({
  columns,
  data,
  onChange,
  onValidate,
  getRowKey,
  childrenColumnName = 'children',
  scrollToRow,
}: UseEditableOptions) {
  const [errors, setErrors] = React.useState<Map<string, string[]>>(() => new Map());

  // validateAll 竞态防护（序号机制）：
  // touchSeqRef 全局单调递增；cellTouchSeqRef 记录每个单元格最后一次 validateCell 写入的序号。
  // validateAll 开始时快照序号，结束时对校验期间被用户重新编辑（validateCell 写入）过的
  // 单元格保留其最新错误状态，未被触碰的单元格应用 validateAll 的校验结果。
  const touchSeqRef = React.useRef(0);
  const cellTouchSeqRef = React.useRef(new Map<string, TouchedCellError>());

  const dataRef = React.useRef(data);
  dataRef.current = data;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const onValidateRef = React.useRef(onValidate);
  onValidateRef.current = onValidate;
  const getRowKeyRef = React.useRef(getRowKey);
  getRowKeyRef.current = getRowKey;
  const childrenColumnNameRef = React.useRef(childrenColumnName);
  childrenColumnNameRef.current = childrenColumnName;
  const scrollToRowRef = React.useRef(scrollToRow);
  scrollToRowRef.current = scrollToRow;

  // 错误 key 的第一分量是 rowKey；无 key 的降级场景传入 rowIndex
  const errorKey = React.useCallback(
    (rowId: React.Key, dataIndex: string | number) => `${rowId}-${dataIndex}`,
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
    if (ed === true) return EMPTY_EDITABLE_CONFIG;
    if (ed && typeof ed === 'object') return ed as EditableConfig;
    return null;
  }, []);

  // 校验单个值
  const validateValue = React.useCallback(
    async (
      value: any,
      record: AnyObject,
      config: EditableConfig,
      colTitle?: ColumnTitle,
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
            try {
              const msg = await rule.validator(value, record);
              if (msg) messages.push(msg);
            } catch (e) {
              messages.push(e instanceof Error ? e.message : String(e));
            }
          }
        }
      }

      return messages;
    },
    [],
  );

  // 校验单个单元格（rowKey 定位错误位；无 key 时降级为 rowIndex）
  const validateCell = React.useCallback(
    async (
      rowKey: React.Key | undefined,
      dataIndex: string | number,
      value: any,
      record: AnyObject,
      rowIndex?: number,
    ) => {
      const col = colMap.get(String(dataIndex));
      if (!col) return;

      const config = getEditableConfig(col);
      if (!config) return;

      const messages = await validateValue(value, record, config, col.title, dataIndex);

      const key = errorKey(rowKey ?? rowIndex ?? '', dataIndex);
      // 记录本次写入序号 — validateAll 据此识别校验期间被用户重新编辑过的单元格
      cellTouchSeqRef.current.set(key, {
        seq: ++touchSeqRef.current,
        messages,
        rowId: rowKey ?? rowIndex ?? '',
        dataIndex,
        rowIndex,
      });
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

  // 校验全部数据（异步 — 支持异步 validator）
  const validateAll = React.useCallback(
    async (validateData?: AnyObject[]): Promise<EditableValidateResult> => {
      const rows = validateData ?? dataRef.current;
      const nextErrors = new Map<string, string[]>();
      // 校验开始时的写入序号快照 — 完成合并时以此识别校验期间被触碰过的单元格
      const startTouchSeq = touchSeqRef.current;

      // 扁平化（DFS，含树形 children）— 错误以 rowKey 定位，排序/筛选后仍挂对行
      const flatRows = flattenEditableRows(
        rows,
        childrenColumnNameRef.current,
        getRowKeyRef.current,
      );

      // 行间并行、行内串行（保留 continue 语义）
      const rowResults = await Promise.all(
        flatRows.map(async ({ record: row, rowIndex, rowKey }) => {
          const cells: { key: string; dataIndex: string | number; messages: string[] }[] = [];
          for (const col of flatColumns) {
            const config = getEditableConfig(col);
            if (!config) continue;

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
                    messages.push(rule.message || `${String(col.title || dataIndex)} 必填`);
                    continue;
                  }
                }

                if (rule.pattern && value != null && value !== '') {
                  if (!rule.pattern.test(String(value))) {
                    messages.push(rule.message || `${String(col.title || dataIndex)} 格式不正确`);
                    continue;
                  }
                }

                if (rule.validator) {
                  try {
                    const msg = await rule.validator(value, row);
                    if (msg) messages.push(msg);
                  } catch (e) {
                    messages.push(e instanceof Error ? e.message : String(e));
                  }
                }
              }
            }

            if (messages.length > 0) {
              cells.push({
                key: errorKey(rowKey ?? rowIndex, String(dataIndex)),
                dataIndex: dataIndex as string | number,
                messages,
              });
            }
          }
          return { rowIndex, rowKey, cells };
        }),
      );

      // 收集本次校验的错误条目，用于合并后重建 firstError
      const errorEntries: Array<{
        key: string;
        rowIndex: number;
        rowKey: React.Key | undefined;
        dataIndex: string | number;
        messages: string[];
      }> = [];

      // 合并结果
      for (const { rowIndex, rowKey, cells } of rowResults) {
        for (const cell of cells) {
          nextErrors.set(cell.key, cell.messages);
          errorEntries.push({
            key: cell.key,
            rowIndex,
            rowKey,
            dataIndex: cell.dataIndex,
            messages: cell.messages,
          });
        }
      }

      // 函数式合并：异步校验期间被用户重新编辑过的单元格
      // （validateCell 已写入，序号 > startTouchSeq）保留其最新错误状态；
      // 未被触碰的单元格应用本次校验结果。
      // setErrors 与返回值共用同一份合并结果，保证外部拿到的 errors 与内部 state 一致。
      const mergedErrors = mergeValidatedErrors(
        nextErrors,
        cellTouchSeqRef.current,
        startTouchSeq,
      );

      // 合并后重建 firstError：保留在 mergedErrors 中的错误里 rowIndex 最小者
      let mergedFirstError: EditableValidateResult['firstError'];
      for (const { key, rowIndex: errRowIndex, rowKey: errRowKey, dataIndex: errDataIndex, messages: errMessages } of errorEntries) {
        if (mergedErrors.has(key)) {
          if (!mergedFirstError || errRowIndex < mergedFirstError.rowIndex) {
            mergedFirstError = {
              rowIndex: errRowIndex,
              rowKey: errRowKey ?? errRowIndex,
              dataIndex: errDataIndex,
              message: errMessages[0],
            };
          }
        }
      }
      for (const [key, touched] of cellTouchSeqRef.current) {
        if (
          touched.seq > startTouchSeq &&
          touched.messages.length > 0 &&
          mergedErrors.has(key)
        ) {
          const touchedRowIndex = touched.rowIndex ?? 0;
          if (!mergedFirstError || touchedRowIndex < mergedFirstError.rowIndex) {
            mergedFirstError = {
              rowIndex: touchedRowIndex,
              rowKey: touched.rowId,
              dataIndex: touched.dataIndex,
              message: touched.messages[0],
            };
          }
        }
      }

      setErrors(mergedErrors);

      const result = {
        valid: mergedErrors.size === 0,
        firstError: mergedFirstError,
        errors: mergedErrors,
      };

      onValidateRef.current?.(result);

      if (!result.valid && mergedFirstError && scrollToRowRef.current) {
        scrollToRowRef.current(mergedFirstError.rowKey, mergedFirstError.rowIndex);
      }

      return result;
    },
    [errorKey, getEditableConfig, flatColumns],
  );

  const resetErrors = React.useCallback(() => {
    setErrors(new Map());
  }, []);

  const onCellChange = React.useCallback(
    (
      rowKey: React.Key | undefined,
      dataIndex: string | number,
      value: any,
      record: AnyObject,
      rowIndex: number,
    ) => {
      const currentData = dataRef.current;
      let newData: AnyObject[] | undefined;

      // 优先按 rowKey 定位（含树形 children）— 排序/筛选后展示下标与 rawData 下标已不一致
      if (rowKey !== undefined && rowKey !== null && getRowKeyRef.current) {
        newData = updateRecordByKey(
          currentData,
          childrenColumnNameRef.current,
          getRowKeyRef.current,
          rowKey,
          dataIndex,
          value,
        );
      }
      if (!newData) {
        // 降级：无 key / key 未命中 / key 重复 → 维持原有索引行为
        newData = currentData.map((row, i) => {
          if (i === rowIndex) {
            return { ...row, [dataIndex]: value };
          }
          return row;
        });
      }
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

  const scrollToError = React.useCallback((rowKey: React.Key, rowIndex?: number) => {
    scrollToRowRef.current?.(rowKey, rowIndex ?? 0);
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
