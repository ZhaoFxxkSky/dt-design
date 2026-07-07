import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园 1 号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 28,
    address: '西湖区湖底公园 2 号',
  },
  {
    key: '3',
    name: '郑秀妍',
    age: 45,
    address: '南山区科技园 3 号',
  },
  {
    key: '4',
    name: '赵丽颖',
    age: 36,
    address: '朝阳区建国路 4 号',
  },
];

export default () => <Table<DataType> columns={columns} dataSource={data} />;
