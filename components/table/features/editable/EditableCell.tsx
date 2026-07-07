import * as React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Input, InputNumber, Select, DatePicker, Switch, Popover } from 'antd';
import { clsx } from 'clsx';
import type { EditableColumnConfig, EditableContextValue } from './useEditable';
import EditableContext from './EditableContext';

const { TextArea } = Input;

export interface EditableCellProps {
  /** 列的 dataIndex */
  dataIndex: string | number;
  /** 列标题（用于错误提示） */
  title?: React.ReactNode;
  /** 当前行索引 */
  rowIndex: number;
  /** 当前记录 */
  record: any;
  /** 当前值 */
  value: any;
  /** 可编辑配置 */
  editableConfig: EditableColumnConfig;
  /** prefixCls */
  prefixCls: string;
  /** 原始 children（非编辑模式时渲染） */
  children?: React.ReactNode;
}

/**
 * 可编辑单元格
 *
 * - 编辑模式下渲染对应的编辑器（Input/Select/DatePicker 等）
 * - 校验失败时用 Popover 显示错误消息
 * - 聚焦时触发校验
 */
const EditableCell: React.FC<EditableCellProps> = ({
  dataIndex,
  title,
  rowIndex,
  record,
  value,
  editableConfig,
  prefixCls,
  children,
}) => {
  const editCtx = React.useContext(EditableContext);
  const [focused, setFocused] = React.useState(false);

  const errorKey = `${rowIndex}-${dataIndex}`;
  const hasError = editCtx?.errors.has(errorKey) ?? false;
  const errorMessages = editCtx?.errors.get(errorKey) ?? [];

  const handleChange = React.useCallback(
    (nextValue: any) => {
      editCtx?.onCellChange(rowIndex, dataIndex, nextValue, record);
      // 触发校验（同步规则）
      editCtx?.validateCell(rowIndex, dataIndex, nextValue, record);
    },
    [editCtx, rowIndex, dataIndex, record],
  );

  const handleFocus = React.useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setFocused(false);
    // blur 时触发校验
    editCtx?.validateCell(rowIndex, dataIndex, value, record);
  }, [editCtx, rowIndex, dataIndex, value, record]);

  // 渲染编辑器
  const renderEditor = () => {
    const { editor = 'input', editorProps, options, readOnly } = editableConfig;
    const commonProps = {
      value,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled: readOnly,
      status: hasError ? ('error' as const) : undefined,
      style: { width: '100%' },
    };

    switch (editor) {
      case 'input':
        return (
          <Input
            {...commonProps}
            {...editorProps}
            placeholder={editorProps?.placeholder ?? `请输入${typeof title === 'string' ? title : ''}`}
          />
        );
      case 'input-number':
        return <InputNumber {...commonProps} {...editorProps} />;
      case 'select':
        return (
          <Select
            {...commonProps}
            {...editorProps}
            options={options}
            placeholder={editorProps?.placeholder ?? `请选择${typeof title === 'string' ? title : ''}`}
          />
        );
      case 'date':
        return <DatePicker {...commonProps} {...editorProps} />;
      case 'textarea':
        return <TextArea {...commonProps} {...editorProps} autoSize={{ minRows: 1, maxRows: 3 }} />;
      case 'switch':
        return <Switch checked={value} onChange={handleChange} disabled={readOnly} />;
      default:
        return <Input {...commonProps} {...editorProps} />;
    }
  };

  // 如果不可编辑，渲染原始 children
  if (!editableConfig.editable) {
    return <>{children}</>;
  }

  const errorContent = (
    <div className={`${prefixCls}-editable-error-content`}>
      {errorMessages.map((msg, i) => (
        <div key={i} className={`${prefixCls}-editable-error-item`}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 14, marginRight: 6 }} />
          <span>{msg}</span>
        </div>
      ))}
    </div>
  );

  return (
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
      <Popover
        content={errorContent}
        trigger="focus"
        placement="topLeft"
        open={hasError && focused}
        destroyTooltipOnHide
        overlayClassName={`${prefixCls}-editable-error-popover`}
      >
        <div className={`${prefixCls}-editable-cell-trigger`}>
          {renderEditor()}
        </div>
      </Popover>
    </div>
  );
};

export default EditableCell;
