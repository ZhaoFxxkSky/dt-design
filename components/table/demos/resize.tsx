import React from 'react';
import { Table } from '../index';

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
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区建国路88号', email: 'zhangsan@example.com', department: '技术部', phone: '13800138001' },
  { key: '2', name: '李四', age: 28, address: '上海市浦东新区张江高科技园区', email: 'lisi@example.com', department: '产品部', phone: '13800138002' },
  { key: '3', name: '王五', age: 35, address: '深圳市南山区科技园南区', email: 'wangwu@example.com', department: '设计部', phone: '13800138003' },
  { key: '4', name: '赵六', age: 42, address: '杭州市西湖区文三路', email: 'zhaoliu@example.com', department: '市场部', phone: '13800138004' },
  { key: '5', name: '孙七', age: 25, address: '成都市高新区天府大道', email: 'sunqi@example.com', department: '运营部', phone: '13800138005' },
];

export default function Demo() {
  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120, resize: { resizable: true, minWidth: 80, maxWidth: 300 } },
    { title: '年龄', dataIndex: 'age', key: 'age', width: 100, resize: { resizable: true, minWidth: 60 } },
    { title: '地址', dataIndex: 'address', key: 'address', width: 250, resize: { resizable: true, minWidth: 100 } },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 200, resize: { resizable: true, minWidth: 80 } },
    { title: '部门', dataIndex: 'department', key: 'department', width: 120, resize: { resizable: true, minWidth: 80 } },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 150, resize: { resizable: true, minWidth: 80 } },
  ];

  return (
    <div>
      <p style={{ marginBottom: 12, color: '#666' }}>
        鼠标移动到表头列的右边框，会出现蓝色高亮粗边框，按住拖动可调整列宽。拖动过程中显示蓝色竖线指示器，松开鼠标后列宽才会改变。
      </p>
      <Table<RecordType>
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1200 }}
        resizable
        onColumnResize={(key, width) => {
          console.log('列宽调整:', key, width);
        }}
      />
    </div>
  );
}
