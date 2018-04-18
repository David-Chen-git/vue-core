const path = require('path')
const HTMLPLUGIN = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.jsx$/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(gif|jpg|jpeg|svg|png)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name]-build.[ext]'
                }
            }]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPLUGIN()
    ]
}

if (isDev) {
    config.devtool = '#cheap-module-eval-source-map';
    config.module.rules.push({
        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                }
            },
            'stylus-loader'
        ]
    });
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        open: true,
        hot: true
    };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
} else {
    config.module.rules.push({
        test: /\.styl/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                'stylus-loader'
            ]
        })
    });
    //单独输出样式文件
    config.plugins.push(
        //单独输出样式文件
        new ExtractPlugin('styles.[contentHash:8].css'),
        //单独webpack配置文件
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        //单独webpack代码
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
        //压缩js文件 es6标准
        new UglifyJSPlugin(),
    );
    //输出主js文件
    config.output.filename = '[name].[chunkhash:8].js';
    //单独打包类库文件
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    };
}

module.exports = config;