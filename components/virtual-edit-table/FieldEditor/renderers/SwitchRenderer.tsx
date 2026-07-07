import { Switch } from 'antd';
import React from 'react';
import type { FieldRendererProps } from '../types';

const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === '是' || value === 'true' || value === '1';
  if (typeof value === 'number') return value === 1;
  return false;
};

const SwitchRenderer: React.FC<FieldRendererProps> = ({ value, disabled, onChange }) => (
  <Switch
    checkedChildren="是"
    unCheckedChildren="否"
    checked={toBoolean(value)}
    disabled={disabled}
    onChange={onChange}
  />
);

export default SwitchRenderer;
