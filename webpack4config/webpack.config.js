var htmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {
    /**入口**/
    entry: {
        main: './src/script/main.js',
        a: './src/script/a.js'
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
            filename: "index.html",
            inject: false,
            title: 'webpack is awesome!',
            date: new Date(),
            minify: {
                removeComments:true,
                collapseWhitespace:true
            }
})
    ]

}