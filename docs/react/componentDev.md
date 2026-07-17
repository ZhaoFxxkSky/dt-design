---
title: 组件开发
group: 研发
---

## 组件开发

### 几点规范

- 命名规范：组件的名称应该使用大驼峰命名法，且尽量使用有意义的名字，并且应该与文件名相同。
- 文件组织规范：组件应该被放置在 `components` 目录中，每个组件应该有自己的文件夹，并使用 `index.tsx` 文件作为入口。
- 类型规范：所有的变量和函数都应该有明确的类型声明，特别是对于需要传递给子组件的 props 和组件状态 state 的类型。
- 测试规范：编写测试代码是开发组件的必要步骤。使用 Jest 和 @testing-library/react 进行组件测试，确保组件的质量和可靠性。
- CSS 命名规范：在采用 BEM 规范的基础上，使用 dt-design 标识性前缀 `dt-`。
- 组件化开发思维：React 的核心概念就是组件化开发思想，因此在开发过程中要遵循这个原则。将代码拆分成小的可重用组件，并尽可能减少代码的重复性。
- 文档规范：遵循简洁、易用的原则，开发对应的文档示例，确保每个示例不会耦合太多的 API。

### 目录结构

```
dt-design/
├── .dumirc.ts          # dumi 配置文件
├── .fatherrc.ts        # father 打包配置
├── biome.json          # Biome 格式化配置
├── eslint.config.mjs   # ESLint 配置
├── CHANGELOG.md
├── jest.config.js      # Jest 测试配置
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json       # TypeScript 配置
├── tsconfig.build.json # 构建用 TypeScript 配置
├── tests/              # Jest 辅助文件
│   ├── fileTransformer.js
│   ├── setupTests.js
│   └── styleMock.js
├── components/         # 组件源码
│   ├── index.ts        # 组件主入口
│   ├── _util/          # 公共工具方法
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── index.ts
│   │   ├── is.ts
│   │   └── ...
│   └── [component]/    # 单个组件目录
│       ├── index.tsx   # 组件源码
│       ├── index.md    # 组件文档
│       ├── demos/      # 示例
│       ├── style/      # 样式
│       └── __tests__/  # 单元测试
└── docs/               # 文档目录
    └── react/
```

### 开发流程

在 clone 了 dt-design 的代码并执行 `pnpm install` 安装完依赖后，常用命令如下：

- `pnpm dev` 使用 dumi 启动开发模式
- `pnpm build` 使用 father 打包组件库
- `pnpm build:dts` 生成类型声明文件
- `pnpm docs:build` 使用 dumi 构建文档网站
- `pnpm lint` 检查代码风格
- `pnpm test` 运行单元测试
- `pnpm deploy` 构建文档并部署到 GitHub Pages

### 组件可用性、稳定性测试

在发布之前，进行以下测试确保组件质量：

- `pnpm test` 运行全量单元测试
- `pnpm lint` 确保代码风格一致
- `pnpm build && pnpm build:dts` 确保构建产物正确

### 发布流程

发布通过 Git tag 触发 GitHub Actions 自动完成：

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md`
3. 提交并创建 tag：`git tag v<x.x.x>`
4. 推送 tag：`git push origin v<x.x.x>`
5. GitHub Actions 自动构建并发布到 npm，同时创建 GitHub Release
