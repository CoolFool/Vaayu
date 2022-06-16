const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
require("dotenv").config()

module.exports = {
    mode:  'production',
    entry: path.resolve(__dirname, './src/pages/index.js'),
    devtool: 'inline-source-map',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader')
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                ],
            }
        ],
    },
    // isDevelopment && new ReactRefreshWebpackPlugin(),
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Vaayu',
            template: path.resolve(__dirname, './src/assets/index.html'),
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
        new FaviconsWebpackPlugin('static/logo.png'),
        new CompressionPlugin()
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    }
};