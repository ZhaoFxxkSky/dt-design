import React from 'react';
import { Table } from '../index';
import type { ColumnsType } from '../index';
import { Button, Space, Typography } from 'antd';

interface RecordType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const dataSource: RecordType[] = [
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 28, address: '上海市浦东新区' },
  { key: '3', name: '王五', age: 35, address: '深圳市南山区' },
  { key: '4', name: '赵六', age: 42, address: '杭州市西湖区' },
  { key: '5', name: '孙七', age: 25, address: '成都市高新区' },
];

export default function Demo() {
  const [resizeLog, setResizeLog] = React.useState<string[]>([]);

  const columns: ColumnsType<RecordType> = React.useMemo(
    () => [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        resizable: true,
        minWidth: 80,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        resizable: true,
        minWidth: 60,
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
        resizable: true,
        minWidth: 100,
        onResize: (width: number) => {
          setResizeLog((prev) => [`地址列宽度变化 → ${width}px`, ...prev.slice(0, 4)]);
        },
      },
    ],
    [],
  );

  return (
    <div>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        列宽之和（420px）小于容器宽度时，剩余空间按比例平分给所有弹性列。
        拖拽某列后，该列变为固定列，剩余空间在未拖拽列间重新分配。
        <br />
        <strong>操作提示：</strong>
        试着拖拽"姓名"列变宽，观察其他列如何自动缩小以填满容器。
      </Typography.Paragraph>

      <Table<RecordType>
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        resizable
        onColumnResize={(key, width) => {
          setResizeLog((prev) => [
            `[onColumnResize] key=${String(key)}, width=${width}px`,
            ...prev.slice(0, 4),
          ]);
        }}
      />

      {resizeLog.length > 0 && (
        <Space direction="vertical" style={{ marginTop: 16 }}>
          <Typography.Text strong>回调日志：</Typography.Text>
          {resizeLog.map((log, i) => (
            <Typography.Text key={i} type="secondary" code>
              {log}
            </Typography.Text>
          ))}
          <Button size="small" onClick={() => setResizeLog([])}>
            清空日志
          </Button>
        </Space>
      )}
    </div>
  );
}
