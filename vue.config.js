const isProd = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const BASE_URL = !isProd ? '/' : './dist/';
const path = require('path');
const absolutePath = (...arg) => path.resolve(process.cwd(), ...arg);
const { VersionPlugin } = require('vue-cli-version-static-plugin');
module.exports = {
    // transpileDependencies: ['vue-echarts', 'echarts', 'vue-amap', 'vue-pdf', 'vue-baidu-map', 'crypto-js'],
    transpileDependencies: ['echarts', 'vue-amap', 'vue-pdf', 'vue-baidu-map', 'crypto-js'],
    publicPath: BASE_URL,
    lintOnSave: false, // eslint 是否在保存时检查
    assetsDir: 'static',
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', absolutePath('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', absolutePath('src/components'))
            .set('vue$', 'vue/dist/vue.esm.js');

        config.plugin('MonacoWebpackPlugin').use(MonacoWebpackPlugin);
        config.plugin('VersionPlugin').use(VersionPlugin, [
            {
                versionControl: false,
                terserOptions: {
                    compress: {
                        drop_console: false, //console
                        drop_debugger: false,
                        pure_funcs: []
                    }
                }
            }
        ]);
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config['performance'] = {
                //打包文件大小配置
                maxEntrypointSize: 10000000,
                maxAssetSize: 30000000
            };
        }
        config.module.rules.push({
            test: /\.md$/,
            use: [
                {
                    loader: require.resolve('./src/plugins/markdownLoader')
                }
            ]
        });
    },
    productionSourceMap: !isProd,
    css: {
        extract: isProd ? { ignoreOrder: true } : false,
        sourceMap: false
    },
    devServer: {
        host: '127.0.0.1',
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: {
            colors: true
        },
        port: 8090
    }
};
