import { Select } from 'antd';
import React from 'react';
import type { FieldRendererProps } from '../types';
import { buildPlaceholder } from '../utils';

const SelectRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  hasError,
  disabled,
  readOnly,
  onChange,
}) => (
  <Select
    {...(field.fieldProps as any)}
    placeholder={buildPlaceholder(field)}
    style={{ width: '100%' }}
    status={hasError ? 'error' : undefined}
    showSearch
    allowClear
    disabled={disabled}
    value={value}
    onChange={onChange}
    open={readOnly ? false : undefined}
  />
);

export default SelectRenderer;
