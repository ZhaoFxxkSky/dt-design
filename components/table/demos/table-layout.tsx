import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Radio, Space } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  longText: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    ellipsis: true,
  },
  {
    title: '长文本说明',
    dataIndex: 'longText',
    key: 'longText',
    width: 300,
    ellipsis: true,
  },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', longText: '这是一段很长的文本内容用来测试 tableLayout fixed 模式下列宽是否固定不随内容变化' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', longText: '短文本' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', longText: '中等长度的文本内容测试' },
];

export default () => {
  const [layout, setLayout] = useState<'auto' | 'fixed'>('fixed');

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <span>tableLayout：</span>
        <Radio.Group value={layout} onChange={(e) => setLayout(e.target.value)}>
          <Radio.Button value="fixed">fixed（固定列宽）</Radio.Button>
          <Radio.Button value="auto">auto（自动列宽）</Radio.Button>
        </Radio.Group>
      </Space>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        tableLayout={layout}
        scroll={{ x: 700 }}
      />
    </>
  );
};
