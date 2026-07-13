import React from 'react';
import {
  Badge,
  Button,
  DatePicker,
  message,
  Select,
  Space,
  Statistic,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Summary, Table } from '../index';
import type { ColumnGroupType, ColumnsType, EditableConfig, Reference } from '../index';

const { Text } = Typography;

// ============================================================
// 类型定义
// ============================================================
interface Employee {
  key: string;
  empNo: string;
  name: string;
  age: number | undefined;
  gender: 'male' | 'female' | undefined;
  email: string;
  phone: string;
  department: string;
  role: string;
  level: string;
  salary: number | undefined;
  joinDate: string;
  probationEnd: string;
  status: 'active' | 'inactive' | 'pending';
  fullTime: boolean;
  tags: string[];
}

// ============================================================
// 选项数据
// ============================================================
const departmentOptions = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '设计部', value: '设计部' },
  { label: '市场部', value: '市场部' },
  { label: '运营部', value: '运营部' },
  { label: '人事部', value: '人事部' },
];

const roleByDept: Record<string, { label: string; value: string }[]> = {
  技术部: [
    { label: '前端工程师', value: '前端工程师' },
    { label: '后端工程师', value: '后端工程师' },
    { label: '架构师', value: '架构师' },
    { label: '测试工程师', value: '测试工程师' },
    { label: 'DevOps工程师', value: 'DevOps工程师' },
  ],
  产品部: [
    { label: '产品经理', value: '产品经理' },
    { label: '产品助理', value: '产品助理' },
  ],
  设计部: [
    { label: 'UI设计师', value: 'UI设计师' },
    { label: 'UX设计师', value: 'UX设计师' },
    { label: '视觉设计师', value: '视觉设计师' },
  ],
  市场部: [
    { label: '市场专员', value: '市场专员' },
    { label: '品牌经理', value: '品牌经理' },
  ],
  运营部: [
    { label: '运营专员', value: '运营专员' },
    { label: '内容运营', value: '内容运营' },
  ],
  人事部: [
    { label: 'HRBP', value: 'HRBP' },
    { label: '招聘专员', value: '招聘专员' },
  ],
};

const levelOptions = [
  { label: 'P4', value: 'P4' },
  { label: 'P5', value: 'P5' },
  { label: 'P6', value: 'P6' },
  { label: 'P7', value: 'P7' },
  { label: 'P8', value: 'P8' },
  { label: 'M1', value: 'M1' },
  { label: 'M2', value: 'M2' },
  { label: 'M3', value: 'M3' },
];

const statusConfig: Record<
  string,
  { color: string; text: string; badge: 'success' | 'error' | 'processing' }
> = {
  active: { color: 'green', text: '在职', badge: 'success' },
  inactive: { color: 'red', text: '离职', badge: 'error' },
  pending: { color: 'orange', text: '试用期', badge: 'processing' },
};

// ============================================================
// 初始数据
// ============================================================
const initialData: Employee[] = [
  {
    key: '1',
    empNo: 'EMP-001',
    name: '张三',
    age: 32,
    gender: 'male',
    email: 'zhangsan@company.com',
    phone: '13800138001',
    department: '技术部',
    role: '架构师',
    level: 'P7',
    salary: 45000,
    joinDate: '2018-03-15',
    probationEnd: '2018-09-15',
    status: 'active',
    fullTime: true,
    tags: ['React', 'TypeScript', 'K8s'],
  },
  {
    key: '2',
    empNo: 'EMP-002',
    name: '李四',
    age: 28,
    gender: 'female',
    email: 'lisi@company.com',
    phone: '13800138002',
    department: '设计部',
    role: 'UI设计师',
    level: 'P5',
    salary: 18000,
    joinDate: '2021-07-01',
    probationEnd: '2022-01-01',
    status: 'active',
    fullTime: true,
    tags: ['Figma', 'Sketch'],
  },
  {
    key: '3',
    empNo: 'EMP-003',
    name: '王五',
    age: 35,
    gender: 'male',
    email: 'invalid-email',
    phone: '1380013800',
    department: '技术部',
    role: '后端工程师',
    level: 'P6',
    salary: 30000,
    joinDate: '2019-11-20',
    probationEnd: '2020-05-20',
    status: 'active',
    fullTime: true,
    tags: ['Java', 'Spring'],
  },
  {
    key: '4',
    empNo: 'EMP-004',
    name: '',
    age: undefined,
    gender: undefined,
    email: '',
    phone: '',
    department: '',
    role: '',
    level: '',
    salary: undefined,
    joinDate: '',
    probationEnd: '',
    status: 'pending',
    fullTime: false,
    tags: [],
  },
  {
    key: '5',
    empNo: 'EMP-005',
    name: '赵六',
    age: 42,
    gender: 'male',
    email: 'zhaoliu@company.com',
    phone: '13900139001',
    department: '市场部',
    role: '品牌经理',
    level: 'M2',
    salary: 38000,
    joinDate: '2017-01-10',
    probationEnd: '2017-07-10',
    status: 'active',
    fullTime: true,
    tags: ['品牌', '公关'],
  },
  {
    key: '6',
    empNo: 'EMP-006',
    name: '钱七',
    age: 26,
    gender: 'female',
    email: 'qianqi@company.com',
    phone: '13900139002',
    department: '运营部',
    role: '内容运营',
    level: 'P4',
    salary: 12000,
    joinDate: '2023-06-01',
    probationEnd: '2023-12-01',
    status: 'pending',
    fullTime: false,
    tags: ['内容', '小红书'],
  },
];

// ============================================================
// 主组件
// ============================================================
export default function Demo() {
  const [data, setData] = React.useState<Employee[]>(initialData);
  const tableRef = React.useRef<Reference>(null);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [backupData, setBackupData] = React.useState<Employee | null>(null);

  // 检查行是否在编辑中
  const isEditing = (record: Employee) => record.key === editingKey;

  // ---------- 行级编辑操作 ----------
  const handleEdit = (record: Employee) => {
    setBackupData({ ...record });
    setEditingKey(record.key);
  };

  const handleCancel = (key: string) => {
    if (backupData) {
      setData((prev) => prev.map((r) => (r.key === key ? backupData : r)));
    }
    setEditingKey(null);
    setBackupData(null);
    tableRef.current?.resetErrors();
  };

  const handleSave = (_key: string) => {
    const result = tableRef.current?.validate();
    if (result?.valid) {
      setEditingKey(null);
      setBackupData(null);
      message.success('保存成功');
    } else {
      message.error(`校验失败：${result?.errors.size ?? 0} 个错误`);
    }
  };

  const handleDelete = (_key: string) => {
    setData((prev) => prev.filter((r) => r.key !== _key));
    if (editingKey === _key) {
      setEditingKey(null);
      setBackupData(null);
    }
    message.success('已删除');
  };

  // 列定义
  const columns: (ColumnsType<Employee>[number] | ColumnGroupType<Employee>)[] = [
    // ---------- 基本信息（表头合并） ----------
    {
      title: '基本信息',
      key: 'basic',
      children: [
        {
          title: '工号',
          dataIndex: 'empNo',
          key: 'empNo',
          width: 120,
          editable: {
            type: 'input',
            rules: [
              { required: true, message: '工号必填' },
              { pattern: /^EMP-\d{3}$/, message: '格式：EMP-XXX' },
            ],
          } as EditableConfig,
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          editable: {
            type: 'input',
            rules: [
              { required: true, message: '姓名必填' },
              {
                validator: (v: string) => (v && v.length < 2 ? '姓名至少2个字符' : undefined),
              },
            ],
          } as EditableConfig,
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
          width: 80,
          editable: {
            type: 'number',
            rules: [
              { required: true, message: '年龄必填' },
              {
                validator: (v: number) => (v != null && v < 18 ? '年龄不能小于18岁' : undefined),
              },
              {
                validator: (v: number) => (v != null && v > 65 ? '年龄不能超过65岁' : undefined),
              },
            ],
          } as EditableConfig,
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          width: 90,
          editable: {
            type: 'select',
            options: [
              { label: '男', value: 'male' },
              { label: '女', value: 'female' },
            ],
            rules: [{ required: true, message: '请选择性别' }],
          } as EditableConfig,
          render: (val: string) => (val === 'male' ? '男' : val === 'female' ? '女' : ''),
        },
      ],
    },

    // ---------- 联系方式（表头合并） ----------
    {
      title: '联系方式',
      key: 'contact',
      children: [
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: 200,
          editable: {
            type: 'input',
            rules: [
              { required: true, message: '邮箱必填' },
              { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' },
            ],
          } as EditableConfig,
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          key: 'phone',
          width: 140,
          editable: {
            type: 'input',
            rules: [
              { required: true, message: '手机号必填' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ],
          } as EditableConfig,
        },
      ],
    },

    // ---------- 职位信息（表头合并 + 联动） ----------
    {
      title: '职位信息',
      key: 'position',
      children: [
        {
          title: '部门',
          dataIndex: 'department',
          key: 'department',
          width: 120,
          editable: {
            type: 'select',
            options: departmentOptions,
            rules: [{ required: true, message: '部门必填' }],
          } as EditableConfig,
        },
        {
          title: '角色',
          dataIndex: 'role',
          key: 'role',
          width: 140,
          editable: {
            // 联动：根据部门动态过滤角色选项
            renderEditor: (
              value: unknown,
              record: Employee,
              _idx: number,
              onChange: (v: unknown) => void,
            ) => {
              const opts = roleByDept[record.department] || [];
              return (
                <Select
                  value={value}
                  onChange={onChange}
                  style={{ width: '100%' }}
                  options={opts}
                  placeholder={record.department ? '请选择角色' : '请先选择部门'}
                  disabled={!record.department}
                />
              );
            },
            rules: [{ required: true, message: '角色必填' }],
          } as EditableConfig,
        },
        {
          title: '职级',
          dataIndex: 'level',
          key: 'level',
          width: 80,
          editable: {
            type: 'select',
            options: levelOptions,
            rules: [{ required: true, message: '职级必填' }],
          } as EditableConfig,
        },
        {
          title: '薪资(元)',
          dataIndex: 'salary',
          key: 'salary',
          width: 110,
          editable: {
            type: 'number',
            rules: [
              { required: true, message: '薪资必填' },
              {
                validator: (v: number) => (v != null && v < 3000 ? '薪资不能低于3000' : undefined),
              },
              {
                validator: (v: number) =>
                  v != null && v > 100000 ? '薪资不能超过100000' : undefined,
              },
            ],
          } as EditableConfig,
          render: (val: number) => (val != null ? `¥${val.toLocaleString()}` : ''),
        },
      ],
    },

    // ---------- 日期信息（自定义编辑器） ----------
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 150,
      editable: {
        renderEditor: (
          _value: unknown,
          _record: unknown,
          _idx: number,
          onChange: (v: unknown) => void,
        ) => (
          <DatePicker
            value={undefined}
            onChange={(_d, dateStr) => onChange(dateStr as string)}
            style={{ width: '100%' }}
            placeholder="选择日期"
          />
        ),
        rules: [{ required: true, message: '入职日期必填' }],
      } as EditableConfig,
    },
    {
      title: '试用期结束',
      dataIndex: 'probationEnd',
      key: 'probationEnd',
      width: 150,
      editable: {
        renderEditor: (
          _value: unknown,
          _record: unknown,
          _idx: number,
          onChange: (v: unknown) => void,
        ) => (
          <DatePicker
            value={undefined}
            onChange={(_d, dateStr) => onChange(dateStr as string)}
            style={{ width: '100%' }}
            placeholder="选择日期"
          />
        ),
      } as EditableConfig,
    },

    // ---------- 状态（自定义渲染 + 编辑） ----------
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      editable: {
        type: 'select',
        options: [
          { label: '在职', value: 'active' },
          { label: '离职', value: 'inactive' },
          { label: '试用期', value: 'pending' },
        ],
        rules: [{ required: true, message: '状态必填' }],
      } as EditableConfig,
      render: (val: string) => {
        const cfg = statusConfig[val];
        return cfg ? <Badge status={cfg.badge} text={cfg.text} /> : null;
      },
    },

    // ---------- 全职（Switch 自定义编辑器） ----------
    {
      title: '全职',
      dataIndex: 'fullTime',
      key: 'fullTime',
      width: 80,
      align: 'center' as const,
      editable: {
        renderEditor: (
          value: unknown,
          _record: unknown,
          _idx: number,
          onChange: (v: unknown) => void,
        ) => <Switch checked={!!value} onChange={onChange} />,
      } as EditableConfig,
      render: (val: boolean) => (val ? <Tag color="blue">全职</Tag> : <Tag>兼职</Tag>),
    },

    // ---------- 标签（多选自定义编辑器） ----------
    {
      title: '技能标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      editable: {
        renderEditor: (
          value: unknown,
          _record: unknown,
          _idx: number,
          onChange: (v: unknown) => void,
        ) => (
          <Select
            mode="tags"
            value={(value as string[]) || []}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder="输入标签后回车"
            tokenSeparators={[',']}
          />
        ),
      } as EditableConfig,
      render: (tags: string[]) => (
        <>
          {(tags || []).map((tag) => (
            <Tag key={tag} color="geekblue" style={{ marginBottom: 2 }}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },

    // ---------- 操作列 ----------
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_val: unknown, record: Employee) => (
        <Space size="small">
          {isEditing(record) ? (
            <>
              <Button
                type="link"
                size="small"
                icon={<SaveOutlined />}
                onClick={() => handleSave(record.key)}
              >
                保存
              </Button>
              <Button type="link" size="small" onClick={() => handleCancel(record.key)}>
                取消
              </Button>
            </>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => handleEdit(record)}
              disabled={editingKey !== null}
            >
              编辑
            </Button>
          )}
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    const newKey = String(Date.now());
    const newEmp: Employee = {
      key: newKey,
      empNo: '',
      name: '',
      age: undefined,
      gender: undefined,
      email: '',
      phone: '',
      department: '',
      role: '',
      level: '',
      salary: undefined,
      joinDate: '',
      probationEnd: '',
      status: 'pending',
      fullTime: false,
      tags: [],
    };
    setData((prev) => [...prev, newEmp]);
    setBackupData({ ...newEmp });
    setEditingKey(newKey);
  };

  const handleReset = () => {
    setData(initialData);
    setEditingKey(null);
    setBackupData(null);
    tableRef.current?.resetErrors();
  };

  const handleValidateAll = () => {
    const result = tableRef.current?.validate();
    if (result?.valid) {
      message.success('全部校验通过！');
    } else {
      message.error(`发现 ${result?.errors.size ?? 0} 个错误`);
    }
  };

  // ---------- 统计数据 ----------
  const totalSalary = data.reduce((sum, r) => sum + (r.salary || 0), 0);
  const activeCount = data.filter((r) => r.status === 'active').length;
  const pendingCount = data.filter((r) => r.status === 'pending').length;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>可编辑表格 — 超级完整场景演示</h2>

      {/* 说明 */}
      <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>覆盖场景：</Text>
          <Text type="secondary">
            ✅ 表头合并（基本信息 / 联系方式 / 职位信息 三级表头） ✅ Input / InputNumber / Select /
            DatePicker / Switch / 多选标签 六种编辑器 ✅ 必填校验 + 正则校验 + 自定义函数校验 +
            范围校验 ✅ 部门-角色联动选择 ✅ 行级编辑模式（编辑/保存/取消） ✅ 行新增 / 删除 ✅
            批量校验 ✅ 固定列 ✅ 自定义渲染（状态 Badge、薪资格式化、标签 Tag） ✅ 统计行
          </Text>
          <Text type="secondary">
            交互方式：点击「编辑」进入行编辑模式 → 修改数据 → 点击「保存」校验并保存，或「取消」回退
          </Text>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Space style={{ marginBottom: 12 }} size="large">
        <Statistic title="总人数" value={data.length} />
        <Statistic title="在职" value={activeCount} valueStyle={{ color: '#52c41a' }} />
        <Statistic title="试用期" value={pendingCount} valueStyle={{ color: '#faad14' }} />
        <Statistic
          title="月薪总额"
          value={totalSalary}
          prefix="¥"
          valueStyle={{ color: '#1890ff' }}
        />
      </Space>

      {/* 操作按钮 */}
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={handleValidateAll}>
          校验全部
        </Button>
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          重置数据
        </Button>
        <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
          新增员工
        </Button>
      </Space>

      {/* 表格 */}
      <Table<Employee>
        ref={tableRef}
        columns={columns as ColumnsType<Employee>}
        dataSource={data}
        rowKey="key"
        editable
        onEditableChange={(newData) => setData(newData as Employee[])}
        scroll={{ x: 1800, y: 400 }}
        bordered
        rowClassName={(record) => (isEditing(record) ? 'editable-row-editing' : '')}
        summary={(pageData) => {
          const total = pageData.reduce((sum, r) => sum + (r.salary || 0), 0);
          return (
            <Summary fixed>
              <Summary.Row>
                <Summary.Cell index={0} colSpan={9}>
                  <Text strong>合计</Text>
                </Summary.Cell>
                <Summary.Cell index={9}>
                  <Text strong style={{ color: '#1890ff' }}>
                    ¥{total.toLocaleString()}
                  </Text>
                </Summary.Cell>
                <Summary.Cell index={10} colSpan={5} />
              </Summary.Row>
            </Summary>
          );
        }}
      />

      {/* JSON 预览 */}
      <details style={{ marginTop: 16 }}>
        <summary>
          <Text strong>📋 当前数据 JSON 预览（点击展开）</Text>
        </summary>
        <pre
          style={{
            background: '#f5f5f5',
            padding: 12,
            borderRadius: 6,
            maxHeight: 400,
            overflow: 'auto',
            fontSize: 12,
            marginTop: 8,
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
