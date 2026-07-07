import React from 'react';
import type { FieldDisplayRendererProps } from '../types';
import styles from '../style.less';

const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === '是' || value === 'true' || value === '1';
  if (typeof value === 'number') return value === 1;
  return false;
};

const SwitchDisplay: React.FC<FieldDisplayRendererProps> = ({ field, value }) => {
  const isEmpty = value === undefined || value === null || value === '';
  if (isEmpty) {
    return <span className={styles.displayEmpty}>-</span>;
  }

  const checked = toBoolean(value);
  const checkedChildren = (field.fieldProps as any)?.checkedChildren;
  const unCheckedChildren = (field.fieldProps as any)?.unCheckedChildren;

  let text: string;
  if (checked && checkedChildren !== undefined) {
    text = String(checkedChildren);
  } else if (!checked && unCheckedChildren !== undefined) {
    text = String(unCheckedChildren);
  } else {
    text = checked ? '是' : '否';
  }

  return (
    <span className={styles.displayCell} title={text}>
      {text}
    </span>
  );
};

export default SwitchDisplay;
