import { Input, InputNumber, Select } from 'antd';
import classNames from 'classnames';
import React from 'react';
import type { SequenceRuleFormProps } from '../types';
import styles from '../style.less';

const SequenceRuleForm: React.FC<SequenceRuleFormProps> = ({ rule, field, columns, onUpdate }) => {
  const fieldOptions = columns.map((c) => ({ label: c.name, value: c.key }));
  const typeOptions = [
    { label: '固定值填充', value: 'value' },
    { label: '查找替换', value: 'replace' },
    ...(field?.component === 'text' || field?.component === 'digit'
      ? [{ label: '序列生成', value: 'sequence' }]
      : []),
  ];

  const seqPreview = React.useMemo(() => {
    const samples: string[] = [];
    for (let i = 0; i < 3; i += 1) {
      const num = rule.start + i * rule.step;
      const numStr = rule.digitWidth ? String(num).padStart(rule.digitWidth, '0') : String(num);
      samples.push(field?.component === 'digit' ? numStr : `${rule.prefix}${numStr}`);
    }
    return samples.join('、');
  }, [field?.component, rule.digitWidth, rule.prefix, rule.start, rule.step]);

  return (
    <>
      <div className={styles.batchEditRow}>
        <div className={classNames(styles.batchEditControl, styles.batchEditControlFixed)}>
          <label>目标字段</label>
          <Select
            style={{ width: '100%' }}
            value={rule.fieldKey}
            onChange={(v) => onUpdate(rule.id, { fieldKey: v })}
            options={fieldOptions}
          />
        </div>
        <div className={classNames(styles.batchEditControl, styles.batchEditControlFixed)}>
          <label>规则类型</label>
          <Select
            style={{ width: '100%' }}
            value={rule.type}
            onChange={(v) => onUpdate(rule.id, { type: v })}
            options={typeOptions}
          />
        </div>
      </div>
      <div className={styles.batchEditRow}>
        {field?.component !== 'digit' && (
          <div className={styles.batchEditControl}>
            <label>前缀</label>
            <Input
              placeholder="如 ELE_"
              value={rule.prefix}
              onChange={(e) => onUpdate(rule.id, { prefix: e.target.value })}
            />
          </div>
        )}
        <div className={styles.batchEditControl}>
          <label>起始值</label>
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            value={rule.start}
            onChange={(v) => onUpdate(rule.id, { start: v ?? 0 })}
          />
        </div>
        <div className={styles.batchEditControl}>
          <label>步长</label>
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            value={rule.step}
            onChange={(v) => onUpdate(rule.id, { step: v ?? 1 })}
          />
        </div>
        <div className={styles.batchEditControl}>
          <label>位数</label>
          <InputNumber
            style={{ width: '100%' }}
            min={1}
            placeholder="不补零"
            value={rule.digitWidth}
            onChange={(v) => onUpdate(rule.id, { digitWidth: v ?? undefined })}
          />
        </div>
      </div>
      <div className={styles.batchEditSequencePreview}>
        <span className={styles.batchEditSequencePreviewLabel}>预览</span>
        {seqPreview}
      </div>
    </>
  );
};

export default SequenceRuleForm;
