import { Input } from 'antd';
import React from 'react';
import type { FieldRendererProps } from '../types';
import { buildPlaceholder } from '../utils';

const TextRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  hasError,
  disabled,
  readOnly,
  onChange,
}) => (
  <Input
    {...(field.fieldProps as any)}
    placeholder={buildPlaceholder(field)}
    style={{ width: '100%' }}
    status={hasError ? 'error' : undefined}
    disabled={disabled}
    readOnly={readOnly}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextRenderer;
