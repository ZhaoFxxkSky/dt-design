import { Radio, Select } from 'antd';
import classNames from 'classnames';
import React from 'react';
import FieldEditor from '../../FieldEditor';
import type { ValueRuleFormProps } from '../types';
import styles from '../style.less';

const ValueRuleForm: React.FC<ValueRuleFormProps> = ({ rule, field, columns, onUpdate }) => {
  const fieldOptions = columns.map((c) => ({ label: c.name, value: c.key }));
  const typeOptions = [
    { label: '固定值填充', value: 'value' },
    { label: '查找替换', value: 'replace' },
    ...(field?.component === 'text' || field?.component === 'digit'
      ? [{ label: '序列生成', value: 'sequence' }]
      : []),
  ];

  return (
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
      <div className={classNames(styles.batchEditControl, styles.batchEditControlFill)}>
        <label>填充值</label>
        <FieldEditor
          field={field}
          value={rule.value}
          onChange={(v) => onUpdate(rule.id, { value: v })}
        />
      </div>
      <div className={classNames(styles.batchEditControl, styles.batchEditControlMode)}>
        <label>填充方式</label>
        <Radio.Group
          value={rule.mode}
          onChange={(e) => onUpdate(rule.id, { mode: e.target.value })}
        >
          <Radio value="overwrite">覆盖</Radio>
          <Radio value="fillEmpty">仅填空</Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

export default ValueRuleForm;
