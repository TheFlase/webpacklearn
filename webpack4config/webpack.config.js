var htmlWebpackPlugin = require('html-webpack-plugin');
// var htmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');



module.exports = {
    /**入口**/
    entry: {
        main: './src/script/main.js',
        a: './src/script/a.js',
        b: './src/script/b.js',
        c: './src/script/c.js'
    },

    /**出口**/
    output: {
        path: __dirname + '/dist',
        // filename: 'js/[name]-[hash].js'
        filename: 'js/[name].js',
        publicPath:'https://test.com'
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "index.html",
            // filename: "index-[hash].html",
            filename: "a.html",
            inject: false,
            title: 'this is a\'s html!',
            date: new Date(),
            minify: {
                removeComments:true,
                collapseWhitespace:true
            },
            // chunks:['a','main'],
            excludeChunks: ['b','c'],
        }),
        new htmlWebpackPlugin({
            template: "index.html",
            // filename: "index-[hash].html",
            filename: "b.html",
            inject: false,
            title: 'this is b\'s html!',
            date: new Date(),
            minify: {
                removeComments:true,
                collapseWhitespace:true
            },
            excludeChunks: ['a','c']
        }),
        new htmlWebpackPlugin({
            template: "index.html",
            // filename: "index-[hash].html",
            filename: "c.html",
            inject: false,
            title: 'this is c\'s html!',
            date: new Date(),
            minify: {
                removeComments:true,
                collapseWhitespace:true
            },
            excludeChunks:['a','b']
        }),
    ]

}