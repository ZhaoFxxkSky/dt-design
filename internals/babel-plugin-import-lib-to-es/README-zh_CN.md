# babel-plugin-import-lib-to-es

[English](./README.md) · [简体中文](./README-zh_CN.md)

一个 Babel 插件，在编译期将 `<pkg>/lib` 子路径导入重写为 `<pkg>/es`，使 ESM 产物始终消费上游包的 ES 模块图。

```diff
- import { Button } from 'foo-lib/lib/button';
+ import { Button } from 'foo-lib/es/button';
```

---

## 目录

- [特性](#特性)
- [何时使用](#何时使用)
- [用法](#用法)
  - [通过 `babel.config.js`](#通过-babelconfigjs)
  - [通过 `.babelrc`](#通过-babelrc)
  - [配合构建工具](#配合构建工具)
- [选项](#选项)
  - [`exclude`](#exclude)
  - [`include`](#include)
- [重写规则](#重写规则)
- [工作原理](#工作原理)
- [设计原则](#设计原则)
- [实战示例](#实战示例)
  - [默认：重写任意包](#默认重写任意包)
  - [Monorepo 自定义作用域](#monorepo-自定义作用域)
  - [与 `babel-plugin-import` 协同](#与-babel-plugin-import-协同)
- [常见问题](#常见问题)
- [测试](#测试)

---

## 特性

- **编译期重写** —— `<pkg>/lib` → `<pkg>/es`，零运行时开销。
- **任意包，零配置** —— 默认重写所有 `/lib` 子路径，新增依赖无需任何配置。
- **作用域感知** —— 正确处理 `@scope/name/lib/...`（在匹配 `include` / `exclude` 时捕获完整的带作用域包名）。
- **纯函数 & 确定性** —— 不触碰文件系统。输出不依赖 `cwd` 或 `node_modules` 布局，构建在不同环境下可复现。
- **与 `babel-plugin-import` 协同** —— 在 `Program.exit` 执行，同一 pass 中由 `babel-plugin-import` 生成的导入也会被重写。
- **语法覆盖全面** —— `import`、`export ... from`、`export * from`、裸 `require()`、动态 `import()` 均已覆盖。

## 何时使用

当你在为组件库构建 **ESM** 产物，而源码中引用了上游包的 CommonJS 子路径（`/lib`）时，使用本插件。这些 `/lib` 路径通常来源于：

1. **源码直接导入内部模块**，例如 `import { Config } from 'foo-lib/lib/config'`。
2. **`babel-plugin-import` 生成的代码** —— 当 `babel-plugin-import` 展开 `import { Button } from 'foo-lib'` 时，会生成 `foo-lib/lib/button`。

在 ESM 产物中保留 `/lib` 路径会迫使打包器同时加载 CJS 模块图与 ES 模块图，导致：

- **模块实例重复** —— 同一模块从 `/lib`（CJS）和 `/es`（ESM）加载是两个不同的实例；对于依赖模块级单例（如 React Context）的库，这会破坏单例保证。
- **Tree Shaking 失效** —— CJS 模块无法静态分析，整个 CJS 模块图会被打包进去。
- **模块格式不一致** —— ESM 产物应形成单一的、一致的 ES 模块图。

> **不要**为 CommonJS（`lib`）构建注册本插件。CJS 构建必须保留 `/lib` 路径不变。

## 用法

**仅**为 ESM 构建环境注册本插件。CJS 构建必须保留 `/lib` 路径不变。

### 通过 `babel.config.js`

```js
module.exports = (api) => {
  const isESM = api.env('esm');

  return {
    plugins: [
      isESM && [
        require.resolve('./internals/babel-plugin-import-lib-to-es'),
        // 可选: { exclude: ['lodash'] }
      ],
    ].filter(Boolean),
  };
};
```

### 通过 `.babelrc`

```json
{
  "env": {
    "esm": {
      "plugins": [["./internals/babel-plugin-import-lib-to-es", { "exclude": ["lodash"] }]]
    }
  }
}
```

### 配合构建工具

<details>
<summary><strong>father</strong></summary>

```ts
// .fatherrc.ts
import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    extraBabelPlugins: [require.resolve('./internals/babel-plugin-import-lib-to-es')],
  },
  cjs: {
    // 不要为 CJS 构建注册本插件。
  },
});
```

</details>

<details>
<summary><strong>Rollup (@rollup/plugin-babel)</strong></summary>

```js
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/index.ts',
  output: { format: 'esm', dir: 'es' },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      plugins: [['./internals/babel-plugin-import-lib-to-es', { exclude: ['lodash'] }]],
    }),
  ],
};
```

</details>

<details>
<summary><strong>Webpack (babel-loader)</strong></summary>

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [['./internals/babel-plugin-import-lib-to-es', { exclude: ['lodash'] }]],
          },
        },
      },
    ],
  },
};
```

</details>

## 选项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| [`exclude`](#exclude) | `Array<string \| RegExp>` | `[]` | **不**重写其 `/lib` 路径的包名。 |
| [`include`](#include) | `Array<string \| RegExp>` | — | 严格模式：提供后**仅**重写这些包名。优先级高于 `exclude`。 |

默认情况下，插件会重写**任意**包的 `/lib` 路径。如果被重写的包没有 `/es` 目录，构建时会在模块解析阶段报错——将其加入 `exclude` 即可。

### `exclude`

不重写的包名。接受字符串（精确匹配）或 `RegExp`（对捕获到的包名进行匹配）。

```js
// lodash 没有 /es 目录 —— 排除它
[
  './internals/babel-plugin-import-lib-to-es',
  { exclude: ['lodash'] },
]

// 按正则排除
[
  './internals/babel-plugin-import-lib-to-es',
  { exclude: [/^lodash/] },
]
```

### `include`

切换为严格模式：仅重写列出的包名。`include` 优先级高于 `exclude`。

```js
// 仅重写特定作用域下的包
['./internals/babel-plugin-import-lib-to-es', { include: [/^@my-scope\//, /^rc-/] }];
```

## 重写规则

### 路径模式

| 模式                 | 是否重写 | 示例                                           |
| -------------------- | -------- | ---------------------------------------------- |
| `<pkg>/lib`          | ✅       | `foo-lib/lib` → `foo-lib/es`                   |
| `<pkg>/lib/<sub>`    | ✅       | `foo-lib/lib/button` → `foo-lib/es/button`     |
| `@scope/pkg/lib/...` | ✅       | `@scope/pkg/lib/hooks` → `@scope/pkg/es/hooks` |
| `<pkg>`（包根）      | ❌       | `foo-lib` — 不处理                             |
| `<pkg>/<其他>`       | ❌       | `lodash/merge` — 不处理                        |
| 相对路径             | ❌       | `./lib/utils` — 不处理                         |

### 支持的语法

重写覆盖以下 AST 节点的 `source`：

| AST 节点                          | 示例                                          |
| --------------------------------- | --------------------------------------------- |
| `ImportDeclaration`               | `import X from 'foo-lib/lib/button'`          |
| `ExportNamedDeclaration`          | `export { default } from 'foo-lib/lib/hooks'` |
| `ExportAllDeclaration`            | `export * from 'foo-lib/lib/locale'`          |
| `CallExpression`（裸 `require`）  | `const X = require('foo-lib/lib/button')`     |
| `CallExpression`（动态 `import`） | `import('foo-lib/lib/button')`                |

## 工作原理

插件注册 `Program.exit` 访问器，遍历 AST 并重写 import / export / require / 动态 import 节点的 `source` 字符串。

选择在 `Program.exit`（而非 `enter`）执行是刻意为之：确保同一编译 pass 中由其他插件**生成**的导入也能被重写——最典型的是 `babel-plugin-import`，它会在自己的 `Program.exit` 中将 `import { Button } from 'foo-lib'` 展开为 `foo-lib/lib/button`。

```
源码                          babel-plugin-import            本插件
──────                        ──────────────────            ──────────────
import { Button }                                            import { Button }
  from 'foo-lib';      →      from 'foo-lib/lib/button';  →   from 'foo-lib/es/button';

import { Config }                                            import { Config }
  from 'foo-lib/lib/config';                                from 'foo-lib/es/config';
                                                             (Program.exit)
```

## 设计原则

- **纯函数 & 确定性** —— 插件不触碰文件系统。输出不依赖 `cwd` 或 `node_modules` 布局，构建在不同环境下可复现。
- **作用域感知** —— 正确处理 `@scope/name/lib/...`（在匹配 `include` / `exclude` 时捕获完整的带作用域包名）。
- **零运行时开销** —— 所有重写在编译期完成；产物中只包含 `/es` 路径。
- **快速失败** —— 如果被重写的包没有 `/es` 目录，构建时在模块解析阶段立即报错，而非静默产出损坏的产物。

## 实战示例

### 默认：重写任意包

默认行为重写任意 `/lib` 路径，零配置——当所有上游依赖都提供 `/es` 目录时最为理想：

```js
['./internals/babel-plugin-import-lib-to-es'];
```

### Monorepo 自定义作用域

如果你的 monorepo 发布在自定义作用域下，且只希望重写这些包：

```js
['./internals/babel-plugin-import-lib-to-es', { include: [/^@my-scope\//] }];
```

### 与 `babel-plugin-import` 协同

将 `babel-plugin-import` 注册在本插件**之前**，使其生成的 `/lib` 路径在同一 pass 中被重写：

```js
plugins: [
  ['import', { libraryName: 'foo-lib', style: false }],
  ['./internals/babel-plugin-import-lib-to-es'],
];
```

## 常见问题

<details>
<summary><strong>是否应该为 CJS（CommonJS）构建启用本插件？</strong></summary>

不应该。CJS 构建必须保留 `/lib` 路径不变。仅为 ESM 构建环境注册本插件。

</details>

<details>
<summary><strong>如果被重写的包没有 <code>/es</code> 目录会怎样？</strong></summary>

构建时模块解析阶段会立即报错，例如 `Cannot find module 'lodash/es/merge'`。将该包加入 `exclude`：

```js
{
  exclude: ['lodash'];
}
```

</details>

<details>
<summary><strong>插件顺序重要吗？</strong></summary>

重要。如果使用了 `babel-plugin-import`，应注册在本插件**之前**。`babel-plugin-import` 在 `Program.exit` 生成 `/lib` 路径；本插件同样在 `Program.exit` 执行但位于访问器队列的更后位置，因此能拾取到生成的路径。

</details>

<details>
<summary><strong>会重写 <code>require()</code> 和动态 <code>import()</code> 吗？</strong></summary>

会。裸 `require('foo-lib/lib/button')` 和动态 `import('foo-lib/lib/button')` 都会被重写。成员调用（如 `foo.require(...)`）不会被处理。

</details>

<details>
<summary><strong>会处理 <code>./lib/utils</code> 这样的相对路径吗？</strong></summary>

不会。仅重写紧跟在包名后的 `/lib` 段。相对路径和包根导入（`import 'foo-lib'`）均不处理。

</details>

## 测试

```bash
npx jest internals/babel-plugin-import-lib-to-es
```

测试覆盖：基本重写、作用域包、`export from`、`export *`、裸 `require()`、动态 `import()`、`exclude`/`include` 选项，以及与 `babel-plugin-import` 在同一 pass 中的协同。
