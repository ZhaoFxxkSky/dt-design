import React from 'react';
import { Table } from '@dtjoy/dt-design';
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
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ fontWeight: 600, background: '#fafafa' }}>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>合计</td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }} />
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                ¥{totalSalary.toLocaleString()}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                ¥{totalBonus.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }}
  />
);
