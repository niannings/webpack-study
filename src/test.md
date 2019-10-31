# 测试md-loader

> 感谢

|   |   |
|---|---|
|  1 | 2  |

```js
const { getOptions } = require('loader-utils');
const markd = require('markd');
// const validateOptions = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

module.exports = function(source) {
  const options = getOptions(this);

  console.log(options)

  // validateOptions(schema, options, 'Example Loader');

  // 对资源应用一些转换……

  console.log(source);

  return `export default ${ markd(source) }`;
}
```