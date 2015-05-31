// large chunks taken from https://github.com/gaearon/react-hot-loader
import path from 'path';
import SourceMap from 'source-map';
let {SourceNode, SourceMapConsumer} = SourceMap;

import transform from './parse';

import makeIdentitySourceMap from './makeIdentitySourceMap';

export default function(source, map){
  if (this.cacheable) {
    this.cacheable();
  }


  var resourcePath = this.resourcePath;
  if (/[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]react-hot-loader[\\/]|[\\/]disto[\\/]|[\\/]react[\\/]lib[\\/]/.test(resourcePath)) {
    return this.callback(null, source, map);
  }

  var acceptUpdates = this.query !== '?manual',
      filename = path.basename(resourcePath),
      separator = '\n\n',
      prependText = '',
      appendText = '',
      node,
      result;

  // put your stuff here

  source = transform(source);

 if (this.sourceMap === false) {
    return this.callback(null, [
      prependText,
      source,
      appendText
    ].join(separator));
  }
  if (!map) {
    map = makeIdentitySourceMap(source, this.resourcePath);
  }

  node = new SourceNode(null, null, null, [
    new SourceNode(null, null, this.resourcePath, prependText),
    SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(map)),
    new SourceNode(null, null, this.resourcePath, appendText)
  ]).join(separator);

  result = node.toStringWithSourceMap();

  this.callback(null, result.code, result.map.toString());
}
