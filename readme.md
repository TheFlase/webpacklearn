【学习笔记】
备注：不同版本的webpack使用可能会差别，具体用法请参考官方文档（https://webpack.js.org/）

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


3.webpack4resource 源码编写记录
（1）使用babel-loader转换ES6
安装
npm install --save-dev babel-loader babel-core
npm install --save-dev babel-preset-latest

然后在webpack.config.js中定义
module:{
    loaders:[
        {
            test:/.\js$/,
            loader:'babel',
            query:{
                 presets:['latest']
             }
        }
    ]
}
其中的query节点可以在package.json中定义。
  "babel":{
    "presets":["latest"]
  }

以上的写法是老版本webpack写法，新版本使用loader需要用rules标签。
module:{
    rules:[
        {
            test: /\.js$/,
            include: path.resolve(__dirname,'src'),
            exclude: path.resolve(__dirname,'node_modules'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['latest']
                }
            }
        }
    ]
},

其中的include和exclude是分别指定babel转换资源时包含和不包含的目录。根据babel官网，推荐使用最新的babel-preset-env。首先进行安装：
npm install babel-preset-env --save-dev
在项目的根目录新建一个.babelrc文件，里面内容设置为：
{
    "presets": [ "env" ]
}
这个是默认配置，默认配置的情况下，它跟 babel-preset-latest 是等同的，会加载从es2015开始的所有preset。

（2）处理项目中的CSS
首先安装样式loader
npm install style-loader css-loader --save-dev
像其他loader一样，有3中使用方式。基于模块引入、cli和配置文件引入。此处使用配置文件：
{
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader',
            options: {
            modules: true
            }
        }
    ]
}

另外，有时候我们可能统一对样式进行修改，例如加前缀之类，这个时候可以借助postcss-loader进行处理。首先进行安装：
npm install postcss-loader --save-dev
然后安装postcss的辅助插件：
npm install autoprefixer --save-dev

由于loader处理是由右到左，所以我们在配置的时候需要注意顺序。
{
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader',
            options: {
                modules: true
            }
        },
        {loader:'postcss-loader'}
    ]
}
在根目录创建postcss.config.js，加入
module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers:['last 5 versions']
        })
    ]
}
对最近5个版本的浏览器进行处理。在浏览器看到类似这样的前缀效果：
._2X960DBnSzcOoZ3k455WEi{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

对于是通过@import引入的样式，我们在css-loader添加importLoaders属性并且值设置为1即可。具体参考webpack.config.js.

（3）使用less和sass
使用less-loader的话，首先安装插件：
npm install less -save-dev
npm install less-loader --save-dev
npm install sass-loader --save-dev

配置如下：
{
    test: /\.less$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader',
            options: {
            importLoaders:1
            }
        },
        {loader:'postcss-loader'},
        {loader:'less-loader'}
    ]
}

需要注意的是,css-loader配置下modules设置为true,编码css时按照模块重写css名称以避免跨模块的冲突,会自动更改class的名称，会造成一种看上去“乱码”的名称。这样就会导致样式不起作用。（后面详细了解modules使用再回来补充说明）

同理，sass也跟上面一样。此处不再粘贴配置。

（4）处理模板文件
安装html-loader,命令如下：
npm install html-loader --save-dev

在webpack打包配置中添加loader配置，

{
    test: /\.html$/,
    use: {
        loader: 'html-loader'
    }
}

使用ejs演示,所以先安装ejs-loader
npm install ejs-loader --save-dev

import模板文件tpl的时候，返回的是一个函数。如果是引用Html,返回的是字符串。使用配置如下：
{
    test: /\.ejs$/,
    use: {
        loader: 'ejs-loader'
    }
},

（5）处理图片以及其他文件

1)要处理图片等资源，可以使用file-loader。首先安装
npm install file-loader --save-dev
然后在配置文件引入

{
    test: /\.(png|jpg|gif|svg)$/i,
    use: {
        loader: 'file-loader',
        options: {
            name:'assets/[name]-[hash:5]-[ext]'
        }
    }
}
其中匹配路径结尾的"i"代表忽略大小写的意思。

一共的情况分为以下几种：
情况1：在css文件中或者根目录的html引入图片=》
可以直接写相对路径

情况2：在模板中引用图片=》
不可以直接写相对路径，请使用reqire的方式。例如：
<img src="${require('../../assets/bg.png')}">

2)url-loader的使用
安装：npm install url-loader --save-dev
配置：
{
    test: /\.(png|jpg|gif|svg)$/i,
    use: {
        loader: 'url-loader',
        options: {
            limit: 8192,
            name:'assets/[name]-[hash:5]-[ext]'
        }
    }
}

url-loader和file-loader是什么关系呢？简答地说，url-loader封装了file-loader。url-loader不依赖于file-loader，即使用url-loader时，只需要安装url-loader即可，不需要安装file-loader，因为url-loader内置了file-loader。通过上面的介绍，我们可以看到，url-loader工作分两种情况：1.文件大小小于limit参数，url-loader将会把文件转为DataURL；2.文件大小大于limit，url-loader会调用file-loader进行处理，参数也会直接传给file-loader。因此我们只需要安装url-loader即可。

合理的权衡使用base64或者fileloader处理比较重要，因为base64省去了网络请求资源，而http请求的图片有可以让浏览器进行缓存起来，需要综合权衡考虑取舍。另外，对于图片压缩，还可以借助另外一个插件。安装和配置如下：
npm install image-webpack-loader --save-dev

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

当图片大于limit时就会用file-loader进行打包并且做压缩处理。





