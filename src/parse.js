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
              name: '__couch__(register)'
            }
          };
        }
        if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'register'){
          return estemplate('__couch__(<%= callee %>)((%= arguments %))', node);
        }
    }
  }));
}

