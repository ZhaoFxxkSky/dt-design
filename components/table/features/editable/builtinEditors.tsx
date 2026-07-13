import * as React from 'react';
import { Input, InputNumber, Select, Switch } from 'antd';
import type { EditableConfig } from '../../interface';

/**
 * 内置编辑器的统一 props 接口
 */
export interface BuiltinEditorProps {
  /** 当前值 */
  value: unknown;
  /** 值变化回调（接收纯值，非 event） */
  onChange: (value: unknown) => void;
  /** focus 回调 */
  onFocus: () => void;
  /** blur 回调 */
  onBlur: () => void;
  /** antd status: 'error' 时显示红色边框 */
  status?: 'error' | '';
  /** placeholder */
  placeholder?: string;
  /** 完整的 editable 配置（用于读取 options、props 等） */
  config: EditableConfig;
}

// ============================================================
// Input 编辑器
// ============================================================
const InputEditor: React.FC<BuiltinEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  status,
  placeholder,
  config,
}) => {
  return (
    <Input
      value={value as string | undefined}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      status={status || undefined}
      placeholder={placeholder}
      style={{ width: '100%' }}
      {...config.props}
    />
  );
};

// ============================================================
// Textarea 编辑器
// ============================================================
const TextareaEditor: React.FC<BuiltinEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  status,
  placeholder,
  config,
}) => {
  return (
    <Input.TextArea
      value={value as string | undefined}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      status={status || undefined}
      placeholder={placeholder}
      style={{ width: '100%' }}
      autoSize={{ minRows: 1, maxRows: 3 }}
      {...config.props}
    />
  );
};

// ============================================================
// Number 编辑器
// ============================================================
const NumberEditor: React.FC<BuiltinEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  status,
  placeholder,
  config,
}) => {
  return (
    <InputNumber
      value={value as number | undefined}
      onChange={(val) => onChange(val ?? undefined)}
      onFocus={onFocus}
      onBlur={onBlur}
      status={status || undefined}
      placeholder={placeholder}
      style={{ width: '100%' }}
      {...config.props}
    />
  );
};

// ============================================================
// Select 编辑器
// ============================================================
const SelectEditor: React.FC<BuiltinEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  status,
  placeholder,
  config,
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      status={status || undefined}
      placeholder={placeholder}
      style={{ width: '100%' }}
      options={config.options}
      {...config.props}
    />
  );
};

// ============================================================
// Switch 编辑器
// ============================================================
const SwitchEditor: React.FC<BuiltinEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  config,
}) => {
  return (
    <Switch
      checked={!!value}
      onChange={onChange}
      // `onFocus`/`onBlur` are forwarded by Switch at runtime but missing from
      // `SwitchProps`; pass them via spread (spread props skip excess checks).
      {...{ onFocus, onBlur }}
      {...config.props}
    />
  );
};

// ============================================================
// 编辑器注册表
// ============================================================
const editorRegistry: Record<string, React.FC<BuiltinEditorProps>> = {
  input: InputEditor,
  textarea: TextareaEditor,
  number: NumberEditor,
  select: SelectEditor,
  switch: SwitchEditor,
};

/**
 * 渲染内置编辑器
 *
 * 根据 config.type 从注册表中查找对应的编辑器组件并渲染。
 * 如果 type 未注册，回退到 Input。
 */
export function renderBuiltinEditor(props: BuiltinEditorProps): React.ReactElement {
  const { config } = props;
  const Editor = editorRegistry[config.type ?? 'input'] ?? InputEditor;
  return <Editor {...props} />;
}

/**
 * 判断给定的 type 是否为内置编辑器类型
 */
export function isBuiltinEditor(type: string | undefined): boolean {
  return !!type && type in editorRegistry;
}
