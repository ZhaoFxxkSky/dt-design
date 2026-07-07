import React from 'react';
import type { FieldDisplayRendererProps } from '../types';
import styles from '../style.less';

const TextAreaDisplay: React.FC<FieldDisplayRendererProps> = ({ value }) => {
  const isEmpty = value === undefined || value === null || String(value).trim() === '';
  const text = isEmpty ? '-' : String(value);
  return (
    <span
      className={isEmpty ? styles.displayEmpty : `${styles.displayCell} ${styles.displayTextarea}`}
      title={text}
    >
      {text}
    </span>
  );
};

export default TextAreaDisplay;
