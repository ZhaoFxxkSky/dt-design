---
title: Table 数据表格
group: 数据展示
toc: content
demo:
  cols: 1
---

# Table 数据表格

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 如何使用

指定表格的数据源 dataSource 为一个数组。

```tsx
const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

<Table dataSource={dataSource} columns={columns}/>;
```

## 代码演示

<code src="./demos/virtual.tsx" description="通过 `virtual` 开启虚拟滚动，此时 `scroll.x` 与 `scroll.y` 必须设置且为 `number` 类型。">
虚拟列表</code>
<code src="./demos/responsive.tsx" description="响应式配置列的展示。">响应式</code>
