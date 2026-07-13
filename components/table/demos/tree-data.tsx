import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '住址', dataIndex: 'address', key: 'address' },
];

const data: DataType[] = [
  {
    key: '1',
    name: '技术部',
    age: 120,
    address: '杭州',
    children: [
      {
        key: '1-1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园 1 号',
        children: [
          { key: '1-1-1', name: '胡彦斌助理', age: 25, address: '西湖区湖底公园 1-1 号' },
        ],
      },
      {
        key: '1-2',
        name: '胡彦祖',
        age: 28,
        address: '西湖区湖底公园 2 号',
      },
    ],
  },
  {
    key: '2',
    name: '产品部',
    age: 85,
    address: '深圳',
    children: [
      {
        key: '2-1',
        name: '郑秀妍',
        age: 35,
        address: '南山区科技园 3 号',
      },
      {
        key: '2-2',
        name: '赵丽颖',
        age: 30,
        address: '南山区科苑路 5 号',
      },
    ],
  },
  {
    key: '3',
    name: '设计部独立小组',
    age: 40,
    address: '北京',
  },
];

export default () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['1']);

  return (
    <Table<DataType>
      columns={columns}
      dataSource={data}
      rowKey="key"
      expandable={{
        childrenColumnName: 'children',
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange: (keys) => setExpandedKeys([...keys]),
        defaultExpandAllRows: false,
      }}
    />
  );
};
