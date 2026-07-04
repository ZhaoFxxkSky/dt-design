---
title: Splitter 分隔面板
group: 布局
toc: content
demo:
  cols: 1
---

# Splitter 分隔面板

自由切分指定区域

## 何时使用

- 可以水平或垂直地分隔区域。
- 当需要自由拖拽调整各区域大小。
- 当需要指定区域的最大最小宽高时。

## 示例

<code src="./demos/basic.tsx" description="初始化面板大小，面板大小限制。">基础使用</code> <code src="./demos/control.tsx" description="受控调整尺寸。当 Panel 之间任意一方禁用 `resizable`，则其拖拽将被禁用。"> 受控模式</code> <code src="./demos/vertical.tsx" description="使用垂直布局，可通过 `layout`/`orientation`/`vertical` 设置方向。">垂直方向</code> <code src="./demos/collapsible.tsx" description="配置 `collapsible` 提供快捷收缩能力。可以通过 `min` 限制收缩后不能通过拖拽展开。"> 可折叠</code> <code src="./demos/collapsibleIcon.tsx" description="配置 collapsible.showCollapsibleIcon 控制可折叠图标的显示方式。"> 可折叠图标显示</code> <code src="./demos/multiple.tsx" description="多面板">多面板</code>

[//]: # '<code src="./demos/size.tsx" description="自定义面板大小">自定义面板大小</code>'

<code src="./demos/group.tsx" description="复杂组合面板，快捷折叠，禁止改变大小">复杂组合</code> <code src="./demos/lazy.tsx" description="延迟渲染模式，拖拽时不会立即更新大小，而是等到松手时才更新。">延迟渲染模式</code>

## API

> Splitter 组件需要通过子元素计算面板大小，因而其子元素仅支持 `Splitter.Panel` 组件。

### Splitter

| 参数          | 说明             | 类型                        | 默认值       | 版本 |
| ------------- | ---------------- | --------------------------- | ------------ | ---- |
| layout        | 布局方向（兼容旧属性） | `horizontal` \| `vertical`  | `horizontal` | - |
| orientation   | 布局方向，优先级高于 `layout` | `horizontal` \| `vertical`  | - | 1.0.3 |
| vertical      | 是否垂直布局，优先级低于 `orientation` | `boolean` | `false` | 1.0.3 |
| onResizeStart | 开始拖拽之前回调 | `(sizes: number[]) => void` | - | - |
| onResize      | 面板大小变化回调 | `(sizes: number[]) => void` | - | - |
| onResizeEnd   | 拖拽结束回调 | `(sizes: number[]) => void` | - | - |
| onCollapse    | 面板折叠状态变化回调 | `(collapsed: boolean[], sizes: number[]) => void` | - | 1.0.3 |
| lazy          | 延迟渲染模式 | `boolean` | `false` | - |
| destroyOnHidden | 折叠后是否销毁面板内容 | `boolean` | `false` | 1.0.3 |
| draggerIcon   | 自定义拖拽图标 | `ReactNode` | - | 1.0.3 |
| motion        | 是否启用折叠展开动画 | `boolean` | `false` | 1.0.3 |

### Panel

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultSize | 初始面板大小，支持数字 px 或者文字 '百分比%' 类型 | `number \| string` | - | - |
| min | 最小阈值，支持数字 px 或者文字 '百分比%' 类型 | `number \| string` | - | - |
| max | 最大阈值，支持数字 px 或者文字 '百分比%' 类型 | `number \| string` | - | - |
| size | 受控面板大小，支持数字 px 或者文字 '百分比%' 类型 | `number \| string` | - | - |
| collapsible | 快速折叠 | `boolean \| { start?: boolean; end?: boolean; showCollapsibleIcon?: boolean \| 'auto'; icon?: { start?: ReactNode; end?: ReactNode }; motion?: boolean }` | `false` | showCollapsibleIcon: 1.0.0; icon/motion: 1.0.3 |
| resizable | 是否开启拖拽伸缩 | `boolean` | `true` | - |
| destroyOnHidden | 折叠后是否销毁面板内容，优先级高于 Splitter 的同名属性 | `boolean` | - | 1.0.3 |
