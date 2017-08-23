'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mixins = undefined;

var _mixins2 = require('./mixins');

var _mixins = _interopRequireWildcard(_mixins2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.mixins = _mixins; // FIXME: we don't build vue component anymore, they are processed by webpack in the application template
// export * from './components'

// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far
//# sourceMappingURL=index.js.map