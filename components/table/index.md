---
title: Table 表格
group: 数据展示
toc: content
demo:
  cols: 1
---

# Table 表格

企业级表格组件，完全对齐 antd v5 Table API，支持 React 17 + LESS。

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、筛选、选择等操作时；
- 当需要大数据量下的虚拟滚动渲染时；
- 当需要固定列、粘性表头等复杂布局时。

## 基础用法

<code src="./demos/basic.tsx" description="最简单的用法，展示数据列。">基础表格</code>

<code src="./demos/bordered.tsx" description="通过 `bordered` 属性展示外边框和列边框。">带边框表格</code>

<code src="./demos/size.tsx" description="通过 `size` 属性切换表格大小（大/中/小）。">表格尺寸</code>

<code src="./demos/show-header.tsx" description="通过 `showHeader` 控制表头的显示与隐藏。">隐藏表头</code>

## 列样式

<code src="./demos/align.tsx" description="通过 `column.align` 设置列的对齐方式（left/center/right）。">列对齐</code>

<code src="./demos/ellipsis.tsx" description="通过 `column.ellipsis` 设置单元格内容省略，超长文本以省略号显示。">省略号</code>

<code src="./demos/custom-render.tsx" description="通过 `column.render` 自定义单元格渲染内容。">自定义渲染</code>

<code src="./demos/row-class.tsx" description="通过 `rowClassName` 设置行的样式类名。">行样式</code>

<code src="./demos/table-layout.tsx" description="通过 `tableLayout` 设置表格布局算法（fixed/auto），fixed 模式下列宽固定不随内容变化。">表格布局</code>

## 数据操作

<code src="./demos/sorter.tsx" description="通过 `column.sorter` 实现列排序，支持升序/降序切换。">列排序</code>

<code src="./demos/filter.tsx" description="通过 `column.filters` 和 `column.onFilter` 实现列筛选，支持多列同时筛选。">列筛选</code>

<code src="./demos/selection.tsx" description="通过 `rowSelection` 实现行选择，支持 Checkbox / Radio 模式及自定义选择项。">行选择</code>

## 滚动与固定

<code src="./demos/fixed-columns.tsx" description="通过 `column.fixed` 和 `scroll.x` 实现固定列效果，左侧固定姓名列、右侧固定操作列，12 列横向滚动。">固定列（多列+长内容）</code>

<code src="./demos/scroll-y.tsx" description="通过 `scroll.y` 设置固定表头垂直滚动。">固定表头</code>

<code src="./demos/scroll-xy.tsx" description="同时设置 `scroll.x` 和 `scroll.y` 实现双向滚动。">双向滚动</code>

<code src="./demos/sticky.tsx" description="通过 `sticky` 属性让表头在页面滚动时粘性吸顶。">粘性表头</code>

## 展开与树形

<code src="./demos/expand-row.tsx" description="通过 `expandable.expandedRowRender` 实现行展开功能。">行展开</code>

<code src="./demos/expand-row-by-click.tsx" description="设置 `expandable.expandRowByClick` 后点击行即可展开。">点击行展开</code>

<code src="./demos/tree-data.tsx" description="通过 `expandable.childrenColumnName` 实现树形数据展示。">树形数据</code>

## 其他功能

<code src="./demos/title-footer.tsx" description="通过 `title` 和 `footer` 设置表格头部和底部区域。">标题与页脚</code>

<code src="./demos/summary.tsx" description="通过 `summary` 属性在表格底部渲染合计行。">合计行</code>

<code src="./demos/colspan-rowspan.tsx" description="通过 `render` 返回 `{ children, props: { colSpan, rowSpan } }` 实现合并单元格。">合并单元格</code>

<code src="./demos/loading.tsx" description="通过 `loading` 属性显示加载状态。">加载态</code>

<code src="./demos/on-row.tsx" description="通过 `onRow` 设置行级事件回调（点击、双击等）。">行事件</code>

<code src="./demos/hover.tsx" description="默认行 hover 高亮，通过 `rowHoverable` 可以禁用。">行 Hover</code>

<code src="./demos/no-data.tsx" description="当 `dataSource` 为空数组时展示空状态。">空状态</code>

## 高级用法

<code src="./demos/virtual-scroll.tsx" description="设置 `virtual` 和 `scroll.y` 启用虚拟滚动，适用于大数据量场景。">虚拟滚动</code>

<code src="./demos/comprehensive.tsx" description="固定列 + 固定表头 + 行展开 + 合计行 + 排序 的综合示例。">综合示例</code>

## 列宽拖拽

<code src="./demos/resize.tsx" description="通过 `resizable` 属性和 `column.resize` 配置实现表头拖拽改变列宽。鼠标悬停到列右边框高亮，拖拽时显示竖线指示器，松开后改变宽度。">拖拽调整列宽</code>

## 可编辑单元格

<code src="./demos/editable.tsx" description="通过 `editable` 属性和 `column.editable` 配置实现可编辑单元格，支持校验规则、Popover 错误提示、自动滚动到错误行。">可编辑与校验</code>

<code src="./demos/editable-row.tsx" description="行级编辑模式，点击编辑→修改→保存/取消，支持数据回退、计算列、行新增/删除。">行级编辑模式</code>

<code src="./demos/batch-edit.tsx" description="勾选多行后批量编辑，支持三种规则：固定值填充、查找替换、序列生成。含分页+编辑、效果预览。">批量编辑 + 分页</code>

## API

### Table

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dataSource | 数据数组 | `readonly RecordType[]` | `[]` |
| columns | 表格列的配置描述，具体项见下表 | `ColumnsType` | `[]` |
| rowKey | 表格行 key 的取值，可以是字符串或一个函数 | `string \| GetRowKey` | `key` |
| tableLayout | 表格元素的 `table-layout` 属性，设为 `fixed` 表示内容不会影响列的布局 | `auto \| fixed` | - |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽高 | `{ x?: number \| string \| true; y?: number \| string; scrollToFirstRowOnChange?: boolean }` | - |
| sticky | 设置粘性表头和滚动条 | `boolean \| TableSticky` | - |
| virtual | 是否开启虚拟滚动 | `boolean` | `false` |
| bordered | 是否展示外边框和列边框 | `boolean` | `false` |
| size | 表格大小 | `large \| middle \| small` | `large` |
| showHeader | 是否显示表头 | `boolean` | `true` |
| title | 表格标题 | `(data) => ReactNode` | - |
| footer | 表格页脚 | `(data) => ReactNode` | - |
| summary | 表格总结栏 | `(data) => ReactNode` | - |
| loading | 页面是否加载中 | `boolean \| SpinProps` | `false` |
| rowSelection | 表格行是否可选择 | `TableRowSelection` | - |
| rowClassName | 表格行的类名 | `string \| (record, index, indent) => string` | - |
| rowHoverable | 表格行是否可悬浮 | `boolean` | `true` |
| onRow | 设置行属性 | `(record, index) => HTMLAttributes` | - |
| onHeaderRow | 设置头部行属性 | `(columns, index) => HTMLAttributes` | - |
| onChange | 分页、排序、筛选变化时触发 | `(pagination, filters, sorter, extra) => void` | - |
| expandable | 展开行配置 | `ExpandableConfig` | - |
| pagination | 分页器配置 | `false \| TablePaginationConfig` | - |
| sortDirections | 支持的排序方式 | `SortOrder[]` | `['ascend', 'descend']` |
| showSorterTooltip | 表头是否显示排序提示 | `boolean \| SorterTooltipProps` | `{ target: 'full-header' }` |
| getPopupContainer | 浮层渲染父节点 | `(triggerNode) => HTMLElement` | - |
| className | 表格容器类名 | `string` | - |
| style | 表格容器样式 | `CSSProperties` | - |
| prefixCls | 样式前缀 | `string` | `ant-table` |
| resizable | 是否全局开启列宽拖拽调整 | `boolean` | `false` |
| onColumnResize | 列宽调整完成回调 | `(key, width) => void` | - |
| editable | 是否全局开启可编辑 | `boolean` | `false` |
| onEditableChange | 可编辑模式数据变化回调 | `(data) => void` | - |
| onValidate | 校验回调 | `(result) => void` | - |

### Column

列描述数据对象，是 columns 中的一项。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | `ReactNode \| ((props) => ReactNode)` | - |
| dataIndex | 列数据在数据项中对应的路径 | `string \| number \| (string\|number)[]` | - |
| key | React 需要的 key | `Key` | - |
| width | 列宽度 | `number \| string` | - |
| fixed | 列是否固定 | `left \| right` | - |
| align | 设置列的对齐方式 | `left \| right \| center` | - |
| ellipsis | 超过宽度将自动省略 | `boolean \| { showTitle?: boolean }` | - |
| render | 生成复杂数据的渲染函数 | `(value, record, index) => ReactNode \| RenderedCell` | - |
| sorter | 排序函数 | `boolean \| CompareFn \| ColumnSorter` | - |
| sortOrder | 排序的受控属性 | `SortOrder` | - |
| defaultSortOrder | 默认排序顺序 | `SortOrder` | - |
| sortDirections | 支持的排序方式 | `SortOrder[]` | - |
| filters | 表头筛选菜单项 | `ColumnFilterItem[]` | - |
| filtered | 是否过滤 | `boolean` | - |
| filteredValue | 过滤的受控属性 | `FilterValue \| null` | - |
| onFilter | 筛选函数 | `(value, record) => boolean` | - |
| filterMultiple | 是否多选 | `boolean` | `true` |
| responsive | 响应式断点 | `Breakpoint[]` | - |
| className | 列的 className | `string` | - |
| style | 列的样式 | `CSSProperties` | - |
| onCell | 设置单元格属性 | `(record, index) => HTMLAttributes` | - |
| onHeaderCell | 设置头部单元格属性 | `(column) => HTMLAttributes` | - |
| resize | 列宽拖拽配置 | `{ resizable?: boolean; minWidth?: number; maxWidth?: number }` | - |
| resizable | 是否可拖拽调整列宽，覆盖 Table.resizable | `boolean` | - |
| minWidth | 最小列宽（拖拽限制） | `number` | `60` |
| maxWidth | 最大列宽（拖拽限制） | `number` | - |
| onResize | 列宽变化回调 | `(width: number) => void` | - |
| editable | 可编辑配置，可为 `boolean` 或详细配置对象 | `boolean \| EditableConfig` | - |

### ExpandableConfig

展开行的配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expandedRowRender | 额外的展开行渲染函数 | `(record, index, indent, expanded) => ReactNode` | - |
| expandedRowKeys | 展开行的受控 key 列表 | `Key[]` | - |
| defaultExpandedRowKeys | 默认展开的行 | `Key[]` | - |
| defaultExpandAllRows | 初始时是否展开所有行 | `boolean` | `false` |
| expandRowByClick | 点击行展开 | `boolean` | `false` |
| onExpand | 点击展开图标时触发 | `(expanded, record) => void` | - |
| onExpandedRowsChange | 展开的行变化时触发 | `(expandedKeys: Key[]) => void` | - |
| rowExpandable | 是否允许行展开 | `(record) => boolean` | - |
| childrenColumnName | 指定树形结构的列名 | `string` | `children` |
| indentSize | 树形数据缩进宽度 | `number` | `15` |
| expandIconColumnIndex | 展开图标所在列索引 | `number` | `0` |
| expandedRowClassName | 展开行的 className | `string \| RowClassName` | - |

### TableRowSelection

行选择配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 多选/单选 | `checkbox \| radio` | `checkbox` |
| selectedRowKeys | 选中项的 key 数组 | `Key[]` | - |
| onChange | 选中项发生变化时回调 | `(selectedRowKeys, selectedRows, info) => void` | - |
| getCheckboxProps | 选择框的默认属性 | `(record) => CheckboxProps` | - |
| onSelect | 用户手动选择/取消选择某行回调 | `(record, selected, selectedRows, nativeEvent) => void` | - |
| selections | 自定义选择项 | `SelectionItem[] \| boolean` | - |
| hideSelectAll | 隐藏全选按钮 | `boolean` | `false` |
| fixed | 把选择框列固定 | `FixedType` | - |
| columnWidth | 选择框列宽度 | `string \| number` | - |

### TableSticky

| 参数          | 说明                                | 类型                | 默认值 |
| ------------- | ----------------------------------- | ------------------- | ------ |
| offsetHeader  | 距离顶部多少距离时触发吸顶          | `number`            | `0`    |
| offsetScroll  | 距离底部多少距离时触发吸底          | `number`            | `0`    |
| offsetSummary | 距离顶部多少距离时触发 summary 吸顶 | `number`            | `0`    |
| getContainer  | 获取吸顶容器                        | `() => HTMLElement` | -      |

### EditableConfig

可编辑列配置。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 编辑器类型 | `'input' \| 'number' \| 'select' \| 'custom'` | `'input'` |
| options | Select 选项 | `{ label: ReactNode; value: any }[]` | - |
| renderEditor | 自定义编辑器渲染函数 | `(value, record, index, onChange) => ReactNode` | - |
| rules | 校验规则 | `EditableRule[]` | - |
| onChange | 单元格值变化回调 | `(value, record, index) => void` | - |
| onSave | 保存回调（失焦时触发） | `(value, record, index) => void` | - |

### BatchEditModal

批量编辑弹窗组件，配合 `rowSelection` 使用。

| 参数            | 说明              | 类型                           | 默认值 |
| --------------- | ----------------- | ------------------------------ | ------ |
| open            | 是否打开          | `boolean`                      | -      |
| columns         | 列配置            | `ColumnsType`                  | -      |
| selectedRowKeys | 选中行的 key 集合 | `React.Key[]`                  | -      |
| data            | 完整数据          | `any[]`                        | -      |
| getRowKey       | 行 key 获取函数   | `(record, index) => React.Key` | -      |
| onCancel        | 取消回调          | `() => void`                   | -      |
| onApply         | 确认应用回调      | `(newData: any[]) => void`     | -      |

#### 批量编辑规则类型

| 类型       | 说明       | 适用字段      |
| ---------- | ---------- | ------------- |
| `value`    | 固定值填充 | 所有字段      |
| `replace`  | 查找替换   | 所有字段      |
| `sequence` | 序列生成   | 文本/数字字段 |
