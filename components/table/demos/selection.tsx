import React, { useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import { Radio, Space, Tag } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  department: string;
}

const columns: ColumnsType<DataType> = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 150 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 150 },
  { title: '住址', dataIndex: 'address', key: 'address' },
];

const data: DataType[] = [
  { key: '1', name: '胡彦斌', age: 32, address: '西湖区湖底公园 1 号', department: '技术部' },
  { key: '2', name: '胡彦祖', age: 28, address: '西湖区湖底公园 2 号', department: '产品部' },
  { key: '3', name: '郑秀妍', age: 45, address: '南山区科技园 3 号', department: '设计部' },
  { key: '4', name: '赵丽颖', age: 36, address: '朝阳区建国路 4 号', department: '市场部' },
  { key: '5', name: '孙七', age: 29, address: '海淀区中关村 5 号', department: '技术部' },
  { key: '6', name: '周八', age: 33, address: '浦东新区张江 6 号', department: '运营部' },
];

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

  const rowSelection = {
    type: selectionType,
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    selections: [
      {
        key: 'all',
        text: '全选',
        onSelect: (changeableRowKeys: React.Key[]) => setSelectedRowKeys(changeableRowKeys),
      },
      {
        key: 'invert',
        text: '反选',
        onSelect: (changeableRowKeys: React.Key[]) => {
          const newKeys = changeableRowKeys.filter(
            (key) => !selectedRowKeys.includes(key),
          );
          setSelectedRowKeys(newKeys);
        },
      },
      {
        key: 'none',
        text: '清空',
        onSelect: () => setSelectedRowKeys([]),
      },
    ],
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Radio.Group
          value={selectionType}
          onChange={(e) => {
            setSelectionType(e.target.value);
            setSelectedRowKeys([]);
          }}
        >
          <Radio.Button value="checkbox">Checkbox</Radio.Button>
          <Radio.Button value="radio">Radio</Radio.Button>
        </Radio.Group>
        <Tag color="blue">已选 {selectedRowKeys.length} 项</Tag>
      </Space>
      <Table<DataType>
        rowSelection={rowSelection as any}
        columns={columns}
        dataSource={data}
      />
    </>
  );
};
