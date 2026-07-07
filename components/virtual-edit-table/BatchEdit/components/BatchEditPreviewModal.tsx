import { Button, Modal } from 'antd';
import React from 'react';
import type { TableColumn } from '../../VirtualEditTable/types';
import { applyBatchRules } from '../utils';
import type { BatchEditModalProps, BatchRuleExt } from '../types';
import styles from '../style.less';

type BatchEditPreviewModalProps = {
  open: boolean;
  onClose: () => void;
  columns: BatchEditModalProps['columns'];
  selectedRows: BatchEditModalProps['selectedRows'];
  data: BatchEditModalProps['data'];
  rules: BatchRuleExt[];
};

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

const formatPreviewValue = (field: TableColumn | undefined, value: any): string => {
  if (value === undefined || value === null) return '-';
  if (field?.component === 'select') {
    const labelMap: Record<string, string> = {};
    flattenOptions((field.fieldProps as any)?.options ?? []).forEach((opt) => {
      if (opt.value !== undefined) {
        labelMap[String(opt.value)] = String(opt.label ?? opt.value);
      }
    });
    const values = Array.isArray(value) ? value : [value];
    return values
      .map((v) => (v === undefined || v === null ? '-' : labelMap[String(v)] ?? String(v)))
      .join('，');
  }
  return String(value);
};

const BatchEditPreviewModal: React.FC<BatchEditPreviewModalProps> = ({
  open,
  onClose,
  columns,
  selectedRows,
  data,
  rules,
}) => {
  const selectedIndices = React.useMemo(
    () => data.map((_, i) => i).filter((i) => selectedRows.has(i)),
    [data, selectedRows],
  );

  const previewResult = React.useMemo(
    () => applyBatchRules(data, selectedRows, columns, rules),
    [data, selectedRows, columns, rules],
  );

  return (
    <Modal
      title="批量编辑效果预览"
      open={open}
      onCancel={onClose}
      onOk={onClose}
      width={640}
      zIndex={1100}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      <div className={styles.batchEditPreviewTable}>
        <table>
          <thead>
            <tr>
              <th>行号</th>
              {rules.map((r) => {
                const col = columns.find((c) => c.key === r.fieldKey);
                return <th key={r.id}>{col?.name ?? r.fieldKey}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {selectedIndices.slice(0, 10).map((i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                {rules.map((r) => {
                  const col = columns.find((c) => c.key === r.fieldKey);
                  const val = previewResult[i]?.[r.fieldKey];
                  return <td key={r.id}>{formatPreviewValue(col, val)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedIndices.length > 10 && (
        <div className={styles.batchEditPreviewMore}>
          仅展示前 10 行，共 {selectedIndices.length} 行
        </div>
      )}
    </Modal>
  );
};

export default BatchEditPreviewModal;
