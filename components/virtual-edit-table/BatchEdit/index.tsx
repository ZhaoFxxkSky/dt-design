import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Modal } from 'antd';
import React from 'react';
import { getFieldState } from '../VirtualEditTable/utils';
import BatchEditPreviewModal from './components/BatchEditPreviewModal';
import RuleEditor from './components/RuleEditor';
import useBatchRules from './hooks/useBatchRules';
import type { BatchEditModalProps } from './types';
import styles from './style.less';

const BatchEditModal: React.FC<BatchEditModalProps> = ({
  open,
  columns,
  selectedRows,
  data,
  onCancel,
  onOk,
}) => {
  const availableColumns = React.useMemo(() => {
    const selectedIndices = Array.from(selectedRows);
    return columns.filter((col) =>
      selectedIndices.every((i) => {
        const state = getFieldState(data[i], col);
        return !state.hidden && !state.disabled;
      }),
    );
  }, [columns, data, selectedRows]);

  const { rules, moveRule, updateRule, removeRule, addRule } = useBatchRules(open, availableColumns);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [mainModalKeyboard, setMainModalKeyboard] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setPreviewOpen(false);
      setMainModalKeyboard(true);
    }
  }, [open]);

  const selectedCount = selectedRows.size;

  const confirmApply = () => {
    Modal.confirm({
      title: '确认应用批量编辑',
      content: (
        <div>
          <p>
            本次批量编辑将影响 <strong>{selectedCount}</strong> 行数据，共{' '}
            <strong>{rules.length}</strong> 条规则。
          </p>
          <p>规则将按从上到下的顺序依次执行，确认后不可撤销。</p>
        </div>
      ),
      okText: '确认应用',
      cancelText: '取消',
      onOk: () => onOk(rules),
    });
  };

  return (
    <>
      <Modal
        title="批量编辑"
        open={open}
        onCancel={onCancel}
        onOk={confirmApply}
        width={720}
        destroyOnClose
        zIndex={1000}
        keyboard={mainModalKeyboard}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
          <Button
            key="preview"
            onClick={() => {
              setMainModalKeyboard(false);
              setPreviewOpen(true);
            }}
          >
            效果预览
          </Button>,
          <Button key="ok" type="primary" onClick={confirmApply}>
            确认应用
          </Button>,
        ]}
      >
        <div className={styles.batchEditSummary}>
          已选择 <strong>{selectedCount}</strong> 行数据，共设置 <strong>{rules.length}</strong> 条规则。
          规则按从上到下的顺序依次执行。
        </div>
        <div className={styles.batchEditForm}>
          {availableColumns.length === 0 && (
            <Alert
              message="当前选中行在当前状态下没有可批量编辑的字段（已被联动规则隐藏或禁用）"
              type="info"
              showIcon
            />
          )}
          {rules.map((rule, idx) => (
            <RuleEditor
              key={rule.id}
              rule={rule}
              idx={idx}
              columns={availableColumns}
              data={data}
              selectedRows={selectedRows}
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
            className={styles.batchEditAddRule}
            disabled={availableColumns.length === 0}
            onClick={addRule}
          >
            添加规则
          </Button>
        </div>
      </Modal>

      <BatchEditPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        columns={availableColumns}
        selectedRows={selectedRows}
        data={data}
        rules={rules}
      />
    </>
  );
};

export default BatchEditModal;
