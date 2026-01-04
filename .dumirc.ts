import { defineConfig } from 'dumi';
import pkg from './package.json';
import path from 'path';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'dt-design',
    footer: `dt-design ${pkg.version} · Made by xiyan`,
  },

  routePrefetch: {},
  manifest: {},

  conventionRoutes: {
    // to avoid generate routes for .dumi/pages/index/components/xx
    exclude: [/index\/components\//],
  },
  base: '/dt-design/',
  publicPath: '/dt-design/',
  exportStatic: {},
  resolve: {
    atomDirs: [{ type: 'component', dir: 'components' }],
    codeBlockMode: 'passive',
  },
  alias: {
    '@dtjoy/dt-design/lib': path.join(__dirname, 'components'),
    '@dtjoy/dt-design/es': path.join(__dirname, 'components'),
    '@dtjoy/dt-design/locale': path.join(__dirname, 'components/locale'),
    '@dtjoy/dt-design': path.join(__dirname, 'components'),
    '@ant-design/icons$': '@ant-design/icons/lib',
  },
  metas: [
    { name: 'theme-color', content: '#1677ff' },
    { name: 'build-time', content: Date.now().toString() },
    // https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
    { name: 'build-hash', content: process.env.GITHUB_SHA ?? 'unknown' },
  ],
  // TODO 先关闭，后面再看
  ssr: false,
  logo: '/dt-design/logo.png',
  favicons: ['/dt-design/logo.png'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        style: true,
      },
    ],
  ],
  clickToComponent: {},
  lessLoader: {
    modifyVars: {},
    globalVars: {},
  },
});
