import React from 'react';
import type { FieldDisplayRendererProps } from '../types';
import styles from '../style.less';

type OptionLike = { label?: React.ReactNode; value?: any; options?: OptionLike[] };

const flattenOptions = (options?: OptionLike[]): OptionLike[] => {
  if (!Array.isArray(options)) return [];
  const result: OptionLike[] = [];
  options.forEach((opt) => {
    if (opt.options) {
      result.push(...flattenOptions(opt.options));
    } else {
      result.push(opt);
    }
  });
  return result;
};

const formatValue = (options: OptionLike[], v: any): string => {
  if (v === undefined || v === null || v === '') return '';
  const matched = options.find((opt) => opt.value === v);
  return matched && matched.label !== undefined ? String(matched.label) : String(v);
};

const SelectDisplay: React.FC<FieldDisplayRendererProps> = ({ field, value }) => {
  const values = Array.isArray(value) ? value : [value];
  const nonEmpty = values.filter((v) => v !== undefined && v !== null && v !== '');
  if (nonEmpty.length === 0) {
    return <span className={styles.displayEmpty}>-</span>;
  }

  const options = flattenOptions((field.fieldProps as any)?.options);
  const text = nonEmpty.map((v) => formatValue(options, v)).join('，');

  return (
    <span className={styles.displayCell} title={text}>
      {text}
    </span>
  );
};

export default SelectDisplay;
