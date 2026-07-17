import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Space, Switch, Typography } from 'antd';

interface RecordType {
  key: string;
  name: string;
  age: number;
  address: string;
  email: string;
  department: string;
  phone: string;
}

const dataSource: RecordType[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区建国路88号',
    email: 'zhangsan@example.com',
    department: '技术部',
    phone: '13800138001',
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区张江高科技园区',
    email: 'lisi@example.com',
    department: '产品部',
    phone: '13800138002',
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '深圳市南山区科技园南区',
    email: 'wangwu@example.com',
    department: '设计部',
    phone: '13800138003',
  },
  {
    key: '4',
    name: '赵六',
    age: 42,
    address: '杭州市西湖区文三路',
    email: 'zhaoliu@example.com',
    department: '市场部',
    phone: '13800138004',
  },
  {
    key: '5',
    name: '孙七',
    age: 25,
    address: '成都市高新区天府大道',
    email: 'sunqi@example.com',
    department: '运营部',
    phone: '13800138005',
  },
];

export default function Demo() {
  const [virtual, setVirtual] = React.useState(false);

  const columns: ColumnsType<RecordType> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      fixed: 'left',
      resizable: true,
      minWidth: 80,
      maxWidth: 300,
      onResize: () => {},
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      resizable: true,
      minWidth: 60,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      resizable: true,
      minWidth: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      resizable: true,
      minWidth: 80,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      resizable: true,
      minWidth: 80,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      resizable: true,
      minWidth: 80,
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Switch
          checked={virtual}
          onChange={setVirtual}
          checkedChildren="虚拟滚动"
          unCheckedChildren="普通模式"
        />
      </Space>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        鼠标移动到表头列的右边框，会出现蓝色高亮粗边框。按住拖动时显示蓝色竖线指示器（不改变列宽），
        松开鼠标后列宽才会改变。拖拽过程中 hover 高亮自动隐藏。
        {virtual ? '虚拟滚动模式下同样有效。' : ''}
      </Typography.Paragraph>
      <Table<RecordType>
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1200, y: 300 }}
        resizable
        virtual={virtual}
        onColumnResize={() => {}}
      />
    </div>
  );
}
