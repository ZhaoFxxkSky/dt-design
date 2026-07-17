# Contributing to @dtjoy/dt-design

感谢你对 `@dtjoy/dt-design` 的关注！在提交 PR 之前，请先阅读本指南。

## 开发环境

- Node.js >= 22
- pnpm >= 11

```bash
# 安装依赖
pnpm install

# 启动本地文档站点
pnpm dev

# 运行 lint
pnpm lint

# 运行测试
pnpm test

# 构建产物
pnpm build
pnpm build:dts
```

## 分支规范

- `main`：主分支，稳定版本
- `feat/<feature-name>`：新功能
- `fix/<bug-description>`：Bug 修复
- `docs/<description>`：文档更新
- `release/<version>`：发布分支

## Commit 规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)，提交信息格式如下：

```
<type>(<scope>): <subject>
```

常用 type：

- `feat`：新功能
- `fix`：修复 bug
- `docs`：文档
- `style`：代码格式（不影响功能）
- `refactor`：重构
- `perf`：性能优化
- `test`：测试
- `chore`：构建/工具链/依赖
- `ci`：CI 配置

示例：

```
feat(table): add resizable columns
fix(button): correct loading state transition
docs(readme): update install instructions
```

## PR 流程

1. 从 `main` 切出功能分支。
2. 提交 commit，确保通过 `pnpm lint` 和 `pnpm test`。
3. 推送分支并创建 PR，填写 PR 模板，特别是 **Changelog 区块**。
4. 等待 CI 通过和代码审查。
5. 合并后，维护者会通过 `standard-version` 发布新版本。

## 发布流程

维护者执行：

```bash
# 自动生成版本、CHANGELOG、tag 并推送
pnpm release

# 或指定版本类型
pnpm release -- --release-as minor
```

推送 tag 后会自动触发 GitHub Actions 发布到 npm 并创建 GitHub Release。

## 注意事项

- 新增组件需提供 demo 和基础文档。
- 修改组件行为时，请同步更新对应测试。
- `CHANGELOG.md` 采用手动维护方式，发布版本时将未发布区域更新为正式版本号和日期。

## 行为准则

请保持友善、尊重和专业。任何形式的骚扰、歧视或攻击性语言都是不可接受的。
