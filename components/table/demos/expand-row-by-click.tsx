import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Tag } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  details: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '住址', dataIndex: 'address', key: 'address' },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', details: '这是胡彦斌的详细信息，包含工作经验和项目经历等' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', details: '这是胡彦祖的详细信息，包含工作经验和项目经历等' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', details: '这是郑秀妍的详细信息，包含 10 年工作经验' },
  { key: '4', name: '赵丽颖', age: 36, address: '朝阳区建国路 4 号', details: '这是赵丽颖的详细信息，包含工作经验和项目经历等' },
];

export default () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['1']);

  return (
    <>
      <p style={{ marginBottom: 8, color: 'rgba(0,0,0,0.45)' }}>
        <Tag color="blue">提示</Tag>
        设置 expandRowByClick 后，点击行即可展开/收起展开内容
      </p>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record: DataType) => (
            <div style={{ padding: '8px 16px', background: '#fafafa' }}>
              <strong>详细信息：</strong>
              {record.details}
            </div>
          ),
          expandRowByClick: true,
          expandedRowKeys: expandedKeys,
          onExpandedRowsChange: (keys: readonly React.Key[]) => setExpandedKeys([...keys]),
        }}
      />
    </>
  );
};
