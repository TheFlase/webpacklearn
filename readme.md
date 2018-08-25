【学习笔记】


1.webpackdemo源码编写记录

mkdir webpackdemo
cd webpackdemo
初始化一个package.json配置文件 npm init -y
npm install webpack --save-dev

编写hello.js
function hello(){
console.log("hello,webpack"):
}
打包：（如果是老版本，不用指定--output-filename）
webpack hello.js --output-filename hello.bundle.js

引入css文件,此时要先安装css loader和样式loader：
npm install css-loader style-loader --save-dev

通过控制台设置一些参数：
webpack hello.js --output-filename hello.bundle.js --display-moudule --display-reasons

注意：
1）在项目根目录创建webpack.config.js。其中需要注意的是，最新版本的webpack配置输出文件路径的时候需要写"__dirname"，
不能使用老方式的"./dist/js"之类的.
2）webpack的配置的默认名字是webpack-config.js，如果不是这个名字，在打包的时候需要指定，例如使用命令如下：
webpack --config webpack.config.js

2.webpack4config 源码编写记录
首先创建文件目录后,进入目录。

(1)常用打包用法
npm install webpack --save-dev
mkdir dist
mkdir src
然后在src创建script（所有类型的js）,style（所有类型的css）文件夹.
可以在package.json的sript节点添加webpack命令，首先安装webpack-cli或者webpack-command,然后通过npm执行webpack命令。
例如使用命令：
num run webpack

（2）entry入口配置
情况一：传入一个数组：entry: ['./src/script/main.js','./src/script/a.js']

情况二：多页面配置
entry: {
    main:'./src/script/main.js',
    a:'./src/script/a.js'
}
如果只有一个输出，老版本webpack会提示错误Conflict: Multiple chunks emit assets to the same filename
bundle.js (chunks 0 and 1)。输出需要配置为：
output: {
    filename: '[name].js',
    path: __dirname + '/dist'
}

（3）html插件
首先安装:npm install webpack-html-plugin --save-dev
然后在webpack打包文件中引入使用，利用html模板的功能.
plugins: [
    new htmlWebpackPlugin({
        template: "index.html",
        filename: "a.html",
        inject: false,
        title: 'this is a\'s html!',
        date: new Date(),
        minify: {
            removeComments:true,
            collapseWhitespace:true
        },
        chunks:['a','main'],
        excludeChunks: ['b','c']
    }),
]
在这个插件里面，可以将很多值传到html去。例如title,Date对象等等。
template：指定模板来源
filename：生成的页面的名字
inject：js的插入位置。枚举值例如：head,body，true和false等
title：页面title
date:时间对象

minify:优化配置。其中removeComments代表去掉模板注释,collapseWhitespace指去掉空格。具体使用可以参考其官方说明。（https://www.npmjs.com/package/html-webpack-plugin）

chunks:指定当前Html应该引入哪些js。注意：我在webpack4.17.1版本中，模板中不能有注释，否则会报错（ERROR in Template execution failed: TypeError: Cannot read property 'entry' of undefined
）

excludeChunks:排除指定的JS引入

另外，有些js可以直接在页面生成，不用通过引入的方式去加载（因为引入的方式会产生http请求，消耗一定资源）。在项目中的配置如下：
<script type="text/javascript">
    <%= compilation.assets[htmlWebpackPlugin.files.chunks.main.entry.substr(htmlWebpackPlugin.files.publicPath.length)].source()%>
</script>

如上，如果模板中引入了main.js,那么每个htmlWebpackPlugin中的chunks就需要包含main.js的输出,否则就会报错。
输出多个页面就配置多个html插件即可。





