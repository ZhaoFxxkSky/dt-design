# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.1.3

`2026-07-16`

### ⭐️ Breaking Changes

- Table
  - 🔥 全新企业级表格组件，1:1 对齐 antd v5 Table 能力。
  - 新增表头拖拽列宽、可编辑校验单元格、批量编辑、行列拖拽、虚拟滚动等能力。
  - 新增 `resetColumnWidths` API 用于重置列宽。
  - 可编辑校验改为异步：`Reference.validate()` / `validateAll` 返回 `Promise<EditableValidateResult>`（原为同步），且校验错误以 rowKey 而非行索引为键。
- Splitter
  - 对齐 antd 上游实现，支持 `destroyOnHidden`、自定义折叠图标、`horizontal` / `vertical` 方向别名等。[#6](https://github.com/ZhaoFxxkSky/dt-design/pull/6)
- 依赖
  - peerDependencies 收窄为 `antd >=4.24.0 <5.0.0`（仅支持 Ant Design v4；代码实际依赖 4.24 引入的 `Dropdown menu`、`Modal/Popover open`、`globalConfig` 等 API）。

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
  - 修复可编辑与排序/筛选/分页/树形组合下编辑写入错误行、校验错误挂错行：全链路改用 rowKey 定位（无 key 或 key 重复时降级为索引）。
  - 修复 `ref.scrollTo` 因展开首次渲染快照导致数据变更后定位错误，改为惰性间接调用。
  - 修复开启 resizable 后未设 width 的列塌陷为 0~1px：无宽列按 minWidth 参与剩余空间弹性分配，且拖拽冻结拒绝 0/NaN。
  - 修复全局 resizable 时 selection/expand 列被注入拖拽手柄、无 key 列共用 `''` 键互相覆盖：无 key 且无 dataIndex 的列不再可拖拽、不进宽度追踪。
  - 修复受控 `pagination.current` 被忽略，对齐 antd 受控语义；受控模式下校验失败自动跳页改经 `onChange` 发起。
  - 修复列级 `editable: false` 无法覆盖表格级 `editable`。
  - 修复 BatchEditModal 打开期间父组件重渲染清空已配规则，现仅在 open 由 false→true 时初始化。
  - 修复 `validateAll` 竞态：异步校验期间的用户编辑不再被校验完成时的全量快照覆盖（序号机制函数式合并）。
  - 修复 `validateAll` 返回值与内部 `errors` state 不一致：setErrors 与返回值共用同一份合并结果。
  - 修复 resizable 测量行（measure row）内的拖拽手柄可被键盘聚焦并暴露给辅助技术，现设置 `tabIndex={-1}` 与 `aria-hidden`。
- Splitter
  - 修复 `ptg` 未完全覆盖的问题。
  - 补充 Splitter 缺失的 `memo` 依赖。
  - 修复键盘调整大小产出 NaN 尺寸：键盘路径补全 start→update→end 生命周期。
  - 修复键盘操作后全屏透明 mask 残留阻塞整页交互的问题。
  - 修复键盘调整大小后 `onResizeEnd` 回调拿到调整前旧尺寸：结束回调现接收本次 update 后的新尺寸。
  - 补充 `useResizable` 缺失的 `isRTL` 依赖。
- Button
  - 修复 `type="secondary" / "tertiary"` 自定义样式不生效（less 选择器与运行时类名对齐为 `dt-btn-*`）。
  - 改为 `forwardRef` 真实转发 ref（原先类型声明支持 ref 但运行时拿不到）。
- Collapsible
  - 修复运行时类前缀（`splitter`）与样式定义（`collapsible`）不匹配导致过渡样式不生效。
- FormList
  - 修复必填列星号因类名不匹配永不渲染。
- OverflowList
  - 修复 `componentUpdate` 拼写错误（应为 `componentDidUpdate`）导致 items 变化后不重新测量。
  - 修复每次渲染生成全新 key 导致子项全量重挂载，改为稳定 key（原始类型 item 回退索引 key）。
  - 修复 scroll 模式下 items 变更后卡在测量态。
- BlockHeader
  - 修复折叠图标样式和提示框类名问题。
- Build
  - 修复 `fatherrc` 中 esm 与 cjs 配置缺失 `input` 属性的问题。
  - 移除 `package.json` 中的 `type: module`、`exports` 等现代 ESM 字段，对齐 antd v4/v5 打包风格。
  - 全局替换 `antd/es/` → `antd/lib/`、`rc-util/es/` → `rc-util/lib/`，修复 CJS 运行时路径错误。
  - `lodash-es` 替换为 `lodash`，提升 CJS 互操作性。
  - 移除 `resize-observer` 中的 `findDOMNode`，改用直接 ref 适配 React 18。
  - 补全 `components/index.ts` 缺失的 `Summary`、`BatchEditModal`、`EditableConfig` 导出。
  - Table 中动态 `require` 改为静态 `import`。
  - demos 相对路径导入统一为 `@dtjoy/dt-design`。
  - 修复 UMD 样式丢失：`sideEffects` 补充 `components/**/style/*`，dist CSS 现包含全部组件（此前仅剩 splitter）。
  - UMD 移除 `clsx`、`rc-util`、`rc-resize-observer`、`rc-tree`、`rc-virtual-list` externals（官方无 UMD 构建，CDN 场景无法加载），改为打包进 dist；保留 `react`、`react-dom`、`antd`、`@ant-design/icons`。
  - 修复 UMD 在 Node/SSR 下 `self is not defined`（globalObject）。
  - 移除 less 主题中 `~antd` 的 webpack 私有写法，兼容 Vite 与新版 less-loader。
  - 删除 `engines.node>=22.13`（低版本 Node 消费者安装失败，yarn 1 尤为严重）。
  - 删除 pnpm 不生效的 `resolutions` 与未使用的 `rc-motion` devDependency。
  - `createContextSelector` 对 `unstable_batchedUpdates` 增加缺失降级，兼容 React 19 生产构建（该导出已在 19 生产包中移除）。
  - 新增 `browserslist`（`not op_mini all`），消除 eslint compat 对 Promise 的误报。
  - stylelint 90 条存量错误清零；eslint 错误清零。
  - README 补充样式/打包工具配置与 UMD 使用说明。
- CI
  - 升级 Node.js 版本至 22.13.x 以兼容 pnpm 10.6.4。
  - 升级已弃用的 Actions 并修复 pnpm 版本不匹配问题。
  - CI Node 矩阵升级至 22/24，移除不兼容 pnpm 11 的 Node 18。

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
