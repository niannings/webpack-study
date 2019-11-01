[TOC]
# 安装
建议本地安装：

```shell
$ npm install -D webpack
```

## 新建项目

```shell
$ mkdir webpack-study && cd webpack-study
$ npm init -y
$ npm i webpack webpack-cli -D
$ touch index.html
$ mkdir src && touch src/index.js
$ tree -L 2 -I "node_modules" >README.md
```

当前目录结构：

```
.
├── README.md
├── index.html
├── package-lock.json
├── package.json
└── src
    └── index.js
```

**我们还需要调整 package.json 文件，以便确保我们安装包是私有的(private)，并且移除 main 入口。这可以防止意外发布你的代码。**

```
-"main": "index.js"
+"private": true
```

## 初次构建

```shell
$ npx webpack # 将会默认在 dist 目录下生产 main.js 文件
```

# 管理资源

除了js文件还有很多其他类型的文件资源，需要通过loader来加载。

## 常用的loader

### 加载 CSS (css-loader)

- 安装

```shell
$ npm install --save-dev style-loader css-loader
```

- 配置loader

```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
      // loader
      rules: [
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader'
              ]
          }
      ]
  }
};
```

### 加载图片 (file-loader)

- 安装

```shell
$ npm install --save-dev file-loader
```

- 配置

```js
module.exports = {
  // ...
  module: {
      // loader
      rules: [
          // ...
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
          }
      ]
  }
};
```

然后我们可以```import xw from './xw.jpg'```导入图片，构建时该图片会输出到 output 目录， ```xw``` 变量将包含该图像在处理后的最终 url。当使用 ```css-loader``` 时，如上所示，你的 CSS 中的 ```url('./xw.jpg')``` 会使用类似的过程去处理。loader 会识别这是一个本地文件，并将 './my-image.png' 路径，替换为输出目录中图像的最终路径。html-loader 以相同的方式处理 ```<img src="./my-image.png" />```。

### 压缩和优化你的图像 (image-webpack-loader和url-loader)

#### [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader)压缩图片

- 安装

```shell
$ npm install img-loader --save-dev
$ npm install --save-dev url-loader
$ npm install image-webpack-loader --save-dev
```

如果无法安装，可尝试```cnpm```

- 配置
    - mozjpeg — Compress JPEG images
    - optipng — Compress PNG images
    - pngquant — Compress PNG images
    - svgo — Compress SVG images
    - gifsicle — Compress GIF images

```js
rules: [{
  test: /\.(gif|png|jpe?g|svg)$/i,
  use: [
    {
        loader: 'url-loader',
        options: {
            limit: 10000 , /* 图片大小小于1000字节限制时会自动转成 base64 码引用*/
            name: '[path][name].[ext]?[hash:6]!./dir/file.png'
        },
    },
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        // optipng.enabled: false will disable optipng
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        // the webp option will enable WEBP
        webp: {
          quality: 75
        }
      }
    },
  ],
}]
```

### 加载字体或其他特殊资源

其实```url-loader 或者 file-loader```可以加载任意类型文件，比如```.md```等。

简单的配置一下：

```js
{
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ['url-loader']
}
```

通过配置好 ```loader``` 并将字体文件放在合适的地方，你可以通过一个 ```@font-face``` 声明引入。本地的 ```url(...)``` 指令会被 ```webpack``` 获取处理。

### 导入数据

除了json外还有csv、tsv、xml等格式的数据，可以通过相应的loader加载它们。

## 总结

这种配置方式会使你的代码更具备可移植性，因为现有的统一放置的方式会造成所有资源紧密耦合在一起。

## 如何实现一个**loader？**

<span style="color: green">已完成：</span>
[如何实现一个**loader？](http://note.youdao.com/noteshare?id=9768ca097140678ed8024057fe9fd741)

# 管理输出

到目前为止，我们在 index.html 文件中手动引入所有资源，然而随着应用程序增长，并且一旦开始对文件名使用哈希(hash)]并输出多个 bundle，手动地对 index.html 文件进行管理，一切就会变得困难起来。然而，可以通过一些插件，会使这个过程更容易操控。

## 预先准备

```shell
$ touch src/print.js
$ vim src/print.js
$ # 输入
export default function printMe() {
  console.log('I get called from print.js!');
}
```

- 配置

```js
entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
},
```

## 设定 HtmlWebpackPlugin

- 安装插件: [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin)

```shell
$ npm install --save-dev html-webpack-plugin
```

- 配置

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            title: '输出管理'
        })
    ],
    // ...
}
```

## 清理 /dist 文件夹

安装插件: [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)

```shell
npm install clean-webpack-plugin --save-dev
```

## Manifest

你可能会感兴趣，webpack及其插件似乎“知道”应该哪些文件生成。答案是，通过 manifest，webpack 能够对「你的模块映射到输出 bundle 的过程」保持追踪。如果你对通过其他方式来管理 webpack 的输出更感兴趣，那么首先了解 manifest 是个好的开始。

通过使用 [WebpackManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin)，可以直接将数据提取到一个 json 文件，以供使用。

参考：[Manifest](http://note.youdao.com/noteshare?id=53850f8525d119b907f4780920b2951a)


## 总结

已经了解如何向 HTML 动态添加 bundle。

## 如何实现一个*插件*?

<span style="color: red">待完成...</span>

# 开发

在我们继续之前，先来看看如何建立一个开发环境，使我们的开发变得更容易一些。

> 下面使用工具仅用于开发环境，请不要在生产环境中使用它们！

## 使用 source map

为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 b.js，source map 就会明确的告诉你。

```js
export default function printMe() {
    // 错误
    console1.log('I get called from print.js!');
}
```

当我们执行该函数会发现错误难以定位，因为代码被打包了（打包后的代码和你的源代码很不一样）

- 启用soure map：

```js
module.exports = {
  entry: {
      // ...
  },
  // 仅用于开发环境
  // 生产环境可用 source-map
  devtool: 'inline-source-map',
  plugins: [
      // ...
  ]
}
```

- 再次执行，发现错误清晰的被追踪定位了:
<pre style="padding:0 15px">
<code style="color: red">
Uncaught ReferenceError: console1 is not defined
    at HTMLButtonElement.e (print.js:2)
</code>
</pre>

## 选择一个开发工具

每次要编译代码时，手动运行 npm run build 就会变得很麻烦。

webpack 中有几个不同的选项，可以帮助你在代码发生变化后自动编译代码：

- webpack's Watch Mode
- webpack-dev-server
- webpack-dev-middleware

多数场景中，你可能需要使用 ```webpack-dev-server```

### 使用观察模式

如果其中一个文件被更新，代码将被重新编译，所以你不必手动运行整个构建。  
唯一的缺点是，为了看到修改后的实际效果，你需要刷新浏览器。

```json
{
    "scripts": {
        "watch": "webpack --watch",
    }
}
```

### 使用 webpack-dev-server

webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。
默认8080端口。

- 安装

```shell
$ npm install --save-dev webpack-dev-server
```

- 配置

```js
// webpack.config.js
{
    // ..
    entry: {
        // ..
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    // ..
}
```

- npm 脚本

```json
{
    "scripts": {
        "start": "webpack-dev-server --open",
    }
}
```

### 使用 webpack-dev-middleware

webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。

## 总结

已经学会了如何自动编译代码，并运行一个简单的开发服务器(development server)

# 模块热替换

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。

<span style="color: red">HMR 不适用于生产环境，这意味着它应当只在开发环境使用。</span>

## 启用 HMR

更新 webpack-dev-server 的配置，和使用 webpack 内置的 HMR 插件

```js
// webpack.config.js
const webpack = require('webpack');

{
    // ..
    entry: {
        app: './src/index.js',
        // print: './src/print.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        // ...
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
}
```

上面我们把入口起点```print: './src/print.js'```注掉了，因为它现在正被 index.js 模块使用。

修改```index.js```，以便当 print.js 内部发生变更时可以告诉 webpack 接受更新的模块。

```js
// ...
if (module.hot) {
    module.hot.accept('./print.js', function() {
        console.log('Accepting the update printMe module');
        printMe();
    });
}
```

启动 npm start，浏览器控制台输出：

```
[WDS] App updated. Recompiling...                
[WDS] App hot update...                         reloadApp.js:19 
[HMR] Checking for updates on the server...     log.js:24 
Accepting the update printMe module             index.js:22 
Updating print.js...hah                         print.js:2 
[HMR] Updated modules:                          log.js:24 
[HMR]  - ./src/print.js                         log.js:24 
[HMR] App is up to date.                        log.js:24
```

这个不是必须的

## 通过 Node.js API

当使用 webpack dev server 和 Node.js API 时，不要将 dev server 选项放在 webpack 配置对象(webpack config object)中。而是，在创建选项时，将其作为第二个参数传递。

详细[参考](https://www.webpackjs.com/guides/hot-module-replacement/#%E9%80%9A%E8%BF%87-node-js-api)

## 总结

学会了如何启用热更新来提高开发效率。

# Tree Shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

## 添加一个通用模块

## 将文件标记为无副作用(side-effect-free)

## 待读文章

- [Webpack 中的 sideEffects 到底该怎么用？](https://juejin.im/post/5b4ff9ece51d45190c18bb65)
- [Webpack Tree shaking 深入探究](https://juejin.im/post/5bb8ef58f265da0a972e3434)

## 总结

为了学会使用 tree shaking，你必须……

- 使用 ES2015 模块语法（即 import 和 export）。
- 在项目 package.json 文件中，添加一个 "sideEffects" 入口。
- 引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 UglifyJSPlugin）。

# 生产环境构建

## 配置

开发环境(development)和生产环境(production)的构建目标差异很大。两套或多套配置，遵循不重复原则，保留一个“通用”配置。为了将这些配置合并在一起，我们将使用一个名为 [webpack-merge](https://github.com/survivejs/webpack-merge) 的工具。

- 安装

```shell
$ npm install --save-dev webpack-merge
```

添加两个配置文件```webpack.dev.js```和```webpack.prod.js```分别用于开发和生产环境，```webpack.common.js```是通用配置。

```
.
├── README.md
├── config
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── package-lock.json
├── package.json
└── src
```

开发环境：webpack.dev.js

```js
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
})
```

生产环境：webpack.prod.js

```js
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        // 之后我们的代码就可以通过
        // process.env.NODE_ENV === 'production'
        // 判断当前是什么环境
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ]
})
```

# 代码分离Code Split

此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

有三种常用的代码分离方法：

1. 入口起点：使用 entry 配置手动地分离代码。
2. 防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。
3. 动态导入：通过模块的内联函数调用来分离代码。

第一种最简单，属于手动分离，但是存在一些问题：
- 如果入口 chunks 之间包含重复的模块，那些<span style="color: red">重复（下面会解决重复问题）</span>模块都会被引入到各个 bundle 中。
- 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

## 防止重复(prevent duplication)

```CommonsChunkPlugin``` 已废弃。

[SplitChunksPlugin](https://www.webpackjs.com/plugins/commons-chunk-plugin/) 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。

无需安装，简单配置如下，详细配置看文档：

```js
{
    output: {
        // ...
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
}
```

## 动态导入

先移除配置中都```optimization.splitChunks```

```js
// config/webpack.common.js
{
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: '../dist/',
        path: path.resolve(__dirname, '../dist')
     },
}
```

配置好了，试试吧：

```js
function getComponent() {
    return import(/* webpackChunkName: "lodash" */ 'lodash')
        .then(_ => {
            const element = document.createElement('div');

            element.innerHTML = _.join(['Hello', 'Webpack', ' ']);

            return element;
        })
        .catch(error => 'An error occurred while loading the component');
}
  
getComponent().then(component => {
    document.body.appendChild(component);
});
```

注意上面的注释```/* webpackChunkName: "lodash" */```和前面的配置```chunkFilename: '[name].bundle.js',```, 这里实现了动态导入，语意很明确，我们打包的时候会将lodash单独写入一个名为```lodash.chunk.js```的chunk文件。

## 懒加载

使用上面的动态加载，我们还可以通过触发了某个事件或交互来加载模块。

<span style="color: orange">注意当调用 ES6 模块的 import() 方法（引入模块）时，必须指向模块的 .default 值，因为它才是 promise 被处理后返回的实际的 module 对象。</span>

### 各种框架实现懒加载

- React: [Code Splitting and Lazy Loading](https://reacttraining.com/react-router/web/guides/code-splitting)
- Vue: [Lazy Load in Vue using Webpack's code splitting](https://alexjoverm.github.io/2017/07/16/Lazy-load-in-Vue-using-Webpack-s-code-splitting/)
- AngularJS: [AngularJS + Webpack = lazyLoad](https://medium.com/@var_bin/angularjs-webpack-lazyload-bb7977f390dd)

## 预加载

[详细类容](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)

> webpack 4.6.0+ adds support for prefetching and preloading.

LoginButton.js

```js
//...
import(/* webpackPrefetch: true */ 'LoginModal');
```

This will result in ```<link rel="prefetch" href="login-modal-chunk.js">``` being appended in the head of the page, which will instruct the browser to prefetch in **idle time** the ```login-modal-chunk.js``` file.

> webpack will add the prefetch hint once the parent chunk has been loaded.

Preload directive has a bunch of differences compared to prefetch:

<details>
    <summary>预加载的块会和父块并行下载。预取的块会等父块加载完成后。</summary>
    A preloaded chunk starts loading in parallel to the parent chunk. A prefetched chunk starts after the parent chunk finishes loading.
</details>
<details>
    <summary>预加载的块拥有中等优先级，会立刻下载。预取块会等浏览器空闲时下载。</summary>
    A preloaded chunk has medium priority and is instantly downloaded. A prefetched chunk is downloaded while the browser is idle.
</details>
<details>
    <summary>父块应该立即请求预加载的块。预取的块可以在将来的任何时候使用。</summary>
    A preloaded chunk should be instantly requested by the parent chunk. A prefetched chunk can be used anytime in the future.
</details>

- Browser support is different.

ChartComponent.js

```js
//...
import(/* webpackPreload: true */ 'ChartingLibrary');
```

When a page which uses the ChartComponent is requested, the charting-library-chunk is also requested via ```<link rel="preload">```. Assuming the page-chunk is smaller and finishes faster, the page will be displayed with a LoadingIndicator, until the already requested charting-library-chunk finishes. This will give a little load time boost since it only needs one round-trip instead of two. Especially in high-latency environments.

> Using webpackPreload incorrectly can actually hurt performance, so be careful when using it.

## 打包分析 Chunk Analysis

执行```webpack --profile --json > stats.json```可以在根目录生成chunk分析数据文件```stats.json```。这个文件可以提供给第三方工具实现可视化分析：

- [webpack-chart](https://alexkuz.github.io/webpack-chart/)
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

这里说一下第二个：安装```webpack-bundle-analyzer```。

```shell
$ npm install --save-dev webpack-bundle-analyzer
```

添加npm脚本：

*``` *-win ```*指的是兼容windows环境的脚本。

```json
{
    "scripts": {
        "analysis:data": "webpack --profile --json > stats.json",
        "analysis:start": "npm run analysis:data && webpack-bundle-analyzer stats.json",
        "analysis:data-win": "webpack --profile --json | Out-file 'stats.json' -Encoding OEM",
        "analysis:start-win": "npm run analysis:data-win && webpack-bundle-analyzer stats.json",
    },
}
```

# 缓存

通过必要的配置，以确保 webpack 编译生成的文件能够被客户端缓存，而在文件内容变化后，能够请求到新的文件。

## 输出文件的名称

```[contenthash]``` 替换将基于资源的内容添加唯一的哈希。
当资源的内容更改时，```[contenthash]``` 也将更改。

```js
// webpack.config.js

{
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
}
```

<span style="color: orange">输出可能会因当前的 webpack 版本而稍有差异。新版本不一定有和旧版本相同的 hash 问题，但我们以下推荐的步骤，仍然是可靠的。</span>

# 参考文章

- [webpack指南](https://www.webpackjs.com/guides/)
- [使用不同语言编写webpack配置](https://segmentfault.com/a/1190000018738802)
