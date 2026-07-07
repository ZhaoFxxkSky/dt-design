import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Button, Space, Tag } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  salary: number;
  bonus: number;
  entryDate: string;
  remark: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    fixed: 'left',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80,
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 120,
  },
  {
    title: '邮箱地址',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 140,
  },
  {
    title: '薪资（元/月）',
    dataIndex: 'salary',
    key: 'salary',
    width: 140,
    align: 'right',
    sorter: (a, b) => a.salary - b.salary,
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  {
    title: '奖金（元/年）',
    dataIndex: 'bonus',
    key: 'bonus',
    width: 140,
    align: 'right',
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  {
    title: '入职日期',
    dataIndex: 'entryDate',
    key: 'entryDate',
    width: 120,
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 300,
    ellipsis: true,
  },
  {
    title: '备注说明',
    dataIndex: 'remark',
    key: 'remark',
    width: 300,
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    fixed: 'right',
    render: () => (
      <Space size="small">
        <Button type="link" size="small">编辑</Button>
        <Button type="link" size="small" danger>删除</Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '浙江省杭州市西湖区文三路 138 号西湖国际科技大厦 A 座 1001 室', department: '技术部', role: '前端工程师', email: 'huyanbin@example.com', phone: '13800138001', salary: 15000, bonus: 30000, entryDate: '2021-03-15', remark: '核心骨干员工，负责前端架构设计和技术选型，多次获得最佳员工奖' },
  { key: '2', name: '胡彦祖', age: 28, address: '浙江省杭州市西湖区文三路 199 号黄龙国际中心 B 座 2002 室', department: '产品部', role: '高级产品经理', email: 'huyanzu@example.com', phone: '13800138002', salary: 12000, bonus: 25000, entryDate: '2022-07-01', remark: '主导多个核心产品线规划，擅长用户研究和数据分析' },
  { key: '3', name: '郑秀妍', age: 45, address: '广东省深圳市南山区科技园南区高新南一道 9 号 R&D 大厦 3 楼', department: '设计部', role: '设计总监', email: 'zhengxiuyan@example.com', phone: '13800138003', salary: 25000, bonus: 50000, entryDate: '2018-01-10', remark: '十年以上设计经验，带领团队完成多次重大品牌升级' },
  { key: '4', name: '赵丽颖', age: 36, address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 3005 室', department: '市场部', role: '市场总监', email: 'zhaoliying@example.com', phone: '13800138004', salary: 18000, bonus: 35000, entryDate: '2019-11-20', remark: '负责品牌推广和市场营销策略制定，业绩突出' },
  { key: '5', name: '孙七', age: 29, address: '北京市海淀区中关村大街 27 号中关村大厦 15 层 1502', department: '技术部', role: '后端工程师', email: 'sunqi@example.com', phone: '13800138005', salary: 20000, bonus: 40000, entryDate: '2020-06-08', remark: '微服务架构专家，负责高并发系统设计和优化' },
  { key: '6', name: '周八', age: 33, address: '上海市浦东新区张江高科技园区科苑路 88 号 3 号楼 201 室', department: '运营部', role: '运营经理', email: 'zhouba@example.com', phone: '13800138006', salary: 16000, bonus: 32000, entryDate: '2021-09-15', remark: '精细化运营专家，擅长用户增长和留存策略' },
];

export default () => (
  <>
    <p style={{ marginBottom: 12 }}>
      <Tag color="blue">固定左侧列</Tag>
      <Tag color="green">固定右侧列</Tag>
      <Tag color="orange">12 列横向滚动</Tag>
      <Tag color="purple">scroll.x = 2000</Tag>
    </p>
    <Table<DataType>
      columns={columns}
      dataSource={data}
      scroll={{ x: 2000 }}
    />
  </>
);
