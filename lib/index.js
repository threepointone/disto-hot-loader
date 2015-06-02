// large chunks taken from https://github.com/gaearon/react-hot-loader
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = transform;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sourceMap = require('source-map');

var _acorn = require('acorn');

var acorn = _interopRequireWildcard(_acorn);

var _estraverse = require('estraverse');

var _estraverse2 = _interopRequireDefault(_estraverse);

var _escodegen = require('escodegen');

var _escodegen2 = _interopRequireDefault(_escodegen);

var _estemplate = require('estemplate');

var _estemplate2 = _interopRequireDefault(_estemplate);

function transform(src) {
  return _escodegen2['default'].generate(_estraverse2['default'].replace(acorn.parse(src), {
    leave: function leave(node, parent) {
      if (node.type === 'CallExpression' && node.callee.name === 'register') {
        return (0, _estemplate2['default'])('require("disto-hot-loader/lib/decorate").register(register, module)((%= arguments %))', node);
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'register') {
        return (0, _estemplate2['default'])('require("disto-hot-loader/lib/decorate").register(<%= callee %>, module)((%= arguments %))', node);
      }

      if (node.type === 'CallExpression' && node.callee.name === 'act') {
        return (0, _estemplate2['default'])('require("disto-hot-loader/lib/decorate").act(act, module)((%= arguments %))', node);
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'act') {
        return (0, _estemplate2['default'])('require("disto-hot-loader/lib/decorate").act(<%= callee %>, module)((%= arguments %))', node);
      }
    }
  }));
}

function makeIdentitySourceMap(content, resourcePath) {
  var map = new _sourceMap.SourceMapGenerator();
  map.setSourceContent(resourcePath, content);

  content.split('\n').map(function (line, index) {
    map.addMapping({
      source: resourcePath,
      original: {
        line: index + 1,
        column: 0
      },
      generated: {
        line: index + 1,
        column: 0
      }
    });
  });

  return map.toJSON();
}

exports['default'] = function (source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  var resourcePath = this.resourcePath;
  if (/[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]react-hot-loader[\\/]|[\\/]react[\\/]lib[\\/]/.test(resourcePath)) {
    return this.callback(null, source, map);
  }

  var acceptUpdates = this.query !== '?manual',
      filename = _path2['default'].basename(resourcePath),
      separator = '\n\n',
      prependText = '',
      appendText = '',
      node,
      result;

  // put your stuff here

  source = transform(source);

  if (this.sourceMap === false) {
    return this.callback(null, [prependText, source, appendText].join(separator));
  }
  if (!map) {
    map = makeIdentitySourceMap(source, this.resourcePath);
  }

  node = new _sourceMap.SourceNode(null, null, null, [new _sourceMap.SourceNode(null, null, this.resourcePath, prependText), _sourceMap.SourceNode.fromStringWithSourceMap(source, new _sourceMap.SourceMapConsumer(map)), new _sourceMap.SourceNode(null, null, this.resourcePath, appendText)]).join(separator);

  result = node.toStringWithSourceMap();

  this.callback(null, result.code, result.map.toString());
};

module.exports = exports['default'];