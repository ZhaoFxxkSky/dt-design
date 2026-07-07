import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Empty } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
];

export default () => (
  <>
    <h4 style={{ marginBottom: 8 }}>默认空状态</h4>
    <Table<DataType> columns={columns} dataSource={[]} style={{ marginBottom: 24 }} />
    <h4 style={{ marginBottom: 8 }}>自定义空状态文案</h4>
    <Table<DataType>
      columns={columns}
      dataSource={[]}
      locale={{ emptyText: <Empty description="暂无数据" /> }}
    />
  </>
);
