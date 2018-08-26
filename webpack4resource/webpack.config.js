var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');


module.exports = {
    entry: {
        main: './src/app.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].bundle.js',
    },
    module:{
        rules:[
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.ejs$/,
                use: {
                    loader: 'ejs-loader'
                }
            },
            {
                test: /\.js$/,
                // exclude: /(node_modules|bower_components)/,
                include: path.resolve(__dirname,'src'),
                exclude: path.resolve(__dirname,'node_modules'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['latest']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader',
                        options: {
                            importLoaders:1
                        }
                    },
                    {loader:'postcss-loader'}
                ]
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader'},
                    {loader:'postcss-loader'},
                    {loader:'less-loader'}
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders:1
                        }
                    },
                    {loader:'postcss-loader'},
                    {loader:'sass-loader'}
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [
                    {
                        loader:'url-loader',
                        options:{
                            limit: 500,
                            name:'assets/[name]-[hash:5]-[ext]'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true // webpack@2.x and newer
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "index.html",
            filename: "index.html",
            inject: 'body',
            minify: {
                removeComments:true,
                collapseWhitespace:true
            }
        }),
    ]

}