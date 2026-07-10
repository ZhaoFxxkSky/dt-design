import * as React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Input, InputNumber, Modal, Radio, Select, Space } from 'antd';
import type { ColumnType, EditableConfig } from '../../interface';
import type { AnyObject } from '../../_util/type';
import type {
  BatchEditModalProps,
  BatchRule,
  BatchRuleType,
  ReplaceBatchRule,
  SequenceBatchRule,
  ValueBatchRule,
} from './batchEditTypes';
import {
  applyBatchRules,
  getBatchEditableColumns,
  isSequenceSupported,
  typeLabelMap,
} from './batchEditUtils';
import useBatchRules from './useBatchRules';

// ============================================================
// 辅助函数
// ============================================================

/** 叶子列类型 */
type LeafColumn = ColumnType<AnyObject>;

/** Select 选项类型 */
interface SelectOption {
  label: React.ReactNode;
  value: unknown;
}

const buildFieldOptions = (columns: LeafColumn[]) =>
  columns.map((c) => ({
    label: typeof c.title === 'string' ? c.title : String(c.dataIndex ?? c.key),
    value: String(c.dataIndex ?? c.key),
  }));

const buildTypeOptions = (
  fieldKey: string,
  columns: LeafColumn[],
): { label: string; value: BatchRuleType }[] => {
  const options: { label: string; value: BatchRuleType }[] = [
    { label: '固定值填充', value: 'value' },
    { label: '查找替换', value: 'replace' },
  ];
  if (isSequenceSupported(columns, fieldKey)) {
    options.push({ label: '序列生成', value: 'sequence' });
  }
  return options;
};

const getColumnByFieldKey = (columns: LeafColumn[], fieldKey: string): LeafColumn | undefined => {
  return columns.find((c) => String(c.dataIndex ?? c.key) === fieldKey);
};

const getEditorType = (columns: LeafColumn[], fieldKey: string): string => {
  const col = getColumnByFieldKey(columns, fieldKey);
  if (!col) return 'input';
  const ed = col.editable;
  if (ed && typeof ed === 'object') return ed.type || 'input';
  return 'input';
};

const getFieldOptions = (columns: LeafColumn[], fieldKey: string): SelectOption[] => {
  const col = getColumnByFieldKey(columns, fieldKey);
  if (!col) return [];
  const ed = col.editable;
  if (ed && typeof ed === 'object') return (ed as EditableConfig).options || [];
  return [];
};

// ============================================================
// 规则表单子组件
// ============================================================

const ValueRuleForm: React.FC<{
  rule: ValueBatchRule;
  columns: LeafColumn[];
  onUpdate: (id: string, patch: Partial<BatchRule>) => void;
}> = ({ rule, columns, onUpdate }) => {
  const editorType = getEditorType(columns, rule.fieldKey);
  const fieldOpts = getFieldOptions(columns, rule.fieldKey);

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
      <div style={{ flex: 1 }}>
        <label
          htmlFor={`value-${rule.id}`}
          style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
        >
          填充值
        </label>
        {editorType === 'select' ? (
          <Select
            id={`value-${rule.id}`}
            style={{ width: '100%' }}
            value={rule.value}
            onChange={(v) => onUpdate(rule.id, { value: v } as Partial<BatchRule>)}
            options={fieldOpts}
            placeholder="选择填充值"
            allowClear
          />
        ) : editorType === 'number' ? (
          <InputNumber
            id={`value-${rule.id}`}
            style={{ width: '100%' }}
            value={rule.value as number | undefined}
            onChange={(v) => onUpdate(rule.id, { value: v ?? undefined } as Partial<BatchRule>)}
            placeholder="输入填充值"
          />
        ) : (
          <Input
            id={`value-${rule.id}`}
            value={rule.value as string | undefined}
            onChange={(e) => onUpdate(rule.id, { value: e.target.value } as Partial<BatchRule>)}
            placeholder="输入填充值"
          />
        )}
      </div>
      <div style={{ width: 200 }}>
        <label
          htmlFor={`mode-${rule.id}`}
          style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
        >
          填充方式
        </label>
        <Radio.Group
          id={`mode-${rule.id}`}
          value={rule.mode}
          onChange={(e) => onUpdate(rule.id, { mode: e.target.value } as Partial<BatchRule>)}
        >
          <Radio value="overwrite">覆盖</Radio>
          <Radio value="fillEmpty">仅填空</Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

const ReplaceRuleForm: React.FC<{
  rule: ReplaceBatchRule;
  columns: LeafColumn[];
  data: AnyObject[];
  selectedRowKeys: React.Key[];
  getRowKey: (record: AnyObject, index: number) => React.Key;
  onUpdate: (id: string, patch: Partial<BatchRule>) => void;
}> = ({ rule, columns, data, selectedRowKeys, getRowKey, onUpdate }) => {
  const editorType = getEditorType(columns, rule.fieldKey);
  const fieldOpts = getFieldOptions(columns, rule.fieldKey);
  const isSelect = editorType === 'select';

  const distinctValues = React.useMemo(() => {
    const keySet = new Set(selectedRowKeys);
    const set = new Set<unknown>();
    data.forEach((row, i) => {
      if (!keySet.has(getRowKey(row, i))) return;
      const v = row[rule.fieldKey];
      if (v === undefined || v === null) {
        set.add('');
      } else if (Array.isArray(v)) {
        v.forEach((item) => set.add(item));
      } else {
        set.add(v);
      }
    });
    return Array.from(set).slice(0, 50);
  }, [data, selectedRowKeys, rule.fieldKey, getRowKey]);

  const oldValueOptions = distinctValues.map((v) => ({
    label: v === '' ? '（空）' : String(v),
    value: v,
  }));

  return (
    <>
      {!isSelect && (
        <div style={{ marginBottom: 8 }}>
          <label
            htmlFor={`match-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            匹配方式
          </label>
          <Radio.Group
            id={`match-${rule.id}`}
            value={rule.matchMode}
            onChange={(e) => onUpdate(rule.id, { matchMode: e.target.value } as Partial<BatchRule>)}
          >
            <Radio value="exact">精确匹配</Radio>
            <Radio value="contains">包含匹配</Radio>
          </Radio.Group>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`old-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            查找内容
          </label>
          <Select
            id={`old-${rule.id}`}
            style={{ width: '100%' }}
            showSearch
            value={rule.oldValue}
            onChange={(v) => onUpdate(rule.id, { oldValue: v } as Partial<BatchRule>)}
            options={oldValueOptions}
            placeholder="选择查找值"
            allowClear
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`new-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            替换为
          </label>
          {isSelect ? (
            <Select
              id={`new-${rule.id}`}
              style={{ width: '100%' }}
              value={rule.newValue}
              onChange={(v) => onUpdate(rule.id, { newValue: v } as Partial<BatchRule>)}
              options={fieldOpts}
              placeholder="选择替换值"
              allowClear
            />
          ) : editorType === 'number' ? (
            <InputNumber
              id={`new-${rule.id}`}
              style={{ width: '100%' }}
              value={rule.newValue as number | undefined}
              onChange={(v) =>
                onUpdate(rule.id, { newValue: v ?? undefined } as Partial<BatchRule>)
              }
              placeholder="替换为"
            />
          ) : (
            <Input
              id={`new-${rule.id}`}
              value={rule.newValue as string | undefined}
              onChange={(e) =>
                onUpdate(rule.id, { newValue: e.target.value } as Partial<BatchRule>)
              }
              placeholder="替换为"
            />
          )}
        </div>
      </div>
    </>
  );
};

const SequenceRuleForm: React.FC<{
  rule: SequenceBatchRule;
  columns: LeafColumn[];
  onUpdate: (id: string, patch: Partial<BatchRule>) => void;
}> = ({ rule, columns, onUpdate }) => {
  const editorType = getEditorType(columns, rule.fieldKey);
  const isNumberField = editorType === 'number';

  const seqPreview = React.useMemo(() => {
    const samples: string[] = [];
    for (let i = 0; i < 3; i++) {
      const num = rule.start + i * rule.step;
      const numStr = rule.digitWidth ? String(num).padStart(rule.digitWidth, '0') : String(num);
      samples.push(isNumberField ? numStr : `${rule.prefix}${numStr}`);
    }
    return samples.join('、');
  }, [rule, isNumberField]);

  return (
    <>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
        {!isNumberField && (
          <div style={{ flex: '1 1 120px', minWidth: 120 }}>
            <label
              htmlFor={`prefix-${rule.id}`}
              style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
            >
              前缀
            </label>
            <Input
              id={`prefix-${rule.id}`}
              placeholder="如 ELE_"
              value={rule.prefix}
              onChange={(e) => onUpdate(rule.id, { prefix: e.target.value } as Partial<BatchRule>)}
            />
          </div>
        )}
        <div style={{ flex: '1 1 100px', minWidth: 100 }}>
          <label
            htmlFor={`start-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            起始值
          </label>
          <InputNumber
            id={`start-${rule.id}`}
            style={{ width: '100%' }}
            min={0}
            value={rule.start}
            onChange={(v) => onUpdate(rule.id, { start: v ?? 0 } as Partial<BatchRule>)}
          />
        </div>
        <div style={{ flex: '1 1 100px', minWidth: 100 }}>
          <label
            htmlFor={`step-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            步长
          </label>
          <InputNumber
            id={`step-${rule.id}`}
            style={{ width: '100%' }}
            min={1}
            value={rule.step}
            onChange={(v) => onUpdate(rule.id, { step: v ?? 1 } as Partial<BatchRule>)}
          />
        </div>
        <div style={{ flex: '1 1 100px', minWidth: 100 }}>
          <label
            htmlFor={`digit-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            位数补零
          </label>
          <InputNumber
            id={`digit-${rule.id}`}
            style={{ width: '100%' }}
            min={1}
            placeholder="不补零"
            value={rule.digitWidth}
            onChange={(v) =>
              onUpdate(rule.id, { digitWidth: v ?? undefined } as Partial<BatchRule>)
            }
          />
        </div>
      </div>
      <div
        style={{
          padding: '6px 10px',
          background: '#f6f8fa',
          borderRadius: 4,
          fontSize: 12,
          color: '#595959',
        }}
      >
        预览：{seqPreview}
      </div>
    </>
  );
};

// ============================================================
// 规则编辑器
// ============================================================

interface RuleEditorProps {
  rule: BatchRule;
  idx: number;
  columns: LeafColumn[];
  data: AnyObject[];
  selectedRowKeys: React.Key[];
  getRowKey: (record: AnyObject, index: number) => React.Key;
  totalRules: number;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onUpdate: (id: string, patch: Partial<BatchRule>) => void;
  onRemove: (id: string) => void;
}

const RuleEditor: React.FC<RuleEditorProps> = ({
  rule,
  idx,
  columns,
  data,
  selectedRowKeys,
  getRowKey,
  totalRules,
  onMove,
  onUpdate,
  onRemove,
}) => {
  const fieldOptions = buildFieldOptions(columns);
  const typeOptions = buildTypeOptions(rule.fieldKey, columns);

  const renderBody = () => {
    if (rule.type === 'value') {
      return <ValueRuleForm rule={rule} columns={columns} onUpdate={onUpdate} />;
    }
    if (rule.type === 'replace') {
      return (
        <ReplaceRuleForm
          rule={rule}
          columns={columns}
          data={data}
          selectedRowKeys={selectedRowKeys}
          getRowKey={getRowKey}
          onUpdate={onUpdate}
        />
      );
    }
    return <SequenceRuleForm rule={rule} columns={columns} onUpdate={onUpdate} />;
  };

  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 12, marginBottom: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Space>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#1890ff',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {idx + 1}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{typeLabelMap[rule.type]}</span>
        </Space>
        <Space size={4}>
          <Button
            type="text"
            size="small"
            disabled={idx === 0}
            onClick={() => onMove(rule.id, 'up')}
          >
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`field-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            目标字段
          </label>
          <Select
            id={`field-${rule.id}`}
            style={{ width: '100%' }}
            value={rule.fieldKey}
            onChange={(v) => onUpdate(rule.id, { fieldKey: v } as Partial<BatchRule>)}
            options={fieldOptions}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label
            htmlFor={`type-${rule.id}`}
            style={{ display: 'block', fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}
          >
            规则类型
          </label>
          <Select
            id={`type-${rule.id}`}
            style={{ width: '100%' }}
            value={rule.type}
            onChange={(v) => onUpdate(rule.id, { type: v } as Partial<BatchRule>)}
            options={typeOptions}
          />
        </div>
      </div>

      {renderBody()}
    </div>
  );
};

// ============================================================
// 主组件
// ============================================================

const BatchEditModal: React.FC<BatchEditModalProps> = ({
  open,
  columns,
  selectedRowKeys,
  data,
  getRowKey,
  onCancel,
  onApply,
}) => {
  const availableColumns = React.useMemo(() => getBatchEditableColumns(columns), [columns]);

  const { rules, moveRule, updateRule, removeRule, addRule } = useBatchRules(
    open,
    availableColumns,
  );
  const [previewData, setPreviewData] = React.useState<AnyObject[] | null>(null);

  React.useEffect(() => {
    if (open) {
      setPreviewData(null);
    }
  }, [open]);

  const selectedCount = selectedRowKeys.length;

  const handleApply = () => {
    const newData = applyBatchRules(data, selectedRowKeys, getRowKey, columns, rules);
    onApply(newData);
  };

  const handlePreview = () => {
    const newData = applyBatchRules(data, selectedRowKeys, getRowKey, columns, rules);
    setPreviewData(newData);
  };

  const previewRows = React.useMemo(() => {
    if (!previewData) return [];
    const keySet = new Set(selectedRowKeys);
    return data
      .map((row, i) => ({ row, index: i, key: getRowKey(row, i) }))
      .filter((item) => keySet.has(item.key))
      .slice(0, 10)
      .map((item) => ({
        index: item.index,
        before: item.row,
        after: previewData[item.index],
      }));
  }, [previewData, data, selectedRowKeys, getRowKey]);

  return (
    <>
      <Modal
        title="批量编辑"
        open={open}
        onCancel={onCancel}
        width={720}
        destroyOnClose
        zIndex={1000}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
          <Button
            key="preview"
            onClick={handlePreview}
            disabled={rules.length === 0 || selectedCount === 0}
          >
            效果预览
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleApply}
            disabled={rules.length === 0 || selectedCount === 0}
          >
            确认应用
          </Button>,
        ]}
      >
        <div
          style={{
            marginBottom: 12,
            padding: '8px 12px',
            background: '#e6f7ff',
            borderRadius: 4,
            fontSize: 13,
          }}
        >
          已选择 <strong>{selectedCount}</strong> 行数据，共设置 <strong>{rules.length}</strong>{' '}
          条规则。 规则按从上到下的顺序依次执行。
        </div>

        <div>
          {availableColumns.length === 0 && (
            <Alert message="没有可批量编辑的字段" type="info" showIcon />
          )}
          {rules.map((rule, idx) => (
            <RuleEditor
              key={rule.id}
              rule={rule}
              idx={idx}
              columns={availableColumns}
              data={data}
              selectedRowKeys={selectedRowKeys}
              getRowKey={getRowKey}
              totalRules={rules.length}
              onMove={moveRule}
              onUpdate={updateRule}
              onRemove={removeRule}
            />
          ))}
          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            disabled={availableColumns.length === 0}
            onClick={addRule}
            style={{ marginTop: 4 }}
          >
            添加规则
          </Button>
        </div>
      </Modal>

      <Modal
        title="批量编辑效果预览"
        open={!!previewData}
        onCancel={() => setPreviewData(null)}
        onOk={() => setPreviewData(null)}
        width={640}
        zIndex={1100}
        footer={[
          <Button key="close" onClick={() => setPreviewData(null)}>
            关闭
          </Button>,
        ]}
      >
        {previewRows.length > 0 && (
          <div style={{ maxHeight: 400, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th
                    style={{ border: '1px solid #f0f0f0', padding: '6px 8px', textAlign: 'left' }}
                  >
                    行号
                  </th>
                  {rules.map((r) => {
                    const col = availableColumns.find(
                      (c) => String(c.dataIndex ?? c.key) === r.fieldKey,
                    );
                    return (
                      <th
                        key={r.id}
                        style={{
                          border: '1px solid #f0f0f0',
                          padding: '6px 8px',
                          textAlign: 'left',
                        }}
                      >
                        {typeof col?.title === 'string' ? col.title : r.fieldKey}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((item) => (
                  <tr key={item.index}>
                    <td style={{ border: '1px solid #f0f0f0', padding: '6px 8px' }}>
                      {item.index + 1}
                    </td>
                    {rules.map((r) => {
                      const before = item.before?.[r.fieldKey];
                      const after = item.after?.[r.fieldKey];
                      const changed = JSON.stringify(before) !== JSON.stringify(after);
                      return (
                        <td
                          key={r.id}
                          style={{
                            border: '1px solid #f0f0f0',
                            padding: '6px 8px',
                            background: changed ? '#f6ffed' : undefined,
                          }}
                        >
                          {changed ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#999' }}>
                                {before === undefined || before === null ? '—' : String(before)}
                              </span>
                              {' → '}
                              <span style={{ color: '#52c41a', fontWeight: 500 }}>
                                {after === undefined || after === null ? '—' : String(after)}
                              </span>
                            </>
                          ) : (
                            <span>
                              {before === undefined || before === null ? '—' : String(before)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {previewRows.length === 0 && (
          <Alert message="没有选中的行或规则为空" type="info" showIcon />
        )}
        {selectedRowKeys.length > 10 && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
            仅展示前 10 行，共 {selectedRowKeys.length} 行
          </div>
        )}
      </Modal>
    </>
  );
};

export default BatchEditModal;
