---
title: OverflowList 折叠列表
group:
  title: 数据展示
toc: content
demo:
  cols: 2
---

# OverflowList 自适应折叠列表

OverflowList 是一款自适应列表组件，可根据容器尺寸智能计算并展示尽可能多的列表项，超出部分自动折叠为统一的溢出元素，且容器尺寸变化时会实时重新计算可见项数量。

## 何时使用

- 列表项数量动态变化或内容长度不固定，需要自适应容器宽度/高度展示核心内容时；
- 需支持容器尺寸变化（如窗口缩放、响应式布局）时，自动重新调整可见项与折叠项的分界；
- 希望将溢出的列表项统一折叠为自定义样式的元素（如下拉菜单、更多按钮等），而非简单截断或滚动。

## 代码演示

<code src="./demos/basic.tsx" title="基本使用" description="基本使用。"></code> <code src="./demos/collapse-direction.tsx" title="折叠方向" description="支持 `collapseFrom` 设置折叠方向。"></code> <code src="./demos/min-visible-items.tsx" title="最小展示的数目" description="支持 `minVisibleItems` 设置最小展示的数目。。"></code>

## API

### OverflowList

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className | 自定义类名 | string | - |
| renderMode | 渲染模式 | `collapse` \| `scroll` | `collapse` |
| style | 自定义样式 | React.CSSProperties | - |
| items | 渲染项目列表 | Record<string, any>[] | - |
| minVisibleItems | 最小展示的可见项数目 | `number` | `0` |
| onOverflow | 溢出项变化时的回调函数 | `(overflowItems: Record<string, any>[]) => void` | - |
| overflowRenderer | 溢出项的自定义渲染函数 | `(overflowItems: Record<string, any>[]) => React.ReactNode` | - |
| visibleItemRenderer | 可见项的自定义渲染函数 | `(item: Record<string, any>, index: number) => React.ReactElement` | - |
| vertical | flex 主轴的方向是否垂直（使用 `flex-direction: column`） | `boolean` | `false` |
