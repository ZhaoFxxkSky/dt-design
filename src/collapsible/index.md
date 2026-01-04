---
title: Collapsible 折叠
group:
    title: 数据展示
    order: 3
toc: content
demo:
    cols: 2
---

# Collapsible 折叠

行为组件，是一个用于展开或折叠内容的容器。

## 何时使用
- `Collapsible` 是一个行为组件，默认开启动画效果。
- 当`antd`和`dt-design`组件不能满足需求或者需要自定义一些折叠行为时，可以使用 `Collapsible` 来包裹需要展开或者折叠的内容。


## 代码演示

<code src="./demos/basic.tsx" title="基本使用" description="通过 `isOpen` 来控制内容的展开或者折叠。"></code>
<code src="./demos/custom-transition.tsx" title="自定义动画时间" description="通过 `duration` 设置动画展开或者折叠的时间，也可以通过 `motion` 来关闭动画。"></code>
<code src="./demos/nested-use.tsx" title="嵌套使用" description="嵌套使用"></code>
<code src="./demos/custom-collapse-height.tsx" title="自定义折叠高度" description="可以使用 `collapseHeight` 自定义收起的高度"></code>

## API

### Collapsible

| 属性           | 说明                                                                  | 类型                   | 默认值  |
| -------------- | --------------------------------------------------------------------- | ---------------------- | ------- |
| className      | 类名                                                                  | `string`               | -       |
| collapseHeight | 折叠高度                                                              | `number`               | `0`     |
| duration       | 动画执行的时间                                                        | `number`               | `250`   |
| fade           | 是否开启淡入淡出                                                      | `boolean`              | `false` |
| isOpen         | 是否展开内容区域                                                      | `boolean`              | `false` |
| keepDOM        | 是否保留隐藏的面板 DOM 树，默认销毁                                   | `boolean`              | `false` |
| lazyRender     | 配合 keepDOM 使用，为 true 时挂载时不会渲染组件                       | `boolean`              | `false` |
| motion         | 是否开启动画                                                          | `boolean`              | `true`  |
| onMotionEnd    | 动画结束的回调                                                        | `() => void `          | -       |
| reCalcKey      | 当 reCalcKey 改变时，将重新计算子节点的高度，用于优化动态渲染时的计算 | `number` \| `string`   | -       |
| style          | 样式                                                                  | `React.CSSProperties ` | -       |
| id             | id                                                                    | `string`               | -       |

## 注意事项

### ARIA

-   Collapsible 具有 `id` props，传入的值会被设置为 wrapper 元素的 id, 可以配合其他组件的 `aria-controls` 指明控制关系, 见下方使用示例。

```tsx | pure
import { useState } from 'react';
import { Button, Collapsible } from '@dtjoy/dt-design';

export default function () {
    const collapseId = 'myCollapsible';
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button onClick={() => setVisible(!visible)} aria-controls={`${collapseId}`}>
                {visible ? 'hide' : 'show'}
            </Button>
            <Collapsible isOpen={visible} id={collapseId}>
                <div>hide content</div>
            </Collapsible>
        </>
    );
}
```

## FAQ

-   为什么使用 Collapsible 没有正常展开?<br/>
    检查 Collapsible 父级是否设置 display:none，此时因为无法拿到节点高度，会出现无法展开的问题。
