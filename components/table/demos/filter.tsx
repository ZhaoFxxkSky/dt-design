import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Tag, Space, Button } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  department: string;
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    filters: [
      { text: '胡彦斌', value: '胡彦斌' },
      { text: '胡彦祖', value: '胡彦祖' },
      { text: '郑秀妍', value: '郑秀妍' },
      { text: '赵丽颖', value: '赵丽颖' },
    ],
    onFilter: (value, record) => record.name.indexOf(value as string) === 0,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 100,
    align: 'right',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 120,
    filters: [
      { text: '技术部', value: '技术部' },
      { text: '产品部', value: '产品部' },
      { text: '设计部', value: '设计部' },
      { text: '市场部', value: '市场部' },
      { text: '运营部', value: '运营部' },
    ],
    onFilter: (value, record) => record.department === value,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filters: [
      { text: '在职', value: '在职' },
      { text: '离职', value: '离职' },
      { text: '试用期', value: '试用期' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status: string) => {
      const color = status === '在职' ? 'green' : status === '离职' ? 'red' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 300,
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', department: '技术部', status: '在职' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', department: '产品部', status: '在职' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', department: '设计部', status: '在职' },
  { key: '4', name: '赵丽颖', age: 36, address: '朝阳区建国路 4 号', department: '市场部', status: '试用期' },
  { key: '5', name: '孙七', age: 29, address: '海淀区中关村 5 号', department: '技术部', status: '在职' },
  { key: '6', name: '周八', age: 33, address: '浦东新区张江 6 号', department: '运营部', status: '离职' },
  { key: '7', name: '吴九', age: 41, address: '天河区珠江新城 7 号', department: '设计部', status: '在职' },
  { key: '8', name: '郑十', age: 26, address: '武侯区天府大道 8 号', department: '产品部', status: '试用期' },
];

export default () => {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({});

  const handleChange = (_pagination: any, filters: any) => {
    setFilteredInfo(filters);
  };

  const clearFilters = () => {
    setFilteredInfo({});
  };

  const mergedColumns = columns.map((col) => {
    const colKey = (col as any).dataIndex as string | undefined;
    if (colKey) {
      return { ...col, filteredValue: filteredInfo[colKey] || null };
    }
    return col;
  });

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>清除所有筛选</Button>
        <Tag color="blue">点击表头筛选图标</Tag>
        <Tag color="green">支持多列同时筛选</Tag>
      </Space>
      <Table<DataType>
        columns={mergedColumns}
        dataSource={data}
        onChange={handleChange as any}
      />
    </>
  );
};
