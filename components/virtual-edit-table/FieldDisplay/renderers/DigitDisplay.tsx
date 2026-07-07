import React from 'react';
import type { FieldDisplayRendererProps } from '../types';
import styles from '../style.less';

const DigitDisplay: React.FC<FieldDisplayRendererProps> = ({ value }) => {
  const isEmpty = value === undefined || value === null || value === '';
  const text = isEmpty ? '-' : typeof value === 'number' ? String(value) : String(value);
  return (
    <span className={isEmpty ? styles.displayEmpty : styles.displayCell} title={text}>
      {text}
    </span>
  );
};

export default DigitDisplay;
