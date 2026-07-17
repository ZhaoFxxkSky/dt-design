import React from 'react';
import { Summary, Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  salary: number;
  bonus: number;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  {
    title: '薪资（元）',
    dataIndex: 'salary',
    key: 'salary',
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  {
    title: '奖金（元）',
    dataIndex: 'bonus',
    key: 'bonus',
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, salary: 15000, bonus: 3000 },
  { key: '2', name: '胡彦祖', age: 28, salary: 12000, bonus: 2500 },
  { key: '3', name: '郑秀妍', age: 45, salary: 25000, bonus: 5000 },
  { key: '4', name: '赵丽颖', age: 36, salary: 18000, bonus: 3500 },
  { key: '5', name: '孙七', age: 29, salary: 20000, bonus: 4000 },
];

export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={data}
    summary={(data: readonly DataType[]) => {
      const totalSalary = data.reduce((sum: number, item: DataType) => sum + item.salary, 0);
      const totalBonus = data.reduce((sum: number, item: DataType) => sum + item.bonus, 0);
      return (
        <Summary.Row>
          <Summary.Cell index={0}>合计</Summary.Cell>
          <Summary.Cell index={1} />
          <Summary.Cell index={2}>¥{totalSalary.toLocaleString()}</Summary.Cell>
          <Summary.Cell index={3}>¥{totalBonus.toLocaleString()}</Summary.Cell>
        </Summary.Row>
      );
    }}
  />
);
