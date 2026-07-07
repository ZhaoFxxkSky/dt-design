import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import type { FieldRendererProps } from '../types';
import { buildPlaceholder } from '../utils';

const DateRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  hasError,
  disabled,
  readOnly,
  onChange,
}) => (
  <DatePicker
    {...(field.fieldProps as any)}
    placeholder={buildPlaceholder(field)}
    style={{ width: '100%' }}
    status={hasError ? 'error' : undefined}
    disabled={disabled}
    readOnly={readOnly}
    value={value ? moment(value) : undefined}
    onChange={(d) => onChange(d?.format('YYYY-MM-DD'))}
  />
);

export default DateRenderer;
