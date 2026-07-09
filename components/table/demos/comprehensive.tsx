import React, { useMemo, useState } from 'react';
import { Table } from '@dtjoy/dt-design';
import type { ColumnsType } from '@dtjoy/dt-design';
import {
  Button,
  Input,
  Popover,
  Progress,
  Segmented,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { DownloadOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

interface DataType {
  key: string;
  id: number;
  name: string;
  age: number;
  department: string;
  role: string;
  email: string;
  salary: number;
  progress: number;
  status: 'active' | 'inactive' | 'pending';
  tags: string[];
  address: string;
}

const DEPARTMENTS = ['技术部', '产品部', '设计部', '市场部', '运营部'];
const ROLES = ['工程师', '经理', '总监', '主管', '实习生'];
const TAGS_POOL = ['优秀员工', 'VIP', '新人', '骨干', '待考核'];

const generateData = (count: number): DataType[] => {
  return Array.from({ length: count }, (_, i) => ({
    key: String(i),
    id: 1000 + i,
    name: `员工_${i + 1}`,
    age: 22 + (i % 30),
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    role: ROLES[i % ROLES.length],
    email: `employee${i + 1}@company.com`,
    salary: 8000 + (i % 20) * 1000,
    progress: ((i * 17) % 100) + 1,
    status: i % 7 === 0 ? 'pending' : i % 3 === 0 ? 'inactive' : 'active',
    tags: [
      TAGS_POOL[i % TAGS_POOL.length],
      ...(i % 3 === 0 ? [TAGS_POOL[(i + 1) % TAGS_POOL.length]] : []),
    ],
    address: `${['北京', '上海', '深圳', '杭州', '广州'][i % 5]}市${['朝阳', '浦东', '南山', '西湖', '天河'][i % 5]}区XX路${i + 1}号`,
  }));
};

const StatusBadge: React.FC<{ status: DataType['status'] }> = ({ status }) => {
  const config = {
    active: { color: 'green', text: '在职' },
    inactive: { color: 'red', text: '离职' },
    pending: { color: 'orange', text: '待定' },
  };
  const { color, text } = config[status];
  return <Tag color={color}>{text}</Tag>;
};

const SalaryCell: React.FC<{ salary: number }> = ({ salary }) => (
  <Popover
    content={
      <div style={{ fontSize: 13 }}>
        <div>月薪：¥{salary.toLocaleString()}</div>
        <div>年薪：¥{(salary * 13).toLocaleString()}（13薪）</div>
      </div>
    }
    trigger="hover"
  >
    <span style={{ cursor: 'pointer', fontWeight: 600, color: '#1677ff' }}>
      ¥{salary.toLocaleString()}
    </span>
  </Popover>
);

export default () => {
  const [virtual, setVirtual] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [dataCount, setDataCount] = useState<number>(5000);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const tblRef = React.useRef<any>(null);

  const data = useMemo(() => generateData(dataCount), [dataCount]);

  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter(
      (item) =>
        item.name.includes(searchText) ||
        item.department.includes(searchText) ||
        item.email.includes(searchText),
    );
  }, [data, searchText]);

  const columns: ColumnsType<DataType> = useMemo(() => {
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        fixed: 'left',
        sorter: (a, b) => a.id - b.id,
        resizable: true,
        minWidth: 60,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        fixed: 'left',
        sorter: (a, b) => a.name.localeCompare(b.name),
        resizable: true,
        minWidth: 80,
        render: (name: string, _record) => (
          <Tooltip title={`点击查看 ${name} 详情`}>
            <a style={{ fontWeight: 500 }}>{name}</a>
          </Tooltip>
        ),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 80,
        align: 'center',
        sorter: (a, b) => a.age - b.age,
        resizable: true,
        minWidth: 60,
        render: (age: number) => (
          <span style={{ color: age > 40 ? '#ff4d4f' : '#52c41a' }}>{age}</span>
        ),
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        width: 100,
        filters: DEPARTMENTS.map((d) => ({ text: d, value: d })),
        onFilter: (value, record) => record.department === value,
        resizable: true,
        minWidth: 80,
        render: (dept: string) => <Tag color="blue">{dept}</Tag>,
      },
      {
        title: '职位',
        dataIndex: 'role',
        key: 'role',
        width: 100,
        resizable: true,
        minWidth: 80,
      },
      {
        title: '薪资',
        dataIndex: 'salary',
        key: 'salary',
        width: 120,
        align: 'right',
        sorter: (a, b) => a.salary - b.salary,
        resizable: true,
        minWidth: 80,
        render: (salary: number) => <SalaryCell salary={salary} />,
      },
      {
        title: '项目进度',
        dataIndex: 'progress',
        key: 'progress',
        width: 180,
        sorter: (a, b) => a.progress - b.progress,
        resizable: true,
        minWidth: 100,
        render: (progress: number) => (
          <Progress
            percent={progress}
            size="small"
            status={progress < 30 ? 'exception' : progress === 100 ? 'success' : 'active'}
          />
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        align: 'center',
        filters: [
          { text: '在职', value: 'active' },
          { text: '离职', value: 'inactive' },
          { text: '待定', value: 'pending' },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status: DataType['status']) => <StatusBadge status={status} />,
      },
      {
        title: '标签',
        dataIndex: 'tags',
        key: 'tags',
        width: 180,
        render: (tags: string[]) => (
          <Space size={4} wrap>
            {tags.map((tag) => {
              const color =
                tag === 'VIP'
                  ? 'gold'
                  : tag === '优秀员工'
                    ? 'green'
                    : tag === '新人'
                      ? 'cyan'
                      : 'default';
              return (
                <Tag key={tag} color={color}>
                  {tag}
                </Tag>
              );
            })}
          </Space>
        ),
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        ellipsis: { showTitle: false },
        render: (email: string) => (
          <Tooltip title={email}>
            <span style={{ cursor: 'pointer' }}>{email}</span>
          </Tooltip>
        ),
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        width: 250,
        ellipsis: true,
        resizable: true,
        minWidth: 100,
      },
      {
        title: '操作',
        key: 'action',
        width: 180,
        fixed: 'right',
        render: (_value, _record) => (
          <Space size="small">
            <Button type="link" size="small">
              编辑
            </Button>
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Space>
        ),
      },
    ];
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Space wrap>
          <Segmented
            value={String(virtual)}
            onChange={(val) => setVirtual(val === 'true')}
            options={[
              { label: '虚拟滚动', value: 'true' },
              { label: '普通模式', value: 'false' },
            ]}
          />
          <Switch
            checked={bordered}
            onChange={setBordered}
            checkedChildren="边框"
            unCheckedChildren="无边框"
          />
          <Segmented
            value={dataCount}
            onChange={(val) => setDataCount(val as number)}
            options={[
              { label: '10条', value: 10 },
              { label: '100条', value: 100 },
              { label: '1000条', value: 1000 },
              { label: '5000条', value: 5000 },
            ]}
          />
        </Space>

        <Space wrap>
          <Input
            placeholder="搜索姓名/部门/邮箱"
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setSearchText('');
              setSelectedRowKeys([]);
            }}
          >
            刷新
          </Button>
          <Button icon={<DownloadOutlined />}>导出</Button>
          {virtual && dataCount >= 1000 && (
            <Button
              type="primary"
              onClick={() => tblRef.current?.scrollTo({ index: Math.floor(dataCount / 2) })}
            >
              滚动到中间
            </Button>
          )}
        </Space>
      </Space>

      <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        共 {filteredData.length} 条数据 · 已选 {selectedRowKeys.length} 项 ·
        {virtual ? ' 虚拟滚动模式' : ' 普通模式'} ·
        包含固定列、排序、筛选、自定义渲染、列宽拖拽等特性
      </Typography.Text>

      <Table<DataType>
        ref={tblRef}
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        bordered={bordered}
        virtual={virtual}
        resizable
        scroll={{ x: 1800, y: 480 }}
        pagination={
          virtual && dataCount >= 1000
            ? false
            : { pageSize: 10, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }
        }
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
          fixed: true,
        }}
        summary={(data: readonly DataType[]) => {
          const totalSalary = data.reduce((sum, item) => sum + item.salary, 0);
          const avgProgress =
            data.length > 0
              ? Math.round(data.reduce((sum, item) => sum + item.progress, 0) / data.length)
              : 0;
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
                <Table.Summary.Cell index={1} />
                <Table.Summary.Cell index={2} />
                <Table.Summary.Cell index={3} />
                <Table.Summary.Cell index={4} />
                <Table.Summary.Cell index={5} align="right">
                  <strong>¥{totalSalary.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Progress percent={avgProgress} size="small" />
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} colSpan={5}>
                  共 {data.length} 人 · 平均项目进度 {avgProgress}%
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};
