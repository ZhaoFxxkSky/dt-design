import { Radio, Space, Typography } from 'antd';
import type { TableProps } from '@dtjoy/dt-design';
import { Table } from '@dtjoy/dt-design';
import React from 'react';

interface RecordType {
  id: number;
  name: string;
  department: string;
  position: string;
  salary: number;
  email: string;
}

const columns: TableProps<RecordType>['columns'] = [
  { title: 'ID', dataIndex: 'id', width: 80, fixed: 'start', resizable: true },
  { title: '姓名', dataIndex: 'name', width: 120, fixed: 'start', resizable: true },
  { title: '部门', dataIndex: 'department', width: 140, resizable: true },
  { title: '职位', dataIndex: 'position', width: 140, resizable: true },
  { title: '薪资', dataIndex: 'salary', width: 140, align: 'right', resizable: true },
  { title: '邮箱', dataIndex: 'email', resizable: true },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'end',
    render: () => <Typography.Link>编辑</Typography.Link>,
  },
];

const data: RecordType[] = Array.from({ length: 1000 }, (_, i) => ({
  id: 1000 + i,
  name: `员工_${i + 1}`,
  department: ['技术部', '产品部', '设计部', '运营部'][i % 4],
  position: ['工程师', '经理', '总监', '主管'][i % 4],
  salary: 15000 + (i % 20) * 1000,
  email: `user${i + 1}@example.com`,
}));

const App: React.FC = () => {
  const [direction, setDirection] = React.useState<'ltr' | 'rtl'>('ltr');

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        optionType="button"
        buttonStyle="solid"
        options={[
          { label: 'LTR 从左到右', value: 'ltr' },
          { label: 'RTL 从右到左', value: 'rtl' },
        ]}
      />
      <Table<RecordType>
        bordered
        virtual
        resizable
        direction={direction}
        columns={columns}
        dataSource={data}
        rowKey="id"
        scroll={{ x: 1200, y: 400 }}
        pagination={false}
        rowSelection={{ type: 'checkbox', fixed: 'start' }}
      />
    </Space>
  );
};

export default App;
