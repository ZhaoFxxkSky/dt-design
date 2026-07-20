import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'components',
    output: 'es',
    ignores: ['**/demos/**'],
    extraBabelPlugins: [['import', { libraryName: 'antd', style: false }]],
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
    chainWebpack(memo) {
      // lodash may require Node.js 'util' module,
      // fallback to false to avoid runtime error in browser UMD.
      memo.resolve.fallback.set('util', false);
      // Universal global object, so requiring the UMD bundle
      // in Node/SSR does not throw `self is not defined`.
      memo.output.set('globalObject', "typeof self !== 'undefined' ? self : this");
      return memo;
    },
  },
});
