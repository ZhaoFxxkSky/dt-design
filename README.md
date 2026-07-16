<div align="center">

# dt-design

English | [简体中文](./README-zh_CN.md)

An enterprise-class React component library built on [Ant Design](https://github.com/ant-design/ant-design), optimized for back-office business scenarios with high reusability and extensibility.

</div>

---

## 📖 Introduction

dt-design is a React component library internally developed by the **Digital Business Department**, extending Ant Design. It consolidates common business patterns into **out-of-the-box components**, boosting development velocity while reducing redundant code.

---

## 🎯 When to Use

- ✅ Ant Design's basic components are insufficient for complex business requirements
- ✅ Multiple projects share similar modules and need a unified implementation
- ✅ You want to extract general business logic to avoid duplicate development
- ✅ You need consistent UI specification and interaction behavior across products

---

## 📦 Installation

```bash
# npm
npm install @dtjoy/dt-design

# yarn
yarn add @dtjoy/dt-design

# pnpm
pnpm add @dtjoy/dt-design
```

---

## 🚀 Quick Start

```tsx
import React from 'react';
import { BlockHeader } from '@dtjoy/dt-design';

const App = () => <BlockHeader title="Category Title" background />;
```

---

## 📌 Tree-Shaking & On-Demand

ES modules are fully supported; import only what you need and the bundler will drop the rest automatically:

```ts
import { BlockHeader, Table } from '@dtjoy/dt-design';
```

---

## 🧩 TypeScript First

Written entirely in TypeScript with complete type definitions for better IntelliSense and compile-time safety.

---

## 🛠 Local Development

```bash
git clone https://github.com/ZhaoFxxkSky/dt-design
cd dt-design
pnpm install
pnpm dev
```

Then open [http://127.0.0.1:8000](http://127.0.0.1:8000).  
We use [dumi](https://d.umijs.org/) for docs & component management.

---

## 📦 Build & Release

### Build the library

```bash
pnpm build
pnpm build:dts
```

### Release

```bash
# Automatically bump version, update CHANGELOG, create tag and push
pnpm release

# Or specify release type
pnpm release -- --release-as minor
```

Pushing a `v*` tag will trigger the GitHub Actions release workflow to publish to npm and create a GitHub Release.

### Deploy documentation site

Documentation is automatically deployed to GitHub Pages when pushing to `main`. You can also trigger it manually from the Actions tab.

---

## 🤝 Contributing

We welcome Issues and Pull Requests. Workflow:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/xxx`)
3. Commit your changes (`git commit -m 'feat: add xxx'`)
4. Push to the branch (`git push origin feature/xxx`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards and CI rules.

---

## 👨‍💻 Core Team

Maintained by the **Digital Business Department**. Thanks to all contributors!

---

## 📄 License

Internal use only. Redistribution or publication without explicit permission is strictly prohibited.

---

Need help? Contact us at `wx-zhaog@dtjoy.com`
