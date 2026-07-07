import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Tag, Space, Button } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  salary: number;
  entryDate: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 100,
    align: 'right',
    sorter: (a, b) => a.age - b.age,
    defaultSortOrder: 'ascend',
  },
  {
    title: '薪资（元）',
    dataIndex: 'salary',
    key: 'salary',
    width: 150,
    align: 'right',
    sorter: (a, b) => a.salary - b.salary,
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  {
    title: '入职日期',
    dataIndex: 'entryDate',
    key: 'entryDate',
    width: 140,
    sorter: (a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime(),
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 300,
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', salary: 15000, entryDate: '2021-03-15' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', salary: 12000, entryDate: '2022-07-01' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', salary: 25000, entryDate: '2018-01-10' },
  { key: '4', name: '赵丽颖', age: 36, address: '朝阳区建国路 4 号', salary: 18000, entryDate: '2019-11-20' },
  { key: '5', name: '孙七', age: 29, address: '海淀区中关村 5 号', salary: 20000, entryDate: '2020-06-08' },
  { key: '6', name: '周八', age: 33, address: '浦东新区张江 6 号', salary: 16000, entryDate: '2021-09-15' },
  { key: '7', name: '吴九', age: 41, address: '天河区珠江新城 7 号', salary: 22000, entryDate: '2017-04-22' },
  { key: '8', name: '郑十', age: 26, address: '武侯区天府大道 8 号', salary: 11000, entryDate: '2023-02-14' },
];

export default () => {
  const [sortedInfo, setSortedInfo] = useState<{ columnKey?: React.Key; order?: string }>({});

  const handleChange = (_pagination: any, _filters: any, sorter: any) => {
    setSortedInfo(sorter);
  };

  const mergedColumns = columns.map((col) => {
    if (col.key === sortedInfo.columnKey) {
      return { ...col, sortOrder: sortedInfo.order as any };
    }
    return col;
  });

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={() => setSortedInfo({})}
        >
          重置排序
        </Button>
        <Tag color="blue">点击表头排序</Tag>
        <Tag color="green">支持多列排序方向</Tag>
      </Space>
      <Table<DataType>
        columns={mergedColumns}
        dataSource={data}
        onChange={handleChange as any}
        sortDirections={['ascend', 'descend', 'ascend']}
      />
    </>
  );
};
