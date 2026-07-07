import { InputNumber } from 'antd';
import React from 'react';
import type { FieldRendererProps } from '../types';
import { buildPlaceholder } from '../utils';

const DigitRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  hasError,
  disabled,
  readOnly,
  onChange,
}) => (
  <InputNumber
    {...(field.fieldProps as any)}
    placeholder={buildPlaceholder(field)}
    style={{ width: '100%' }}
    status={hasError ? 'error' : undefined}
    min={0}
    disabled={disabled}
    readOnly={readOnly}
    value={value}
    onChange={onChange}
  />
);

export default DigitRenderer;
