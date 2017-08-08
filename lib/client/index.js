'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = undefined;

var _api = require('./api');

Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _api[key];
    }
  });
});

var _store = require('./store');

Object.keys(_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _store[key];
    }
  });
});
exports.default = init;

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _hooks2 = require('./hooks');

var _hooks = _interopRequireWildcard(_hooks2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.hooks = _hooks;

// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far

function init() {
  var app = this;

  _loglevel2.default.debug('Initializing kaelia core');
}