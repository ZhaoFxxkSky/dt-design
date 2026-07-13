import { Button, Segmented, Space, Switch, Typography } from 'antd';
import type { TableProps } from '@dtjoy/dt-design';
import { Table } from '@dtjoy/dt-design';
import React from 'react';

interface RecordType {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  address1: string;
  address2: string;
  address3: string;
}

// 双层合并表头配置（两行表头，含表头跨列合并）
const fixedColumns: TableProps<RecordType>['columns'] = [
  // 第一组基础信息 合并表头
  {
    title: '基础人员信息', // 第一层表头
    width: 340,

    children: [
      { title: 'ID', dataIndex: 'id', width: 100 },
      { title: 'FirstName', dataIndex: 'firstName', width: 120 },
      { title: 'LastName', dataIndex: 'lastName', width: 120, fixed: 'start' },
    ],
  },
  {
    title: '分组&年龄',
    width: 220,
    children: [
      {
        title: '分组',
        width: 120,
        render: (_, record) => `Group ${Math.floor(record.id / 4)}`,
        onCell: (record) => ({
          rowSpan: record.id % 4 === 0 ? 4 : 0,
        }),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
        onCell: (record) => ({
          colSpan: record.id % 4 === 0 ? 2 : 1,
        }),
      },
    ],
  },
  // 地址大分组，表头跨3列合并
  {
    title: '详细地址信息', // 第二层合并表头，跨3个子列
    children: [
      {
        title: '地址1',
        dataIndex: 'address1',
        onCell: (record) => ({
          colSpan: record.id % 4 === 0 ? 0 : 1,
        }),
      },
      { title: '地址2', dataIndex: 'address2' },
      { title: '地址3', dataIndex: 'address3' },
    ],
  },
  // 操作列固定右侧
  {
    title: '操作区域',
    width: 150,
    fixed: 'end',
    children: [
      {
        title: '操作',
        width: 150,
        render: () => (
          <Space>
            <Typography.Link>Action1</Typography.Link>
            <Typography.Link>Action2</Typography.Link>
          </Space>
        ),
      },
    ],
  },
];

// 简易单层列（关闭固定列时使用）
const columns: TableProps<RecordType>['columns'] = [
  {
    title: '基础信息',
    children: [
      { title: 'ID', dataIndex: 'id', width: 100 },
      { title: 'FirstName', dataIndex: 'firstName', width: 120 },
      { title: 'LastName', dataIndex: 'lastName' },
    ],
  },
];

const getData = (length: number) =>
  Array.from({ length }).map<RecordType>((_, index) => ({
    id: index,
    firstName: `First_${index.toString(16)}`,
    lastName: `Last_${index.toString(16)}`,
    age: 25 + (index % 10),
    address1: `New York No. ${index} Lake Park`,
    address2: `London No. ${index} Lake Park`,
    address3: `Sydney No. ${index} Lake Park`,
  }));

const App: React.FC = () => {
  const [fixed, setFixed] = React.useState(true);
  const [bordered, setBordered] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [count, setCount] = React.useState(10000);

  const tblRef: Parameters<typeof Table>[0]['ref'] = React.useRef(null);

  const data = React.useMemo<RecordType[]>(() => getData(count), [count]);

  const mergedColumns = React.useMemo<typeof fixedColumns>(() => {
    if (!fixed) {
      return columns;
    }
    if (!expanded) {
      return fixedColumns;
    }
    // 开启展开行时移除内容单元格合并逻辑，避免冲突
    return fixedColumns.map((col) => {
      const newCol = { ...col };
      if ('children' in newCol) {
        newCol.children = newCol.children.map((child) => ({
          ...child,
          onCell: undefined,
        }));
      }
      return newCol;
    });
  }, [expanded, fixed]);

  const expandableProps = React.useMemo<TableProps<RecordType>['expandable']>(() => {
    if (!expanded) return undefined;
    return {
      columnWidth: 48,
      expandedRowRender: (record) => <p style={{ margin: 0 }}>🎉 Expanded {record.address1}</p>,
      rowExpandable: (record) => record.id % 2 === 0,
    };
  }, [expanded]);

  return (
    <div style={{ padding: 64 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap>
          <Switch
            checked={bordered}
            onChange={() => setBordered(!bordered)}
            checkedChildren="边框"
            unCheckedChildren="无边框"
          />
          <Switch
            checked={fixed}
            onChange={() => setFixed(!fixed)}
            checkedChildren="固定列+双层表头"
            unCheckedChildren="简易单层表头"
          />
          <Switch
            checked={expanded}
            onChange={() => setExpanded(!expanded)}
            checkedChildren="可展开行"
            unCheckedChildren="关闭展开"
          />
          <Switch
            checked={empty}
            onChange={() => setEmpty(!empty)}
            checkedChildren="空数据"
            unCheckedChildren="加载数据"
          />
          <Segmented
            value={count}
            onChange={(val) => setCount(val as number)}
            options={[
              { label: '无数据', value: 0 },
              { label: '少量4条', value: 4 },
              { label: '大量10000条虚拟滚动', value: 10000 },
            ]}
          />

          {data.length >= 999 && (
            <Button onClick={() => tblRef.current?.scrollTo({ index: 999 })}>滚动到第999行</Button>
          )}
        </Space>

        <Table<RecordType>
          bordered={bordered}
          virtual
          columns={mergedColumns}
          scroll={{ x: 2000, y: 400 }}
          rowKey="id"
          dataSource={empty ? [] : data}
          pagination={false}
          ref={tblRef}
          rowSelection={expanded ? undefined : { type: 'radio', columnWidth: 48 }}
          expandable={expandableProps}
        />
      </Space>
    </div>
  );
};

export default App;
