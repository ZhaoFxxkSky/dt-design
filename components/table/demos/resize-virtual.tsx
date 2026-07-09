import React from 'react';
import { Table } from '../index';
import type { ColumnsType } from '../index';
import { Segmented, Space, Typography } from 'antd';

interface RecordType {
  key: string;
  id: number;
  name: string;
  age: number;
  address: string;
  email: string;
  department: string;
}

const generateData = (count: number): RecordType[] =>
  Array.from({ length: count }, (_, i) => ({
    key: String(i),
    id: 1000 + i,
    name: `员工_${i + 1}`,
    age: 22 + (i % 30),
    address: `${['北京', '上海', '深圳', '杭州', '广州'][i % 5]}市XX路${i + 1}号`,
    email: `employee${i + 1}@company.com`,
    department: ['技术部', '产品部', '设计部', '市场部', '运营部'][i % 5],
  }));

export default function Demo() {
  const [virtual, setVirtual] = React.useState(true);
  const [dataCount, setDataCount] = React.useState(1000);

  const data = React.useMemo(() => generateData(dataCount), [dataCount]);

  const columns: ColumnsType<RecordType> = React.useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        fixed: 'left',
        resizable: true,
        minWidth: 60,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        fixed: 'left',
        resizable: true,
        minWidth: 80,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 80,
        resizable: true,
        minWidth: 60,
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 250,
        resizable: true,
        minWidth: 100,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        resizable: true,
        minWidth: 80,
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        width: 120,
        resizable: true,
        minWidth: 80,
      },
    ],
    [],
  );

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 12 }}>
        <Space wrap>
          <Segmented
            value={String(virtual)}
            onChange={(val) => setVirtual(val === 'true')}
            options={[
              { label: '虚拟滚动', value: 'true' },
              { label: '普通模式', value: 'false' },
            ]}
          />
          <Segmented
            value={dataCount}
            onChange={(val) => setDataCount(val as number)}
            options={[
              { label: '100条', value: 100 },
              { label: '1000条', value: 1000 },
              { label: '5000条', value: 5000 },
            ]}
          />
        </Space>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {dataCount} 行数据{virtual ? ' · 虚拟滚动模式' : ' · 普通渲染模式'}。
          拖拽表头列边框改变列宽，两种模式下表现一致。
          <br />
          <strong>性能提示：</strong>
          虚拟滚动模式下即使 5000 行，拖拽列宽依然流畅（rAF + 直接 DOM 操作）。
        </Typography.Paragraph>
      </Space>

      <Table<RecordType>
        columns={columns}
        dataSource={data}
        rowKey="key"
        resizable
        virtual={virtual}
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
      />
    </div>
  );
}
