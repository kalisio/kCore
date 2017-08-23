'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mixin = require('./mixin.base-item-action');

var _mixin2 = _interopRequireDefault(_mixin);

var _mixin3 = require('./mixin.create-item');

var _mixin4 = _interopRequireDefault(_mixin3);

var _mixin5 = require('./mixin.delete-item');

var _mixin6 = _interopRequireDefault(_mixin5);

var _mixin7 = require('./mixin.edit-item');

var _mixin8 = _interopRequireDefault(_mixin7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  baseItemAction: _mixin2.default,
  createItem: _mixin4.default,
  deleteItem: _mixin6.default,
  editItem: _mixin8.default
};
module.exports = exports['default'];
//# sourceMappingURL=index.js.map