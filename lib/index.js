'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = undefined;

var _db = require('./db');

Object.keys(_db).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _db[key];
    }
  });
});

var _application = require('./application');

Object.keys(_application).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _application[key];
    }
  });
});
exports.default = init;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _services = require('./services');

var _services2 = _interopRequireDefault(_services);

var _hooks2 = require('./hooks');

var _hooks = _interopRequireWildcard(_hooks2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.hooks = _hooks;
// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far

var debug = (0, _debug2.default)('kalisio:kCore');

function init() {
  var app = this;

  debug('Initializing kalisio');
  app.configure(_services2.default);
}
//# sourceMappingURL=index.js.map