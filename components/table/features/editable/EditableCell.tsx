import * as React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { clsx } from 'clsx';
import type { EditableConfig } from '../../interface';
import type { AnyObject } from '../../../_util/type';
import EditableContext from './EditableContext';
import { renderBuiltinEditor } from './builtinEditors';

export interface EditableCellProps {
  dataIndex: string | number;
  title?: React.ReactNode;
  rowIndex: number;
  record: AnyObject;
  value: unknown;
  editableConfig: EditableConfig;
  prefixCls: string;
  children?: React.ReactNode;
}

/**
 * 可编辑单元格
 *
 * 核心设计：
 *
 * 1. **本地状态**（连续型编辑器 Input/Textarea/Number）
 *    输入时只更新本地 state，不触发父组件重渲染。
 *
 * 2. **本地同步校验**
 *    校验在单元格内部同步执行，不经过 context setErrors。
 *
 * 3. **dirty 追踪**
 *    只有用户修改过的单元格才显示校验错误。
 *
 * 4. **blur 提交**
 *    连续型编辑器在失焦时将本地值提交到父组件。
 *
 * 5. **Popover 可见性控制**
 *    始终渲染 Popover 保持 DOM 结构稳定（避免 input 被重建）。
 *    open = hasError && (focused || hovered) — 初始无错误时不渲染 tooltip 内容。
 *    关闭动画：lastMessagesRef 缓存最后一次有错误的消息。
 *
 * 6. **Popover 挂载到表格容器**
 *    getPopupContainer 返回表格滚动容器，确保 Popover 随表格滚动。
 */
const EditableCellInner = React.memo<EditableCellProps>(
  ({
    dataIndex,
    title,
    rowIndex,
    record,
    value,
    editableConfig,
    prefixCls,
    children: _children,
  }) => {
    const editCtx = React.useContext(EditableContext);

    // ---- 连续型 vs 离散型 ----
    const isContinuous =
      !editableConfig.renderEditor &&
      (editableConfig.type === 'input' ||
        editableConfig.type === 'textarea' ||
        editableConfig.type === 'number' ||
        !editableConfig.type);

    // ---- 本地状态 ----
    const [localValue, setLocalValue] = React.useState<unknown>(value);
    const [localErrors, setLocalErrors] = React.useState<string[]>([]);

    // ---- dirty / 编辑状态追踪 ----
    const isDirtyRef = React.useRef(false);
    const committedValueRef = React.useRef<unknown>(value);
    const blurHandledRef = React.useRef(false);
    const validateSeqRef = React.useRef(0);

    // ---- focus / hover 状态 ----
    const [focused, setFocused] = React.useState(false);

    // ---- 外部值变更时同步本地状态 ----
    React.useEffect(() => {
      if (value !== committedValueRef.current) {
        setLocalValue(value);
        committedValueRef.current = value;
        isDirtyRef.current = false;
        setLocalErrors([]);
      }
    }, [value]);

    // ---- 错误查找 ----
    const errorKey = `${rowIndex}-${dataIndex}`;
    const globalErrors = editCtx?.errors.get(errorKey) ?? [];
    const effectiveErrors = isDirtyRef.current ? localErrors : globalErrors;
    const hasError = effectiveErrors.length > 0;

    // ---- Popover 退出动画：缓存最后一次有错误的消息 ----
    const lastMessagesRef = React.useRef<string[]>([]);
    if (hasError) {
      lastMessagesRef.current = effectiveErrors;
    }

    // ---- 本地同步校验 ----
    const validateLocal = React.useCallback(
      async (val: unknown) => {
        const rules = editableConfig.rules;
        if (!rules) {
          setLocalErrors([]);
          return;
        }
        const seq = ++validateSeqRef.current;
        const messages: string[] = [];

        for (const rule of rules) {
          if (rule.required) {
            const isEmpty =
              val === undefined ||
              val === null ||
              val === '' ||
              (Array.isArray(val) && val.length === 0);
            if (isEmpty) {
              messages.push(rule.message || `${title || dataIndex} 必填`);
              continue;
            }
          }

          if (rule.pattern && val != null && val !== '') {
            if (!rule.pattern.test(String(val))) {
              messages.push(rule.message || `${title || dataIndex} 格式不正确`);
              continue;
            }
          }

          if (rule.validator) {
            const msg = await rule.validator(val, record);
            if (msg) messages.push(msg);
          }
        }

        if (seq === validateSeqRef.current) {
          setLocalErrors(messages);
        }
      },
      [editableConfig, title, dataIndex, record],
    );

    // ---- 提交到父组件 ----
    const commitToParent = React.useCallback(
      (val: unknown) => {
        editCtx?.onCellChange(rowIndex, dataIndex, val, record);
      },
      [editCtx, rowIndex, dataIndex, record],
    );

    // ---- change 处理 ----
    const handleChange = React.useCallback(
      (nextValue: unknown) => {
        isDirtyRef.current = true;
        blurHandledRef.current = false;

        if (isContinuous) {
          setLocalValue(nextValue);
          validateLocal(nextValue);
        } else {
          committedValueRef.current = nextValue;
          setLocalValue(nextValue);
          validateLocal(nextValue);
          commitToParent(nextValue);
        }
      },
      [isContinuous, validateLocal, commitToParent],
    );

    const handleFocus = React.useCallback(() => {
      blurHandledRef.current = false;
      setFocused(true);
    }, []);

    const handleBlur = React.useCallback(() => {
      if (blurHandledRef.current) return;
      blurHandledRef.current = true;
      setFocused(false);

      if (isContinuous) {
        committedValueRef.current = localValue;
        commitToParent(localValue);
      }

      const saveValue = isContinuous ? localValue : value;
      if (saveValue !== undefined) {
        editableConfig.onSave?.(saveValue, record, rowIndex);
      }
    }, [isContinuous, localValue, value, commitToParent, editableConfig, record, rowIndex]);

    // ---- placeholder ----
    const titleStr = typeof title === 'string' ? title : '';
    const placeholder =
      editableConfig.type === 'select'
        ? `请选择${titleStr}`
        : editableConfig.type === 'switch'
          ? undefined
          : `请输入${titleStr}`;

    // ---- 渲染编辑器 ----
    const editorValue = isContinuous ? localValue : value;

    const renderEditor = () => {
      if (editableConfig.renderEditor) {
        return editableConfig.renderEditor(editorValue, record, rowIndex, handleChange);
      }
      return renderBuiltinEditor({
        value: editorValue,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        status: hasError ? 'error' : '',
        placeholder,
        config: editableConfig,
      });
    };

    // ---- Popover 容器：挂载到表格滚动容器 ----
    const getPopupContainer = React.useCallback(
      (triggerNode: HTMLElement): HTMLElement => {
        const el =
          triggerNode.parentNode ||
          triggerNode.closest(`.${prefixCls}-body`) ||
          triggerNode.closest(`.${prefixCls}-content`) ||
          triggerNode.closest(`.${prefixCls}-container`);

        return (el as HTMLElement) || document.body;
      },
      [prefixCls],
    );

    // ---- Popover 显示条件 ----
    const popoverOpen = hasError && focused;

    // ---- 错误内容 ----
    const errorContent = (
      <div className={`${prefixCls}-editable-error-content`}>
        {lastMessagesRef.current.map((msg) => (
          <div key={msg} className={`${prefixCls}-editable-error-item`}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 14, marginRight: 6 }} />
            <span>{msg}</span>
          </div>
        ))}
      </div>
    );

    return (
      <Popover
        open={popoverOpen}
        content={errorContent}
        placement="topLeft"
        getPopupContainer={getPopupContainer}
        overlayClassName={`${prefixCls}-editable-error-popover`}
      >
        <div
          className={clsx(`${prefixCls}-editable-cell`, {
            [`${prefixCls}-editable-cell-error`]: hasError,
          })}
          onFocusCapture={handleFocus}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              handleBlur();
            }
          }}
        >
          {renderEditor()}
        </div>
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.record === nextProps.record &&
      prevProps.value === nextProps.value &&
      prevProps.dataIndex === nextProps.dataIndex &&
      prevProps.rowIndex === nextProps.rowIndex &&
      prevProps.prefixCls === nextProps.prefixCls
    );
  },
);

EditableCellInner.displayName = 'EditableCell';

export default EditableCellInner;
