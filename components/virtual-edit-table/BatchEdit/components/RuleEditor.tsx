import { Button, Space } from 'antd';
import classNames from 'classnames';
import React from 'react';
import type { RuleEditorProps } from '../types';
import { typeLabelMap } from '../utils';
import ReplaceRuleForm from './ReplaceRuleForm';
import SequenceRuleForm from './SequenceRuleForm';
import ValueRuleForm from './ValueRuleForm';
import styles from '../style.less';

const RuleEditor: React.FC<RuleEditorProps> = ({
  rule,
  idx,
  columns,
  data,
  selectedRows,
  totalRules,
  onMove,
  onUpdate,
  onRemove,
}) => {
  const field = columns.find((c) => c.key === rule.fieldKey) ?? columns[0];

  const header = (
    <div className={styles.batchEditRuleHeader}>
      <div className={styles.batchEditRuleTitle}>
        <span className={styles.batchEditRuleIndex}>{idx + 1}</span>
        <div className={styles.batchEditRuleMeta}>
          <span className={styles.batchEditRuleType}>{typeLabelMap[rule.type]}</span>
          <span style={{ margin: '0 4px' }}>·</span>
          <span className={styles.batchEditRuleTarget}>{field?.name}</span>
        </div>
      </div>
      <Space size={4}>
        <Button type="text" size="small" disabled={idx === 0} onClick={() => onMove(rule.id, 'up')}>
          上移
        </Button>
        <Button
          type="text"
          size="small"
          disabled={idx === totalRules - 1}
          onClick={() => onMove(rule.id, 'down')}
        >
          下移
        </Button>
        {totalRules > 1 && (
          <Button type="text" danger size="small" onClick={() => onRemove(rule.id)}>
            删除
          </Button>
        )}
      </Space>
    </div>
  );

  const renderBody = () => {
    if (rule.type === 'value') {
      return <ValueRuleForm rule={rule} field={field} columns={columns} onUpdate={onUpdate} />;
    }
    if (rule.type === 'replace') {
      return (
        <ReplaceRuleForm
          rule={rule}
          field={field}
          columns={columns}
          data={data}
          selectedRows={selectedRows}
          onUpdate={onUpdate}
        />
      );
    }
    return <SequenceRuleForm rule={rule} field={field} columns={columns} onUpdate={onUpdate} />;
  };

  return (
    <div className={styles.batchEditRule}>
      {header}
      <div className={classNames(styles.batchEditRuleBody)}>{renderBody()}</div>
    </div>
  );
};

export default RuleEditor;
