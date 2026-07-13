import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType, SizeType } from '@dtjoy/dt-design';
import { Radio } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '住址', dataIndex: 'address', key: 'address' },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号' },
];

export default () => {
  const [size, setSize] = useState<SizeType>('large');

  return (
    <div>
      <Radio.Group value={size} onChange={(e) => setSize(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="large">大</Radio.Button>
        <Radio.Button value="middle">中</Radio.Button>
        <Radio.Button value="small">小</Radio.Button>
      </Radio.Group>
      <Table<DataType> columns={columns} dataSource={data} size={size} />
    </div>
  );
};
