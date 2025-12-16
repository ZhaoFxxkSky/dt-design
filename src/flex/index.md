---
title: Flex 弹性布局
group: 
    title: 布局
    order: 2
toc: content
demo:
    cols: 1
order: 1
---

# Flex 标题

用于创建一个模块标题

## 何时使用

适合使用在需要简单描述的场景，或适用于将大量数据按照模块划分的场景。

## 示例

<code src="./demos/basic.tsx" description="最简单的用法。">基础使用</code>
<code src="./demos/align.tsx" description="设置对齐方式。">对齐方式</code>
<code src="./demos/gap.tsx" description="使用 `gap` 设置元素之间的间距，预设了 `small`、`middle`、`large` 三种尺寸，也可以自定义间距。">设置间隙</code>
<code src="./demos/wrap.tsx" description="自动换行。">自动换行</code>
<code src="./demos/combination.tsx" description="嵌套使用，可以实现更复杂的布局。">组合使用</code>

## API

### BlockHeader

| 属性        | 说明                                                   | 类型                                                                                | 默认值       |
| ----------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------ |
| vertical    | flex 主轴的方向是否垂直，使用 `flex-direction: column` | boolean                                                                             | `false`      |
| wrap        | 设置元素单行显示还是多行显示                           | [flex-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap) \| boolean  | nowrap       |
| justify     | 设置元素在主轴方向上的对齐方式                         | [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) | normal       |
| align       | 设置元素在交叉轴方向上的对齐方式                       | [align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items)         | normal       |
| flex        | flex CSS 简写属性                                      | [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)                       | normal       |
| gap         | 设置网格之间的间隙                                     | `small` \| `middle` \| `large` \| string \| number                                  | -            |
| component   | 自定义元素类型                                         | React.ComponentType                                                                 | `div`        |
| orientation | 主轴的方向类型                                         | `horizontal` \| `vertical`                                                          | `horizontal` |
