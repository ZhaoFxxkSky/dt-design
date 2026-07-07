import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Button, Descriptions, Tag, Space } from 'antd';

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
  status: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
    fixed: 'left',
    sorter: (a, b) => a.name.localeCompare(b.name),
    filters: [
      { text: '胡彦斌', value: '胡彦斌' },
      { text: '郑秀妍', value: '郑秀妍' },
      { text: '孙七', value: '孙七' },
    ],
    onFilter: (value, record) => record.name.indexOf(value as string) === 0,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80,
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
    ],
    onFilter: (value, record) => record.department === value,
  },
  { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
  {
    title: '薪资（元/月）',
    dataIndex: 'salary',
    key: 'salary',
    width: 130,
    align: 'right',
    sorter: (a, b) => a.salary - b.salary,
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  {
    title: '奖金（元/年）',
    dataIndex: 'bonus',
    key: 'bonus',
    width: 130,
    align: 'right',
    render: (val: number) => `¥${val.toLocaleString()}`,
  },
  { title: '入职日期', dataIndex: 'entryDate', key: 'entryDate', width: 120 },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status: string) => {
      const color = status === '在职' ? 'green' : status === '离职' ? 'red' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  { title: '住址', dataIndex: 'address', key: 'address', width: 250, ellipsis: true },
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
  { key: '1', name: '胡彦斌', age: 32, address: '浙江省杭州市西湖区文三路 138 号西湖国际科技大厦 A 座 1001 室', department: '技术部', role: '前端工程师', email: 'huyanbin@example.com', phone: '13800138001', salary: 15000, bonus: 30000, entryDate: '2021-03-15', status: '在职' },
  { key: '2', name: '胡彦祖', age: 28, address: '浙江省杭州市西湖区文三路 199 号黄龙国际中心 B 座 2002 室', department: '产品部', role: '高级产品经理', email: 'huyanzu@example.com', phone: '13800138002', salary: 12000, bonus: 25000, entryDate: '2022-07-01', status: '在职' },
  { key: '3', name: '郑秀妍', age: 45, address: '广东省深圳市南山区科技园南区高新南一道 9 号 R&D 大厦 3 楼', department: '设计部', role: '设计总监', email: 'zhengxiuyan@example.com', phone: '13800138003', salary: 25000, bonus: 50000, entryDate: '2018-01-10', status: '在职' },
  { key: '4', name: '赵丽颖', age: 36, address: '北京市朝阳区建国路 88 号 SOHO 现代城 A 座 3005 室', department: '市场部', role: '市场总监', email: 'zhaoliying@example.com', phone: '13800138004', salary: 18000, bonus: 35000, entryDate: '2019-11-20', status: '在职' },
  { key: '5', name: '孙七', age: 29, address: '北京市海淀区中关村大街 27 号中关村大厦 15 层 1502', department: '技术部', role: '后端工程师', email: 'sunqi@example.com', phone: '13800138005', salary: 20000, bonus: 40000, entryDate: '2020-06-08', status: '在职' },
  { key: '6', name: '周八', age: 33, address: '上海市浦东新区张江高科技园区科苑路 88 号 3 号楼 201 室', department: '产品部', role: '运营经理', email: 'zhouba@example.com', phone: '13800138006', salary: 16000, bonus: 32000, entryDate: '2021-09-15', status: '离职' },
];

export default () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <>
      <p style={{ marginBottom: 12 }}>
        <Tag color="blue">固定列</Tag>
        <Tag color="green">排序</Tag>
        <Tag color="orange">筛选</Tag>
        <Tag color="purple">行展开</Tag>
        <Tag color="cyan">行选择</Tag>
        <Tag color="red">合计行</Tag>
        <Tag color="geekblue">固定表头</Tag>
        <Tag color="magenta">10 列横向滚动</Tag>
      </p>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        scroll={{ x: 1500, y: 300 }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        } as any}
        expandable={{
          expandedRowRender: (record: DataType) => (
            <Descriptions size="small" column={3} bordered>
              <Descriptions.Item label="姓名">{record.name}</Descriptions.Item>
              <Descriptions.Item label="年龄">{record.age}</Descriptions.Item>
              <Descriptions.Item label="部门">{record.department}</Descriptions.Item>
              <Descriptions.Item label="角色">{record.role}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{record.email}</Descriptions.Item>
              <Descriptions.Item label="电话">{record.phone}</Descriptions.Item>
              <Descriptions.Item label="入职日期">{record.entryDate}</Descriptions.Item>
              <Descriptions.Item label="状态">{record.status}</Descriptions.Item>
              <Descriptions.Item label="住址">{record.address}</Descriptions.Item>
            </Descriptions>
          ),
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),
        }}
        summary={(data: readonly DataType[]) => {
          const totalSalary = data.reduce((sum: number, item: DataType) => sum + item.salary, 0);
          const totalBonus = data.reduce((sum: number, item: DataType) => sum + item.bonus, 0);
          return (
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <tbody>
                <tr style={{ fontWeight: 600, background: '#fafafa' }}>
                  <td style={{ padding: '12px 16px', width: 120 }}>合计</td>
                  <td style={{ padding: '12px 16px', width: 80 }} />
                  <td style={{ padding: '12px 16px', width: 120 }} />
                  <td style={{ padding: '12px 16px', width: 120 }} />
                  <td style={{ padding: '12px 16px', width: 130 }}>¥{totalSalary.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', width: 130 }}>¥{totalBonus.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', width: 120 }} />
                  <td style={{ padding: '12px 16px', width: 80 }} />
                  <td style={{ padding: '12px 16px' }} />
                  <td style={{ padding: '12px 16px', width: 140 }} />
                </tr>
              </tbody>
            </table>
          );
        }}
      />
    </>
  );
};
