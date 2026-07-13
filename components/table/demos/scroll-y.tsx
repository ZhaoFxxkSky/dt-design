import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  department: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 150 },
  { title: '住址', dataIndex: 'address', key: 'address', width: 250 },
];

function generateData(count: number): DataType[] {
  const departments = ['技术部', '产品部', '设计部', '市场部', '运营部'];
  const names = ['胡彦斌', '胡彦祖', '郑秀妍', '赵丽颖', '孙七', '周八', '吴九', '郑十', '王十一', '李十二'];
  return Array.from({ length: count }, (_, i) => ({
    key: String(i + 1),
    name: `${names[i % names.length]}-${i + 1}`,
    age: 20 + (i % 40),
    department: departments[i % departments.length],
    address: `地址 ${i + 1} 号`,
  }));
}

export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={generateData(50)}
    scroll={{ y: 300 }}
  />
);
