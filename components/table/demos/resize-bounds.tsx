import React from 'react';
import { Table } from '../index';
import type { ColumnsType } from '../index';
import { Space, Tag, Typography } from 'antd';

interface RecordType {
  key: string;
  name: string;
  age: number;
  email: string;
  department: string;
  status: string;
}

const dataSource: RecordType[] = [
  {
    key: '1',
    name: '张三',
    age: 32,
    email: 'zhangsan@example.com',
    department: '技术部',
    status: '在职',
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    email: 'lisi@example.com',
    department: '产品部',
    status: '在职',
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    email: 'wangwu@example.com',
    department: '设计部',
    status: '离职',
  },
  {
    key: '4',
    name: '赵六',
    age: 42,
    email: 'zhaoliu@example.com',
    department: '市场部',
    status: '在职',
  },
  {
    key: '5',
    name: '孙七',
    age: 25,
    email: 'sunqi@example.com',
    department: '运营部',
    status: '待定',
  },
];

export default function Demo() {
  const [logs, setLogs] = React.useState<string[]>([]);

  const addLog = React.useCallback((msg: string) => {
    setLogs((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 8));
  }, []);

  const columns: ColumnsType<RecordType> = React.useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        resizable: true,
        minWidth: 80,
        maxWidth: 200,
        onResize: (width: number) => addLog(`姓名列 onResize → ${width}px (maxWidth=200)`),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 80,
        resizable: true,
        minWidth: 60,
        maxWidth: 150,
        onResize: (width: number) => addLog(`年龄列 onResize → ${width}px (maxWidth=150)`),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        resizable: true,
        minWidth: 100,
        // 不设 maxWidth，可以无限拖宽
        onResize: (width: number) => addLog(`邮箱列 onResize → ${width}px (无 maxWidth 限制)`),
      },
      {
        title: '部门（不可拖拽）',
        dataIndex: 'department',
        key: 'department',
        width: 120,
        // 不设 resizable，即使全局 resizable=true 也不会有拖拽手柄
        resizable: false,
      },
      {
        title: '状态（不可拖拽）',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        resizable: false,
        render: (status: string) => (
          <Tag color={status === '在职' ? 'green' : status === '离职' ? 'red' : 'orange'}>
            {status}
          </Tag>
        ),
      },
    ],
    [addLog],
  );

  return (
    <div>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          <li>
            <strong>minWidth 限制</strong>：姓名列 minWidth=80，拖拽不会小于 80px
          </li>
          <li>
            <strong>maxWidth 限制</strong>：姓名列 maxWidth=200，拖拽不会大于 200px
          </li>
          <li>
            <strong>部分列不可拖拽</strong>：部门和状态列设 <code>resizable: false</code>
            ，无拖拽手柄
          </li>
          <li>
            <strong>回调日志</strong>：onResize（列级）和 onColumnResize（表级）实时记录
          </li>
        </ul>
      </Typography.Paragraph>

      <Table<RecordType>
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        resizable
        scroll={{ x: 800 }}
        onColumnResize={(key, width) =>
          addLog(`[onColumnResize] key=${String(key)}, width=${width}`)
        }
      />

      {logs.length > 0 && (
        <Space direction="vertical" style={{ marginTop: 16, width: '100%' }}>
          <Typography.Text strong>回调日志（最近 8 条）：</Typography.Text>
          <div
            style={{
              background: '#fafafa',
              border: '1px solid #f0f0f0',
              borderRadius: 6,
              padding: 12,
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {logs.map((log, i) => (
              <div
                key={i}
                style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: '20px', color: '#666' }}
              >
                {log}
              </div>
            ))}
          </div>
        </Space>
      )}
    </div>
  );
}
