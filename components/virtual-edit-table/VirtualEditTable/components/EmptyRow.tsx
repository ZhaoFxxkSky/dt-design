import { Empty } from 'antd';
import React from 'react';
import styles from '../style.less';

const EmptyRow: React.FC = () => (
  <div className={styles.emptyState}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
  </div>
);

export default EmptyRow;
