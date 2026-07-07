import React from 'react';
import type { FieldDisplayRendererProps } from '../types';
import styles from '../style.less';

const DateDisplay: React.FC<FieldDisplayRendererProps> = ({ field, value }) => {
  const isEmpty = value === undefined || value === null || value === '';
  if (isEmpty) {
    return <span className={styles.displayEmpty}>-</span>;
  }

  let text: string;
  if (value && typeof value.format === 'function') {
    const format = (field.fieldProps as any)?.format || 'YYYY-MM-DD';
    text = value.format(format);
  } else {
    text = String(value);
  }

  return (
    <span className={styles.displayCell} title={text}>
      {text}
    </span>
  );
};

export default DateDisplay;
