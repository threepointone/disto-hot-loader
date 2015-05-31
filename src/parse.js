import * as acorn from 'acorn';

import estraverse from 'estraverse';
import escodegen from 'escodegen';
import estemplate from 'estemplate';


export default function transform(src){
  return escodegen.generate(estraverse.replace(acorn.parse(src), {
    leave: function (node, parent) {
      if (node.type === 'CallExpression' && node.callee.name === 'register'){
        return {
          ...node,
          callee: {
            ...node.callee,
            name: 'require("disto-hot-loader/lib/decorate").register(register, module)'
          }
        };
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'register'){
        return estemplate('require("disto-hot-loader/lib/decorate").register(<%= callee %>, module)((%= arguments %))', node);
      }

      if (node.type === 'CallExpression' && node.callee.name === 'act'){
        return {
          ...node,
          callee: {
            ...node.callee,
            name: 'require("disto-hot-loader/lib/decorate").act(act, module)'
          }
        };
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'act'){
        return estemplate('require("disto-hot-loader/lib/decorate").act(<%= callee %>, module)((%= arguments %))', node);
      }
    }
  }));
}

