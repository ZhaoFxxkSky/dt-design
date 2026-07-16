# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## Unreleased

### ⭐️ Breaking Changes

- Table
  - 🔥 全新企业级表格组件，1:1 对齐 antd v5 Table 能力。
  - 新增表头拖拽列宽、可编辑校验单元格、批量编辑、行列拖拽、虚拟滚动等能力。
  - 新增 `resetColumnWidths` API 用于重置列宽。
- Splitter
  - 对齐 antd 上游实现，支持 `destroyOnHidden`、自定义折叠图标、`horizontal` / `vertical` 方向别名等。[#6](https://github.com/ZhaoFxxkSky/dt-design/pull/6)

### 🆕 Feature

- Table
  - 企业级表格组件 - 1:1 对齐 antd v5 Table。
  - 表头拖拽列宽 + 可编辑校验单元格。
  - 新增 resize 场景示例与测试。
  - 批量编辑与可编辑单元格性能重构。
  - 优化列宽拖拽交互并新增 `resetColumnWidths` API。
- FormList
  - 新增数组表单项。
  - 新增 `wrapperCol` 属性支持。
- Splitter
  - 支持 `onCollapse` 事件。
  - 对齐上游实现，支持 `destroyOnHidden`、自定义折叠图标、方向别名等。[#6](https://github.com/ZhaoFxxkSky/dt-design/pull/6)
- OverflowList
  - 新增折叠列表组件。

### 🐞 Bug Fixes

- Table
  - 修复 `transformResizableColumns` 导出缺失的问题。
  - 恢复 `transformResizableColumns` 辅助函数以支持列宽拖拽。
  - 修正 `validateAll` 与 `renderEmpty` 在 `InternalTable` 中的调用。
  - 修复 `renderEmpty` 类型不匹配问题。
  - 恢复 `immutableHelper` 并通过上下文测试。
  - 修复 `immutableHelper` TypeScript 类型。
  - 移除 `index.md` 中对已删除临时 demo 的引用。
  - 修复 Gemini Code Assist review 指出的类型与逻辑问题。
  - 修复 TypeScript strict 模式错误及 Table 相关 lint 问题。
- Splitter
  - 修复 `ptg` 未完全覆盖的问题。
  - 补充 Splitter 缺失的 `memo` 依赖。
- BlockHeader
  - 修复折叠图标样式和提示框类名问题。
- Build
  - 修复 `fatherrc` 中 esm 与 cjs 配置缺失 `input` 属性的问题。
- CI
  - 升级 Node.js 版本至 22.13.x 以兼容 pnpm 10.6.4。
  - 升级已弃用的 Actions 并修复 pnpm 版本不匹配问题。

### 💄 Style

- Button
  - 重构按钮组件样式和结构。

### 🛠 Refactor

- Table
  - 打磨列宽拖拽与可编辑特性。
- BlockHeader
  - 增强 props 并优化展开逻辑。
- Button
  - 重构按钮组件样式和结构。
- Biome
  - 引入 Biome 工具链。[#3](https://github.com/ZhaoFxxkSky/dt-design/pull/3)

### 📖 Documentation

- 更新组件文档内容。

### 🧪 Tests

- Table
  - 新增 resize 场景示例与测试。

### ⚡️ Performance

- Table
  - 批量编辑与可编辑单元格性能重构。

### 🚀 CI/CD

- 新增 GitHub Pages 部署工作流。
- 升级 GitHub Actions 至最新版本。
- 移除工作流中的 pnpm 版本指定。
- 建立发布流水线与质量门禁。
- 移除导致 CI 中 pnpm install 失败的 `trustPolicy` 设置。

### 📦 Build

- 添加版本生成脚本和构建配置。

### 🔨 Chore

- 忽略并移除 `.kilo` 工具目录。
- 清理 AI 过程文件、IDE 配置及失效的迁移脚本。

## 1.1.0

`2025-12-17`

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
