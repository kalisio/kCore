'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _quasar = require('quasar');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Export singleton
var Store = {
  set: function set(path, value) {
    _lodash2.default.set(this, path, value);
    var eventName = _lodash2.default.kebabCase(path + '-changed');
    _quasar.Events.$emit(eventName, value);
  },
  get: function get(path, defaultValue) {
    return _lodash2.default.get(this, path, defaultValue);
  },
  has: function has(path) {
    return _lodash2.default.has(this, path);
  }
};

exports.Store = Store;