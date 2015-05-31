// large chunks taken from https://github.com/gaearon/react-hot-loader
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _makeIdentitySourceMap = require('./makeIdentitySourceMap');

var _makeIdentitySourceMap2 = _interopRequireDefault(_makeIdentitySourceMap);

var SourceNode = _sourceMap2['default'].SourceNode;
var SourceMapConsumer = _sourceMap2['default'].SourceMapConsumer;

exports['default'] = function (source, map) {
  if (this.cacheable) {
    this.cacheable();
  }

  var resourcePath = this.resourcePath;
  if (/[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]react-hot-loader[\\/]|[\\/]disto[\\/]|[\\/]react[\\/]lib[\\/]/.test(resourcePath)) {
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

  source = (0, _parse2['default'])(source);

  if (this.sourceMap === false) {
    return this.callback(null, [prependText, source, appendText].join(separator));
  }
  if (!map) {
    map = (0, _makeIdentitySourceMap2['default'])(source, this.resourcePath);
  }

  node = new SourceNode(null, null, null, [new SourceNode(null, null, this.resourcePath, prependText), SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)), new SourceNode(null, null, this.resourcePath, appendText)]).join(separator);

  result = node.toStringWithSourceMap();

  this.callback(null, result.code, result.map.toString());
};

module.exports = exports['default'];