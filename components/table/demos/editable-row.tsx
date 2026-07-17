import React from 'react';
import { Button, message, Space, Switch, Tag, Tooltip, Typography } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Summary, Table } from '@dtjoy/dt-design';
import type { ColumnsType, EditableConfig, Reference } from '@dtjoy/dt-design';

const { Text } = Typography;

// ============================================================
// 类型定义
// ============================================================
interface OrderItem {
  key: string;
  sku: string;
  productName: string;
  category: string;
  quantity: number | undefined;
  unitPrice: number | undefined;
  discount: number | undefined;
  inStock: boolean;
  supplier: string;
  remark: string;
}

// ============================================================
// 选项数据
// ============================================================
const categoryOptions = [
  { label: '电子产品', value: '电子产品' },
  { label: '办公用品', value: '办公用品' },
  { label: '食品', value: '食品' },
  { label: '服装', value: '服装' },
];

const supplierOptions = [
  { label: '供应商A', value: '供应商A' },
  { label: '供应商B', value: '供应商B' },
  { label: '供应商C', value: '供应商C' },
  { label: '供应商D', value: '供应商D' },
];

// ============================================================
// 初始数据
// ============================================================
const initialData: OrderItem[] = [
  {
    key: '1',
    sku: 'SKU-001',
    productName: '无线鼠标',
    category: '电子产品',
    quantity: 100,
    unitPrice: 59.9,
    discount: 5,
    inStock: true,
    supplier: '供应商A',
    remark: '畅销品',
  },
  {
    key: '2',
    sku: 'SKU-002',
    productName: '机械键盘',
    category: '电子产品',
    quantity: 50,
    unitPrice: 299,
    discount: 10,
    inStock: true,
    supplier: '供应商B',
    remark: ' Cherry 轴',
  },
  {
    key: '3',
    sku: 'SKU-003',
    productName: 'A4打印纸',
    category: '办公用品',
    quantity: 500,
    unitPrice: 25,
    discount: 0,
    inStock: true,
    supplier: '供应商C',
    remark: '',
  },
  {
    key: '4',
    sku: 'SKU-004',
    productName: '',
    category: '',
    quantity: undefined,
    unitPrice: undefined,
    discount: undefined,
    inStock: false,
    supplier: '',
    remark: '',
  },
  {
    key: '5',
    sku: 'SKU-005',
    productName: '蓝牙耳机',
    category: '电子产品',
    quantity: 200,
    unitPrice: 199,
    discount: 15,
    inStock: true,
    supplier: '供应商A',
    remark: '新品上架',
  },
];

// ============================================================
// 计算行总价
// ============================================================
const calcRowTotal = (row: OrderItem): number => {
  const qty = row.quantity || 0;
  const price = row.unitPrice || 0;
  const discount = row.discount || 0;
  return qty * price * (1 - discount / 100);
};

// ============================================================
// 主组件 — 行级编辑模式
// ============================================================
export default function Demo() {
  const [data, setData] = React.useState<OrderItem[]>(initialData);
  const tableRef = React.useRef<Reference>(null);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [backupRow, setBackupRow] = React.useState<OrderItem | null>(null);

  const isEditing = (record: OrderItem) => record.key === editingKey;

  // ---------- 行级编辑操作 ----------
  const handleEdit = (record: OrderItem) => {
    setBackupRow({ ...record });
    setEditingKey(record.key);
  };

  const handleCancel = (key: string) => {
    if (backupRow) {
      setData((prev) => prev.map((r) => (r.key === key ? backupRow : r)));
    }
    setEditingKey(null);
    setBackupRow(null);
    tableRef.current?.resetErrors();
  };

  const handleSave = async (_key: string) => {
    const result = await tableRef.current?.validate();
    if (result?.valid) {
      setEditingKey(null);
      setBackupRow(null);
      message.success('保存成功');
    } else {
      message.error(`校验失败：${result?.errors.size ?? 0} 个错误`);
    }
  };

  const handleDelete = (_key: string) => {
    setData((prev) => prev.filter((r) => r.key !== _key));
    if (editingKey === _key) {
      setEditingKey(null);
      setBackupRow(null);
    }
    message.success('已删除');
  };

  // 构建列 — 只有编辑中的行显示编辑器，其他行显示文本
  const columns: ColumnsType<OrderItem> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      editable: {
        type: 'input',
        rules: [
          { required: true, message: 'SKU必填' },
          { pattern: /^SKU-\d{3}$/, message: '格式：SKU-XXX' },
        ],
      } as EditableConfig,
      render: (val: string) => <Text code>{val || '—'}</Text>,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      editable: {
        type: 'input',
        rules: [{ required: true, message: '商品名称必填' }],
      } as EditableConfig,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
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
      width: 90,
      align: 'right' as const,
      editable: {
        type: 'number',
        rules: [
          { required: true, message: '数量必填' },
          {
            validator: (v: number) => (v != null && v <= 0 ? '数量必须大于0' : undefined),
          },
        ],
      } as EditableConfig,
    },
    {
      title: '单价(元)',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 100,
      align: 'right' as const,
      editable: {
        type: 'number',
        rules: [
          { required: true, message: '单价必填' },
          {
            validator: (v: number) => (v != null && v <= 0 ? '单价必须大于0' : undefined),
          },
        ],
      } as EditableConfig,
      render: (val: number) => (val != null ? `¥${val.toFixed(2)}` : ''),
    },
    {
      title: '折扣(%)',
      dataIndex: 'discount',
      key: 'discount',
      width: 90,
      align: 'right' as const,
      editable: {
        type: 'number',
        rules: [
          {
            validator: (v: number) =>
              v != null && (v < 0 || v > 100) ? '折扣范围 0-100' : undefined,
          },
        ],
      } as EditableConfig,
      render: (val: number) => (val != null && val > 0 ? <Tag color="orange">{val}%</Tag> : '—'),
    },
    {
      title: '小计(元)',
      key: 'subtotal',
      width: 120,
      align: 'right' as const,
      render: (_val: unknown, record: OrderItem) => {
        const total = calcRowTotal(record);
        return (
          <Text strong style={{ color: '#1890ff' }}>
            ¥{total.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: '在库',
      dataIndex: 'inStock',
      key: 'inStock',
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
      render: (val: boolean) => (val ? <Tag color="green">在库</Tag> : <Tag color="red">缺货</Tag>),
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 120,
      editable: {
        type: 'select',
        options: supplierOptions,
        rules: [{ required: true, message: '供应商必填' }],
      } as EditableConfig,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      editable: {
        type: 'input',
      } as EditableConfig,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_val: unknown, record: OrderItem) => (
        <Space size="small">
          {isEditing(record) ? (
            <>
              <Tooltip title="保存">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleSave(record.key)}
                />
              </Tooltip>
              <Tooltip title="取消">
                <Button
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => handleCancel(record.key)}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="编辑">
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  disabled={editingKey !== null}
                />
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="link"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.key)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    const newKey = String(Date.now());
    const newRow: OrderItem = {
      key: newKey,
      sku: '',
      productName: '',
      category: '',
      quantity: undefined,
      unitPrice: undefined,
      discount: 0,
      inStock: false,
      supplier: '',
      remark: '',
    };
    setData((prev) => [...prev, newRow]);
    setBackupRow({ ...newRow });
    setEditingKey(newKey);
  };

  const handleReset = () => {
    setData(initialData);
    setEditingKey(null);
    setBackupRow(null);
    tableRef.current?.resetErrors();
  };

  const handleValidateAll = async () => {
    const result = await tableRef.current?.validate();
    if (result?.valid) {
      message.success('全部校验通过！');
    } else {
      message.error(`发现 ${result?.errors.size ?? 0} 个错误`);
    }
  };

  // ---------- 统计 ----------
  const grandTotal = data.reduce((sum, r) => sum + calcRowTotal(r), 0);
  const totalItems = data.reduce((sum, r) => sum + (r.quantity || 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>可编辑表格 — 订单管理行级编辑</h2>

      <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
        <Space direction="vertical" size="small">
          <Text strong>覆盖场景：</Text>
          <Text type="secondary">
            ✅ 行级编辑模式（点击编辑 → 修改 → 保存/取消，支持数据回退） ✅ Input / InputNumber /
            Select / Switch 四种编辑器 ✅ 必填 + 正则 + 范围校验 ✅ 计算列（小计 = 数量 × 单价 × (1
            - 折扣%)） ✅ 固定操作列 ✅ 行新增/删除 ✅ 统计合计行 ✅ 自定义渲染（Tag、Text
            code、格式化金额）
          </Text>
        </Space>
      </div>

      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={handleValidateAll}>
          校验全部
        </Button>
        <Button onClick={handleReset} icon={<ReloadOutlined />}>
          重置
        </Button>
        <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
          新增商品
        </Button>
      </Space>

      <Table<OrderItem>
        ref={tableRef}
        columns={columns}
        dataSource={data}
        rowKey="key"
        editable
        onEditableChange={(newData) => setData(newData as OrderItem[])}
        scroll={{ x: 1400, y: 400 }}
        bordered
        rowClassName={(record) => (isEditing(record) ? 'editable-row-editing' : '')}
        summary={(pageData) => {
          const total = pageData.reduce((sum, r) => sum + calcRowTotal(r), 0);
          const items = pageData.reduce((sum, r) => sum + (r.quantity || 0), 0);
          return (
            <Summary fixed>
              <Summary.Row>
                <Summary.Cell index={0} colSpan={3}>
                  <Text strong>合计</Text>
                </Summary.Cell>
                <Summary.Cell index={3} align="right">
                  <Text strong>{items}</Text>
                </Summary.Cell>
                <Summary.Cell index={4} colSpan={2} />
                <Summary.Cell index={5} align="right">
                  <Text strong style={{ color: '#cf1322', fontSize: 14 }}>
                    ¥{total.toFixed(2)}
                  </Text>
                </Summary.Cell>
                <Summary.Cell index={6} colSpan={5} />
              </Summary.Row>
            </Summary>
          );
        }}
      />

      {/* 统计 */}
      <Space style={{ marginTop: 16 }} size="large">
        <Text>
          商品种类：<Text strong>{data.length}</Text>
        </Text>
        <Text>
          总数量：<Text strong>{totalItems}</Text>
        </Text>
        <Text>
          订单总额：
          <Text strong style={{ color: '#cf1322' }}>
            ¥{grandTotal.toFixed(2)}
          </Text>
        </Text>
      </Space>
    </div>
  );
}
