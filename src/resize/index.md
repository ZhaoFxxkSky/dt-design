---
title: Resize 事件监听
group: 
    title: 其他
    order: 4
toc: content
demo:
    cols: 2
---

# Button 按钮

## 何时使用

按钮用于开始一个即时操作。

## 代码演示

<code src="./demos/basic.tsx" title="基本使用" description="请调整窗口大小以查看效果"></code>
<code src="./demos/observer-ele.tsx" title="监听自定义元素" description="请调整元素大小以查看效果，通过设置`observerEle`自定义监听元素"></code>


## API

### Resize

| 参数        | 说明                                     | 类型              | 默认值 |
| ----------- | ---------------------------------------- | ----------------- | ------ |
| children    | 子元素                                   | `React.ReactNode` | -      |
| observerEle | 监听的元素,传入元素不存在默认监听 window | `HTMLElement`     | -      |
| onResize    | 重置元素大小的函数                       | `() => void`      | -      |