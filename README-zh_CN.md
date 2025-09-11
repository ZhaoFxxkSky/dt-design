
<div align="center">

# `dt-design`

简体中文 | [English](./README.md)

基于 [Ant Design](https://github.com/ant-design/ant-design) 的企业级 React 组件库，面向中后台业务场景，提供高复用、易扩展的业务组件支持。

</div>

---

## 📖 简介

`dt-design` 是基于 [Ant Design](https://github.com/ant-design/ant-design) 封装的 React 组件库，专为公司内部中后台系统打造。我们聚焦于**具体业务场景的抽象与沉淀**，提供一系列开箱即用、可扩展的业务组件，提升开发效率，降低重复开发成本。

此外，我们也提供部分基于原生 JavaScript 实现的通用能力组件，如：

-   `ContextMenu`（右键菜单）
-   `KeyEventListener`（键盘事件监听）

---

## 🎯 使用场景

-   ✅ 当 Ant Design 基础组件无法满足复杂业务需求时
-   ✅ 当多个项目存在相似业务模块，需统一组件实现时
-   ✅ 当希望沉淀通用业务逻辑，减少重复开发时
-   ✅ 当需要统一 UI 规范与交互行为，提升产品一致性时

---

## 📦 安装

```bash
# 使用 npm
npm install dt-design

# 使用 yarn
yarn add dt-design

# 使用 pnpm
pnpm add dt-design
```

---

## 🚀 快速开始

```tsx
import React from 'react';
import { BlockHeader } from 'dt-design';

const App = () => <BlockHeader title="分类标题" background />;
```

---

## 📌 按需加载

本库默认支持基于 ES modules 的 tree shaking，按需引入即可自动优化打包体积：

```ts
import { BlockHeader, CustomTable } from 'dt-design';
```

---

## 🧩 TypeScript 支持

全库使用 TypeScript 编写，提供完整的类型定义，支持类型提示与校验，开发体验更佳。

---

## 🛠 本地开发

```bash
git clone https://github.com/ZhaoFxxkSky/dt-design
cd dt-design
pnpm install
pnpm run dev
```

启动后访问 [http://127.0.0.1:8000](http://127.0.0.1:8000)  
我们使用 [dumi](https://d.umijs.org/) 作为文档与组件管理工具。

---

## 📦 构建与发布

### 构建组件库

```bash
pnpm build
```

### 发布版本（内部 npm 仓库）

```bash
pnpm release -- -r x.x.x
npm publish --registry <公司内部npm仓库地址>
```

### 发布文档站点（如适用）

```bash
pnpm deploy
```

---

## 🤝 如何贡献

欢迎提交 Issue 或 Pull Request！请遵循以下流程：

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/xxx`)
3. 提交你的修改 (`git commit -m 'feat: add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建一个 Pull Request

📘 详细规范请参考：[贡献指南](./CONTRIBUTING.md)

---

## 👨‍💻 维护团队

本组件库由 `数字业务部` 维护与开发，感谢每一位参与建设的同事。

---

## 📄 许可证

本组件库仅授权公司内部使用，未经许可不得对外发布或传播。

---

如需技术支持或组件需求，请联系：`wx-zhaog@dtjoy.com`
