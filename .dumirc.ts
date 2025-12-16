import { defineConfig } from 'dumi';
import pkg from './package.json';
import path from 'path';

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
        modifyVars: {},
        globalVars: {},
    },
});
