import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Tag } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  status: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    render: (age: number) => <span style={{ fontWeight: 600 }}>{age} 岁</span>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const color = status === '在线' ? 'green' : status === '离线' ? 'gray' : 'orange';
      return <Tag color={color}>{status}</Tag>;
    },
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    render: (tags: string[]) => (
      <span>
        {tags.map((tag) => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        ))}
      </span>
    ),
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, status: '在线', tags: ['优秀员工', 'VIP'] },
  { key: '2', name: '胡彦祖', age: 28, status: '离线', tags: ['新人'] },
  { key: '3', name: '郑秀妍', age: 45, status: '忙碌', tags: ['优秀员工'] },
  { key: '4', name: '赵丽颖', age: 36, status: '在线', tags: ['VIP'] },
];

export default () => <Table<DataType> columns={columns} dataSource={data} />;
