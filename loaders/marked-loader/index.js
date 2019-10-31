const { getOptions } = require('loader-utils');
const hljs = require('highlight.js');
const marked = require('marked');
const validateOptions = require('schema-utils');

/**
 * gfm
它是一个布尔值，默认为true。

允许 Git Hub标准的markdown.

 * tables
它是一个布尔值，默认为true。

允许支持表格语法。该选项要求 gfm 为true。

 * breaks
它是一个布尔值，默认为false。

允许回车换行。该选项要求 gfm 为true。

* pedantic
它是一个布尔值，默认为false。

尽可能地兼容 markdown.pl的晦涩部分。不纠正原始模型任何的不良行为和错误。

 * sanitize
它是一个布尔值，默认为false。

对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）

 * smartLists
它是一个布尔值，默认为false。

使用比原生markdown更时髦的列表。 旧的列表将可能被作为pedantic的处理内容过滤掉.

 * smartypants
它是一个布尔值，默认为false。

使用更为时髦的标点，比如在引用语法中加入破折号。
 */

const schema = {
  type: 'object',
  properties: {
    gfm: {
        type: 'boolean',
    },
    tables: {
        type: 'boolean',
    },
    breaks: {
        type: 'boolean',
    },
    pedantic: {
        type: 'boolean',
    },
    sanitize: {
        type: 'boolean',
    },
    smartLists: {
        type: 'boolean',
    },
    smartypants: {
        type: 'boolean',
    },
  }
};

const rendererMD = new marked.Renderer();
const defaultOptions = {
    renderer: rendererMD,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
};

marked.setOptions(defaultOptions);

module.exports = function(source) {
  const options = getOptions(this);

  if (options) {
    marked.setOptions(options);      
  }

  validateOptions(schema, options, 'md-loader');

  const html = `<div class="markdown-body">${ marked(source).replace(/<pre>/, '<pre class="hljs">') }</div>`;

  return `export default ${ JSON.stringify(html) }`;
}
