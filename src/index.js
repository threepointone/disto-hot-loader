// large chunks taken from https://github.com/gaearon/react-hot-loader
import path from 'path';
import {SourceNode, SourceMapConsumer, SourceMapGenerator} from 'source-map';

import * as acorn from 'acorn';
import estraverse from 'estraverse';
import escodegen from 'escodegen';
import estemplate from 'estemplate';


export default function transform(src){
  return escodegen.generate(estraverse.replace(acorn.parse(src), {
    leave: function (node, parent) {
      if (node.type === 'CallExpression' && node.callee.name === 'register'){
        return estemplate('require("disto-hot-loader/lib/decorate").register(register, module)((%= arguments %))', node);
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'register'){
        return estemplate('require("disto-hot-loader/lib/decorate").register(<%= callee %>, module)((%= arguments %))', node);
      }

      if (node.type === 'CallExpression' && node.callee.name === 'act'){
        return estemplate('require("disto-hot-loader/lib/decorate").act(act, module)((%= arguments %))', node);
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'act'){
        return estemplate('require("disto-hot-loader/lib/decorate").act(<%= callee %>, module)((%= arguments %))', node);
      }
    }
  }));
}


function makeIdentitySourceMap(content, resourcePath) {
  var map = new SourceMapGenerator();
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


export default function(source, map){
  if (this.cacheable) {
    this.cacheable();
  }


  var resourcePath = this.resourcePath;
  if (/[\\/]webpack[\\/]buildin[\\/]module\.js|[\\/]react-hot-loader[\\/]|[\\/]react[\\/]lib[\\/]/.test(resourcePath)) {
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
