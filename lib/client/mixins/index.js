'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mixin = require('./mixin.service');

var _mixin2 = _interopRequireDefault(_mixin);

var _mixin3 = require('./mixin.field');

var _mixin4 = _interopRequireDefault(_mixin3);

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  service: _mixin2.default,
  authentication: _authentication2.default,
  collection: _collection2.default,
  field: _mixin4.default
};
module.exports = exports['default'];