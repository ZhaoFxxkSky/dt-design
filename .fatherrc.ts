import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { input: 'components', output: 'es', ignores: ['**/demos/**'], transformer: 'babel' },
  // Pin ie11 targets so lib is downleveled the same as es
  // (father's cjs default keeps `?.` / `??`).
  cjs: {
    input: 'components',
    output: 'lib',
    ignores: ['**/demos/**'],
    transformer: 'babel',
    targets: { ie: 11 },
  },
  umd: {
    entry: 'components/index.ts',
    output: {
      path: 'dist',
      filename: 'dt-design.min.js',
    },
    name: 'DtDesign',
    // Only deps with official UMD builds are externalized;
    // clsx / rc-util / rc-resize-observer / rc-tree / rc-virtual-list
    // ship no UMD, so they are bundled into dist instead.
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
