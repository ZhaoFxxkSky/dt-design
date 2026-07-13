import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  status: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '状态', dataIndex: 'status', key: 'status' },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, status: '在线' },
  { key: '2', name: '胡彦祖', age: 28, status: '离线' },
  { key: '3', name: '郑秀妍', age: 45, status: '在线' },
  { key: '4', name: '赵丽颖', age: 36, status: '忙碌' },
];

export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={data}
    rowClassName={(record: DataType, index: number) => {
      if (record.status === '在线') return 'row-online';
      if (index % 2 === 0) return 'row-even';
      return '';
    }}
    style={
      {
        // 在线状态的行会高亮显示，偶数行会有不同背景色
      } as React.CSSProperties
    }
  />
);
