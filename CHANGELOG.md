# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.1.5

`2026-07-17`

> **注**：`1.1.3` 与 `1.1.4` 版本在 npm 发布后因打包问题已撤回，`1.1.5` 为正式替代版本，内容等同于原计划发布的 `1.1.3`。

### ⭐️ Breaking Changes

- Table
  - 全新企业级表格组件，1:1 对齐 antd v5 Table 能力。
  - 新增表头拖拽列宽、可编辑校验单元格、批量编辑、行列拖拽、虚拟滚动等能力。
  - 新增 `resetColumnWidths` API 用于重置列宽。
  - 可编辑校验改为异步：`Reference.validate()` / `validateAll` 返回 `Promise<EditableValidateResult>`，且校验错误以 rowKey 为键。
- Splitter
  - 对齐 antd 上游实现，支持 `destroyOnHidden`、自定义折叠图标、`horizontal` / `vertical` 方向别名等。[#6](https://github.com/ZhaoFxxkSky/dt-design/pull/6)
- 依赖
  - peerDependencies 收窄为 `antd >=4.24.0 <5.0.0`（仅支持 Ant Design v4）。

### 🆕 Feature

- Table: 企业级表格、列宽拖拽、可编辑校验、批量编辑、虚拟滚动、resize 示例与测试。
- FormList: 新增数组表单项及 `wrapperCol` 支持。
- Splitter: 支持 `onCollapse`、`destroyOnHidden`、自定义折叠图标、方向别名等。
- OverflowList: 新增折叠列表组件。

### 🐞 Bug Fixes

- Table
  - 修复可编辑与排序/筛选/分页/树形组合下编辑写入错误行、校验错误挂错行。
  - 修复 `validateAll` 竞态与返回值不一致。
  - 修复受控 `pagination.current` 被忽略。
  - 修复列级 `editable: false` 无法覆盖表格级 `editable`。
  - 修复 BatchEditModal 打开期间重渲染清空规则。
  - 修复 resizable 无宽列塌陷、无 key 列被注入拖拽手柄、测量行手柄可被聚焦等问题。
  - 修复 `ref.scrollTo` 首次渲染快照导致定位错误。
- Splitter: 修复键盘调整大小产出 NaN、结束回调拿到旧尺寸、透明 mask 残留等问题。
- Button: 修复 `secondary`/`tertiary` 样式与 forwardRef。
- Collapsible: 修复运行时类前缀与过渡样式。
- BlockHeader: 修复折叠图标样式和提示框类名。
- OverflowList: 修复 `componentDidUpdate` 拼写、稳定 key、scroll 模式测量。
- FormList: 修复必填列星号因类名不匹配永不渲染。

### 🛠 Refactor

- Table: 打磨列宽拖拽与可编辑特性。
- BlockHeader: 增强 props 并优化展开逻辑。
- Button: 重构按钮组件样式和结构。

### 📖 Documentation

- 更新 README、CHANGELOG、CONTRIBUTING 与组件开发文档。

### 🚀 CI/CD

- 升级 GitHub Actions 与 Node 矩阵。
- 新增部署、发布、PR 检查工作流。

### 📦 Build

- 修复 UMD 样式丢失、SSR `self is not defined`、CJS 路径错误。
- 移除 biome.json、engines 限制、未生效 resolutions。
- 新增 tsconfig.build.json，清理旧配置文件。
- 补充 `rc-motion` devDependency。

### ⚠️ Deprecations

- FormList 组件已废弃，将在后续大版本中移除，请尽快迁移到替代方案。

## 1.1.2

`2026-06-22`

### 🛠 Refactor

- BlockHeader
  - 增强 props 并优化展开逻辑。
- Table
  - 移除旧 Table 组件及其样式、文档、demo，移除 `@rc-component/table` 与 `@rc-component/util` 依赖（全新 Table 于 1.1.3 引入）。

> 注：本段根据 2026-06-22 当日提交（bf1a81b、1bf99d5）回溯补充，该版本发布时未记录 changelog。

## 1.1.1

`2026-04-03`

> ⚠️ 该版本紧随 1.1.0 同日发布（相隔约 20 分钟），为 hotfix 性质，发布时未留存变更记录，本仓库 git 历史亦无法定位对应提交。内容待维护者确认补充。

## 1.1.0

`2026-04-03`

### ⭐️ Breaking Changes

- 修改依赖，并将图标库从 `@dtinsight/react-icons` 迁移到 `@ant-design/icons`。

### 🆕 Feature

- OverflowList
  - 新增折叠列表组件。

### 📖 Documentation

- 更新组件文档内容。

### 🛠 Refactor

- 修改依赖，并将图标库从 `@dtinsight/react-icons` 迁移到 `@ant-design/icons`。

## 1.0.3

`2025-12-17`

### 🐞 Bug Fixes

- BlockHeader
  - 修复折叠图标样式和提示框类名问题。

### 🔨 Chore

- 初始化项目。
