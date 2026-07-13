import React from 'react';
import { Button, message, Rate, Select, Space, Switch, Tag, Typography } from 'antd';
import {
  CheckCircleOutlined,
  EditOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { BatchEditModal, Table } from '../index';
import type { ColumnsType, EditableConfig, Reference } from '../index';
import type { AnyObject } from '../../_util/type';

const { Text, Title } = Typography;

// ============================================================
// 类型定义
// ============================================================
interface Order {
  key: string;
  orderNo: string;
  customer: string;
  product: string;
  category: string;
  quantity: number | undefined;
  unitPrice: number | undefined;
  status: string;
  priority: number; // 1-5
  isActive: boolean;
  tags: string[];
  remark: string;
}

// ============================================================
// 选项常量
// ============================================================
const categoryOptions = [
  { label: '电子产品', value: '电子产品' },
  { label: '办公用品', value: '办公用品' },
  { label: '食品', value: '食品' },
  { label: '服装', value: '服装' },
  { label: '家居', value: '家居' },
  { label: '图书', value: '图书' },
];

const statusOptions = [
  { label: '待处理', value: '待处理' },
  { label: '处理中', value: '处理中' },
  { label: '已发货', value: '已发货' },
  { label: '已完成', value: '已完成' },
  { label: '已取消', value: '已取消' },
];

const tagOptions = [
  { label: '加急', value: '加急' },
  { label: 'VIP', value: 'VIP' },
  { label: '新品', value: '新品' },
  { label: '促销', value: '促销' },
  { label: '退货', value: '退货' },
  { label: '换货', value: '换货' },
];

// ============================================================
// 生成 200 条测试数据
// ============================================================
const customers = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '钱七',
  '孙八',
  '周九',
  '吴十',
  '郑十一',
  '王十二',
];
const products = [
  '无线鼠标',
  '机械键盘',
  'USB扩展坞',
  '蓝牙耳机',
  'A4打印纸',
  '笔记本支架',
  '咖啡豆',
  '运动T恤',
  '台灯',
  '书架',
  '保温杯',
  '充电宝',
];

function generateData(count: number): Order[] {
  const result: Order[] = [];
  for (let i = 0; i < count; i++) {
    const cat = categoryOptions[i % categoryOptions.length].value;
    const prod = products[i % products.length];
    // 制造一些空值和异常值用于展示校验
    const hasEmpty = i % 17 === 0; // 每隔 17 条制造一个空值
    const hasZeroPrice = i % 23 === 0;

    result.push({
      key: String(i + 1),
      orderNo: `ORD-${String(i + 1).padStart(4, '0')}`,
      customer: customers[i % customers.length],
      product: hasEmpty ? '' : prod,
      category: hasEmpty ? '' : cat,
      quantity: hasEmpty ? undefined : Math.floor(Math.random() * 100) + 1,
      unitPrice: hasZeroPrice ? 0 : +(Math.random() * 500 + 10).toFixed(2),
      status: statusOptions[i % statusOptions.length].value,
      priority: (i % 5) + 1,
      isActive: i % 3 !== 0,
      tags: [
        tagOptions[i % tagOptions.length].value,
        ...(i % 4 === 0 ? [tagOptions[(i + 2) % tagOptions.length].value] : []),
      ],
      remark: i % 5 === 0 ? `备注信息${i}` : '',
    });
  }
  return result;
}

const initialData = generateData(200);

const statusColors: Record<string, string> = {
  待处理: 'default',
  处理中: 'processing',
  已发货: 'warning',
  已完成: 'success',
  已取消: 'error',
};

export default function Demo() {
  const [data, setData] = React.useState<Order[]>(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [batchEditOpen, setBatchEditOpen] = React.useState(false);
  const [validateResult, setValidateResult] = React.useState<{
    valid: boolean;
    count: number;
  } | null>(null);
  const tableRef = React.useRef<Reference>(null);

  // 列定义 — 覆盖多种编辑器类型
  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 120,
      fixed: 'left',
      editable: {
        type: 'input',
        rules: [
          { required: true, message: '订单号必填' },
          { pattern: /^ORD-\d{4}$/, message: '格式：ORD-XXXX' },
        ],
      } as EditableConfig,
    },

    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 90,
      editable: {
        type: 'input',
        rules: [{ required: true, message: '客户必填' }],
      } as EditableConfig,
    },

    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
      width: 120,
      editable: {
        type: 'input',
        rules: [{ required: true, message: '商品必填' }],
      } as EditableConfig,
    },

    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      editable: {
        type: 'select',
        options: categoryOptions,
        rules: [{ required: true, message: '分类必填' }],
      } as EditableConfig,
    },

    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right',
      editable: {
        type: 'number',
        rules: [
          { required: true, message: '数量必填' },
          { validator: (v: number) => (v != null && v <= 0 ? '数量必须大于0' : undefined) },
        ],
      } as EditableConfig,
    },

    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 90,
      align: 'right',
      editable: {
        type: 'number',
        rules: [
          { required: true, message: '单价必填' },
          { validator: (v: number) => (v != null && v <= 0 ? '单价必须大于0' : undefined) },
        ],
      } as EditableConfig,
    },

    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      editable: {
        type: 'select',
        options: statusOptions,
        rules: [{ required: true, message: '状态必填' }],
      } as EditableConfig,
      render: (val: string) => <Tag color={statusColors[val]}>{val}</Tag>,
    },

    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      align: 'center',
      editable: {
        renderEditor: (val: unknown, _r: unknown, _i: number, onChange: (v: unknown) => void) => (
          <Rate count={5} value={val as number} onChange={onChange} style={{ fontSize: 14 }} />
        ),
      } as EditableConfig,
      render: (val: number) => <Rate count={5} value={val} disabled style={{ fontSize: 12 }} />,
    },

    {
      title: '上架',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 60,
      align: 'center',
      editable: {
        renderEditor: (val: unknown, _r: unknown, _i: number, onChange: (v: unknown) => void) => (
          <Switch checked={!!val} onChange={onChange} size="small" />
        ),
      } as EditableConfig,
      render: (val: boolean) => (val ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
    },

    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      editable: {
        renderEditor: (val: unknown, _r: unknown, _i: number, onChange: (v: unknown) => void) => (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            value={val as string[]}
            onChange={onChange}
            options={tagOptions}
            placeholder="选择标签"
          />
        ),
      } as EditableConfig,
      render: (val: string[]) =>
        val?.length ? (
          <span>
            {val.map((t) => (
              <Tag key={t} color="blue" style={{ marginBottom: 2 }}>
                {t}
              </Tag>
            ))}
          </span>
        ) : (
          <span style={{ color: '#ccc' }}>-</span>
        ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 140,
      editable: { type: 'input' } as EditableConfig,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    selections: [
      {
        key: 'all-data',
        text: '全选所有',
        onSelect: () => setSelectedRowKeys(data.map((r) => r.key)),
      },
      {
        key: 'clear',
        text: '清空选择',
        onSelect: () => setSelectedRowKeys([]),
      },
      {
        key: 'odd',
        text: '选择奇数行',
        onSelect: () => setSelectedRowKeys(data.filter((_, i) => i % 2 === 0).map((r) => r.key)),
      },
    ],
  };

  const handleBatchEdit = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先勾选要批量编辑的行');
      return;
    }
    setBatchEditOpen(true);
  };

  const handleBatchApply = (newData: AnyObject[]) => {
    setData(newData as Order[]);
    setBatchEditOpen(false);
    setSelectedRowKeys([]);
    setValidateResult(null);
    message.success(`批量编辑完成，已更新 ${selectedRowKeys.length} 行`);
  };

  const handleReset = () => {
    setData(initialData);
    setSelectedRowKeys([]);
    setValidateResult(null);
    tableRef.current?.resetErrors();
  };

  const handleValidateAll = () => {
    const result = tableRef.current?.validate();
    if (result?.valid) {
      setValidateResult({ valid: true, count: 0 });
      message.success('全部校验通过');
    } else {
      const count = result?.errors.size ?? 0;
      setValidateResult({ valid: false, count });
      message.error(`发现 ${count} 个错误，已自动跳转到第一个错误行`);
    }
  };

  // 全选当前页
  const handleSelectPage = () => {
    // 切换全选/取消
    if (selectedRowKeys.length > 0) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(data.map((r) => r.key));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 8 }}>
        <ThunderboltOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        可编辑表格 — 批量编辑 + 分页 + 多种编辑器
      </Title>

      <div
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#f0f5ff',
          borderRadius: 6,
          border: '1px solid #d6e4ff',
        }}
      >
        <Space direction="vertical" size={4}>
          <Text strong>覆盖场景（200 行数据，分页每页 10/20/50 条可切换）：</Text>
          <Text type="secondary">
            📝 编辑器类型：Input · InputNumber · Select · Switch · Rate · DatePicker · 多选
            Select（标签）
          </Text>
          <Text type="secondary">
            🔧 批量编辑：勾选行 → 点击「批量编辑」→ 支持固定值填充 / 查找替换 / 序列生成 + 效果预览
          </Text>
          <Text type="secondary">
            ✅ 校验跳转：点击「校验全部」→
            自动跳转到第一个错误行所在页（注意：数据中故意制造了空值和 0 价格）
          </Text>
        </Space>
      </div>

      <Space wrap style={{ marginBottom: 12 }}>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleBatchEdit}
          disabled={selectedRowKeys.length === 0}
        >
          批量编辑 ({selectedRowKeys.length} 行)
        </Button>
        <Button icon={<CheckCircleOutlined />} onClick={handleValidateAll}>
          校验全部
        </Button>
        <Button onClick={handleSelectPage}>
          {selectedRowKeys.length > 0 ? '取消全选' : '全选所有'}
        </Button>
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          重置数据
        </Button>

        {validateResult && (
          <span style={{ marginLeft: 8 }}>
            {validateResult.valid ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                校验通过
              </Tag>
            ) : (
              <Tag icon={<WarningOutlined />} color="error">
                {validateResult.count} 个错误
              </Tag>
            )}
          </span>
        )}
      </Space>

      <Table<Order>
        ref={tableRef}
        columns={columns}
        dataSource={data}
        rowKey="key"
        editable
        onEditableChange={(newData) => setData(newData as Order[])}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        }}
        scroll={{ x: 1600, y: 500 }}
        bordered
        size="small"
      />

      <BatchEditModal
        open={batchEditOpen}
        columns={columns as ColumnsType}
        selectedRowKeys={selectedRowKeys}
        data={data}
        getRowKey={(r): React.Key => r.key}
        onCancel={() => setBatchEditOpen(false)}
        onApply={handleBatchApply}
      />
    </div>
  );
}
