const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/assets/js/index.js',
        details: './src/assets/js/details.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'BooksInfo',
            template: path.resolve(__dirname, './src/index.html'),
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({  // Also generate a details.html
            title: 'BooksInfo',
            filename: 'details.html',
            template: path.resolve(__dirname, './src/details.html'),
            chunks: ['details']
          })
    ],
    devServer: {
        static: '/dist'
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
    
};


