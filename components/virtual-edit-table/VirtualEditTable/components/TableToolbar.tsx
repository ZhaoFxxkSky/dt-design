import React from 'react';
import { Button } from 'antd';
import styles from '../style.less';

export type TableToolbarProps = {
  title?: string;
  editable?: boolean;
  addable?: boolean;
  hasSelection: boolean;
  extraActions?: React.ReactNode;
  onAdd: () => void;
  onBatchEdit?: () => void;
  onBatchDelete?: () => void;
};

const TableToolbar: React.FC<TableToolbarProps> = ({
  title,
  editable = true,
  addable = true,
  hasSelection,
  extraActions,
  onAdd,
  onBatchEdit,
  onBatchDelete,
}) => (
  <div className={styles.toolbar}>
    <div className={styles.toolbarLeft}>{title && <span className={styles.title}>{title}</span>}</div>
    <div className={styles.toolbarActions}>
      {editable && addable && (
        <Button type="primary" size="small" onClick={onAdd}>
          新增
        </Button>
      )}
      {editable && hasSelection && (
        <>
          <Button size="small" onClick={onBatchEdit}>
            批量编辑
          </Button>
          <Button danger size="small" onClick={onBatchDelete}>
            批量删除
          </Button>
        </>
      )}
      {extraActions}
    </div>
  </div>
);

export default TableToolbar;
