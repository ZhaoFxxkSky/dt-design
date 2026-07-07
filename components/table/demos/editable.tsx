import React from 'react';
import { Button, Space, message } from 'antd';
import { Table } from '../index';

interface RecordType {
  key: string;
  name: string;
  age: number | undefined;
  email: string;
  department: string;
}

const initialData: RecordType[] = [
  { key: '1', name: '张三', age: 32, email: 'zhangsan@example.com', department: '技术部' },
  { key: '2', name: '', age: undefined, email: 'invalid-email', department: '' },
  { key: '3', name: '王五', age: 35, email: 'wangwu@example.com', department: '设计部' },
  { key: '4', name: '赵六', age: -5, email: 'zhaoliu@example.com', department: '市场部' },
];

export default function Demo() {
  const [data, setData] = React.useState<RecordType[]>(initialData);
  const tableRef = React.useRef<any>(null);

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      editable: {
        editable: true,
        required: true,
        editor: 'input' as const,
        rules: [
          {
            validator: (value: any) => {
              if (value && value.length < 2) return '姓名至少2个字符';
              return undefined;
            },
          },
        ],
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 120,
      editable: {
        editable: true,
        required: true,
        editor: 'input-number' as const,
        editorProps: { min: 0, max: 150 },
        rules: [
          {
            validator: (value: any) => {
              if (value != null && value < 0) return '年龄不能为负数';
              if (value != null && value > 150) return '年龄不能超过150';
              return undefined;
            },
          },
        ],
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      editable: {
        editable: true,
        required: true,
        editor: 'input' as const,
        rules: [
          {
            validator: (value: any) => {
              if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '邮箱格式不正确';
              return undefined;
            },
          },
        ],
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      editable: {
        editable: true,
        required: true,
        editor: 'select' as const,
        options: [
          { label: '技术部', value: '技术部' },
          { label: '产品部', value: '产品部' },
          { label: '设计部', value: '设计部' },
          { label: '市场部', value: '市场部' },
          { label: '运营部', value: '运营部' },
        ],
      },
    },
  ];

  const handleValidate = () => {
    const result = tableRef.current?.validate();
    if (result?.valid) {
      message.success('校验通过！');
    } else {
      message.error(`发现 ${result?.errors.size ?? 0} 个错误，已自动滚动到第一个错误行`);
    }
  };

  const handleReset = () => {
    tableRef.current?.resetErrors();
    setData(initialData);
  };

  return (
    <div>
      <p style={{ marginBottom: 12, color: '#666' }}>
        点击单元格可直接编辑。点击「校验」按钮会校验所有数据，错误行会自动滚动定位，鼠标聚焦错误单元格会弹出 Popover 提示。
      </p>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={handleValidate}>校验全部</Button>
        <Button onClick={handleReset}>重置</Button>
      </Space>
      <Table<RecordType>
        ref={tableRef}
        columns={columns as any}
        dataSource={data}
        rowKey="key"
        editable
        onEditableChange={(newData) => setData(newData as RecordType[])}
        scroll={{ y: 300 }}
      />
    </div>
  );
}
