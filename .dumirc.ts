import { defineConfig } from 'dumi';
import pkg from './package.json';

export default defineConfig({
    outputPath: 'docs-dist',
    themeConfig: {
        name: 'dt-design',
        footer: `dt-design ${pkg.version} · Made by xiyan`,
    },
    base: '/dt-design/',
    publicPath: '/dt-design/',
    exportStatic: {},
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
        modifyVars: {
            'primary-color': '#3B7BFD',
            'text-color': '#333333',
            'label-color': '#666666',

            'border-color-base': '#DCDCDC',

            'item-hover-bg': 'fade(#3B7BFD, 10%)',
            'item-active-bg': 'fade(#3B7BFD, 20%)',

            'disabled-bg': '#F3F3F3',
            'disabled-color': '#CCCCCC',

            'primary-color-disabled': '#F9F9F9',

            'table-title-fill-bg': '#F3F3F3',
        },
        globalVars: {
            hack: `true; @import '${require.resolve('./src/styles/entry.less')}';`,
        },
    },
});
