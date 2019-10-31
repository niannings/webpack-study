# webpack loader 用于导入解析markdown文件

基于```marked.js```和```highlight.js```。感谢大佬！！！

## Usage

### Install

```shell
$ npm install marked-loader -D
```

### Config

```js
// webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test: /\.(md|markdown)$/,
                use: [
                    {
                        loader: 'marked-loader',
                        options: {
                            test: 'hello'
                        }
                    }
                ]
            },
        ]
    }
}
```

### Start

- 样式准备：

这些css可以在cdnjs或者bootcdn找到：[cdnjs](https://cdnjs.com/libraries/highlight.js/)

```css
/* style.css */
@import url(https://cdn.bootcss.com/github-markdown-css/3.0.1/github-markdown.min.css);
@import url(https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css);
```

- 尝试导入```markdown```文件吧！

```js
// some.js
import './style.css';
import hello from './hello.md';

document.body.appendChild(hello);
```

开始玩耍吧！😄
