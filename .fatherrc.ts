import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { input: 'components', output: 'es', ignores: ['**/demos/**'], transformer: 'babel' },
  cjs: { input: 'components', output: 'lib', ignores: ['**/demos/**'], transformer: 'babel' },
  umd: {
    entry: 'components/index.ts',
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
      clsx: {
        commonjs: 'clsx',
        commonjs2: 'clsx',
        amd: 'clsx',
        root: 'clsx',
      },
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: 'lodash',
      },
      'rc-util': {
        commonjs: 'rc-util',
        commonjs2: 'rc-util',
        amd: 'rc-util',
        root: 'rc-util',
      },
    },
    chainWebpack(memo) {
      // lodash may require Node.js 'util' module,
      // fallback to false to avoid runtime error in browser UMD.
      memo.resolve.fallback.set('util', false);
      return memo;
    },
  },
});
