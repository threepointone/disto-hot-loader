'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = transform;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

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
        return _extends({}, node, {
          callee: _extends({}, node.callee, {
            name: 'require("disto-hot-loader/lib/decorate").register(register, module)'
          })
        });
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'register') {
        return (0, _estemplate2['default'])('require("disto-hot-loader/lib/decorate").register(<%= callee %>, module)((%= arguments %))', node);
      }

      if (node.type === 'CallExpression' && node.callee.name === 'act') {
        return _extends({}, node, {
          callee: _extends({}, node.callee, {
            name: 'require("disto-hot-loader/lib/decorate").act(act, module)'
          })
        });
      }
      if (node.type === 'CallExpression' && (node.callee.property || {}).name === 'act') {
        return (0, _estemplate2['default'])('require("disto-hot-loader/lib/decorate").act(<%= callee %>, module)((%= arguments %))', node);
      }
    }
  }));
}

module.exports = exports['default'];