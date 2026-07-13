import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  amount: number;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name', align: 'center' },
  { title: '年龄', dataIndex: 'age', key: 'age', align: 'right' },
  { title: '住址', dataIndex: 'address', key: 'address', align: 'left' },
  { title: '金额', dataIndex: 'amount', key: 'amount', align: 'right', render: (v) => `¥${v.toFixed(2)}` },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', amount: 1200.5 },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', amount: 3500.0 },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', amount: 8800.99 },
];

export default () => (
  <Table<DataType> columns={columns} dataSource={data} />
);
