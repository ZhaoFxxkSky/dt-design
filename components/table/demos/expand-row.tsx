import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Descriptions } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '住址', dataIndex: 'address', key: 'address' },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', email: 'zhangsan@example.com', phone: '13800138001' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', email: 'lisi@example.com', phone: '13800138002' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', email: 'wangwu@example.com', phone: '13800138003' },
  { key: '4', name: '赵丽颖', age: 36, address: '朝阳区建国路 4 号', email: 'zhaoliu@example.com', phone: '13800138004' },
];

export default () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  return (
    <Table<DataType>
      columns={columns}
      dataSource={data}
      expandable={{
        expandedRowRender: (record: DataType) => (
          <Descriptions size="small" column={2} bordered>
            <Descriptions.Item label="姓名">{record.name}</Descriptions.Item>
            <Descriptions.Item label="年龄">{record.age}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{record.email}</Descriptions.Item>
            <Descriptions.Item label="电话">{record.phone}</Descriptions.Item>
            <Descriptions.Item label="住址" span={2}>{record.address}</Descriptions.Item>
          </Descriptions>
        ),
        expandedRowKeys: expandedKeys,
        onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),
      }}
    />
  );
};
