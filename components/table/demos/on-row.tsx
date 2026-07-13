import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { message } from 'antd';

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
  { key: '4', name: '赵丽颖', age: 36, address: '朝阳区建国路 4 号' },
];

export default () => {
  const [selectedRowKey, setSelectedRowKey] = useState<string>('');

  return (
    <>
      <p style={{ marginBottom: 8, color: 'rgba(0,0,0,0.45)' }}>
        {selectedRowKey
          ? `当前选中的行 key 为 ${selectedRowKey}，请尝试点击、双击或右键行`
          : '请尝试点击、双击或右键行来触发行事件'}
      </p>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        onRow={((record: DataType, index: number) => ({
          onClick: () => {
            setSelectedRowKey(record.key);
            message.info(`点击了行：${record.name}`);
          },
          onDoubleClick: () => {
            message.success(`双击了行：${record.name}，索引为 ${index}`);
          },
          onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            message.warning(`右键点击了行：${record.name}`);
          },
        })) as any}
      />
    </>
  );
};
