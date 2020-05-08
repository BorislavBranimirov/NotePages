const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MomentLocalesPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.s?css$/,
                exclude: /\.module\.s?css/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.module\.s?css/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]_[local]_[hash:base64]'
                            },
                            sourceMap: true
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        proxy: {
            '/api': 'http://localhost:8000'
        },
        historyApiFallback: true // to be able to refresh page on different routes without 404 error
    }
};