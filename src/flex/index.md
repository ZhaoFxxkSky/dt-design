---
title: Flex 布局
group: 组件
toc: content
---

# Flex 布局

## 何时使用

-   需要 Flex 布局

## 示例

<code src='./demos/basic.tsx' title="最简单的用法。">基本布局</code>
<code src='./demos/align.tsx' title="设置对齐方式。">对齐方式</code>
<code src='./demos/gap.tsx' title="使用 `gap` 设置元素之间的间距，预设了 `small`、`middle`、`large` 三种尺寸，也可以自定义间距。">设置间隙</code>
<code src='./demos/wrap.tsx' title="自动换行。">自动换行</code>
<code src='./demos/combination.tsx' title="嵌套使用，可以实现更复杂的布局。">组合使用</code>

## API

| 参数     | 说明                    | 类型                                                                                | 默认值   |
| -------- | ----------------------- | ----------------------------------------------------------------------------------- | -------- |
| vertical | flex 主轴的方向是否垂直 | `boolean`                                                                           | `false`  |
| wrap     | 主轴换行                | [flex-wrap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-wrap)             | `nowrap` |
| justify  | `justify-content`       | [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content) | `normal` |
| align    | `align-items`           | [align-items](https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-items)         | `normal` |
| flex     | `flex`                  | [flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)                       | `normal` |
| gap      | `gap`                   | [gap](https://developer.mozilla.org/zh-CN/docs/Web/CSS/gap)                         | `0`      |
| children | 展示内容                | `React.ReactNode`                                                                   | -        |
