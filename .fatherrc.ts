import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'components',
    output: 'es',
    ignores: ['**/demos/**'],
    extraBabelPlugins: [
      ['import', { libraryName: 'antd', style: false }],
      require.resolve('@dtjoy/babel-plugin-import-lib-to-es'),
    ],
  },
  cjs: {
    input: 'components',
    output: 'lib',
    ignores: ['**/demos/**'],
    targets: { chrome: 85 },
    extraBabelPlugins: [['import', { libraryName: 'antd', style: false }]],
  },
  umd: {
    entry: 'internals/umd/entry.js',
    output: {
      path: 'dist',
      filename: 'dt-design.min.js',
    },
    name: 'DtDesign',
    chainWebpack(memo) {
      // Fix SSR: `self` is not defined in Node.js
      memo.output.set(
        'globalObject',
        "typeof self !== 'undefined' ? self : this",
      );
      // Prevent lodash from requiring Node.js `util` module
      memo.resolve.fallback.set('util', false);
      return memo;
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
      antd: {
        commonjs: 'antd',
        commonjs2: 'antd',
        amd: 'antd',
        root: 'antd',
      },
      '@ant-design/icons': {
        commonjs: '@ant-design/icons',
        commonjs2: '@ant-design/icons',
        amd: '@ant-design/icons',
        root: 'icons',
      },
    },
  },
});
