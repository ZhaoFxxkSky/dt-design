import React from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  longText: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 80, align: 'right' },
  { title: '住址', dataIndex: 'address', key: 'address', ellipsis: true },
  { title: '长文本说明', dataIndex: 'longText', key: 'longText', ellipsis: true, width: 200 },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', longText: '这是一段很长的文本内容，用来测试 ellipsis 省略功能在表格列中的显示效果是否正常' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', longText: '另一段超长文本内容，同样用于验证省略号截断行为是否符合预期' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', longText: '第三条长文本，包含 ellipsis 关键词的测试数据' },
];

export default () => (
  <Table<DataType> columns={columns} dataSource={data} />
);
