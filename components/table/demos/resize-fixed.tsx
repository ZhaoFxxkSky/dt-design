import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Switch, Typography } from 'antd';

interface RecordType {
  key: string;
  name: string;
  age: number;
  address: string;
  email: string;
  department: string;
  phone: string;
  action: string;
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
    action: '编辑',
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区张江高科技园区',
    email: 'lisi@example.com',
    department: '产品部',
    phone: '13800138002',
    action: '编辑',
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '深圳市南山区科技园南区',
    email: 'wangwu@example.com',
    department: '设计部',
    phone: '13800138003',
    action: '编辑',
  },
  {
    key: '4',
    name: '赵六',
    age: 42,
    address: '杭州市西湖区文三路',
    email: 'zhaoliu@example.com',
    department: '市场部',
    phone: '13800138004',
    action: '编辑',
  },
  {
    key: '5',
    name: '孙七',
    age: 25,
    address: '成都市高新区天府大道',
    email: 'sunqi@example.com',
    department: '运营部',
    phone: '13800138005',
    action: '编辑',
  },
];

export default function Demo() {
  const [bordered, setBordered] = React.useState(true);

  const columns: ColumnsType<RecordType> = React.useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        fixed: 'left',
        resizable: true,
        minWidth: 80,
        maxWidth: 300,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 80,
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
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 100,
        fixed: 'right',
        resizable: true,
        minWidth: 80,
      },
    ],
    [],
  );

  return (
    <div>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        左侧固定列（姓名）和右侧固定列（操作）同样支持拖拽。
        拖拽时竖线限定在表格容器范围内，不会超出表格边界。
        <br />
        <strong>操作提示：</strong>
        试着拖拽最左侧"姓名"列或最右侧"操作"列，观察竖线始终在容器内。
      </Typography.Paragraph>

      <div style={{ marginBottom: 12 }}>
        <Switch
          checked={bordered}
          onChange={setBordered}
          checkedChildren="边框"
          unCheckedChildren="无边框"
        />
      </div>

      <Table<RecordType>
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        bordered={bordered}
        resizable
        scroll={{ x: 1200, y: 300 }}
      />
    </div>
  );
}
