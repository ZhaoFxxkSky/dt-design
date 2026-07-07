import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  tel: string;
  phone: string;
  address: string;
}

// 共享 render 函数 — 返回包含 colSpan/rowSpan 的对象
const renderContent = (text: string, row: number, col: number) => {
  const obj: { children: React.ReactNode; props: { colSpan?: number; rowSpan?: number } } = {
    children: text,
    props: {},
  };
  // 第一行 name 跨 2 行
  if (row === 0 && col === 0) {
    obj.props.rowSpan = 2;
  }
  // 第二行 name 被占用
  if (row === 1 && col === 0) {
    obj.props.rowSpan = 0;
  }
  // 第三行 name 跨 3 行
  if (row === 2 && col === 0) {
    obj.props.rowSpan = 3;
  }
  // 第四、五行 name 被占用
  if ((row === 3 || row === 4) && col === 0) {
    obj.props.rowSpan = 0;
  }
  // 第一行 address 跨 2 列
  if (row === 0 && col === 4) {
    obj.props.colSpan = 2;
  }
  // 第一行 phone 被占用
  if (row === 0 && col === 5) {
    obj.props.colSpan = 0;
  }
  return obj;
};

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    render: (text, _record, index) => renderContent(text, index, 0) as any,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80,
    render: (text, _record, index) => renderContent(text, index, 1) as any,
  },
  {
    title: '座机',
    dataIndex: 'tel',
    key: 'tel',
    width: 140,
    render: (text, _record, index) => renderContent(text, index, 2) as any,
  },
  {
    title: '手机',
    dataIndex: 'phone',
    key: 'phone',
    width: 140,
    render: (text, _record, index) => renderContent(text, index, 3) as any,
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 250,
    render: (text, _record, index) => renderContent(text, index, 4) as any,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 200,
    render: (text, _record, index) => renderContent(text || '—', index, 5) as any,
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, tel: '0571-12345678', phone: '13800138001', address: '西湖区湖底公园 1 号' },
  { key: '2', name: '胡彦祖', age: 28, tel: '0571-87654321', phone: '13800138002', address: '西湖区湖底公园 2 号' },
  { key: '3', name: '郑秀妍', age: 45, tel: '0755-12345678', phone: '13800138003', address: '南山区科技园 3 号' },
  { key: '4', name: '赵丽颖', age: 36, tel: '010-12345678', phone: '13800138004', address: '朝阳区建国路 4 号' },
  { key: '5', name: '孙七', age: 29, tel: '010-87654321', phone: '13800138005', address: '海淀区中关村 5 号' },
];

export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={data}
    bordered
  />
);
