'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _authentication = require('./authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  authentication: _authentication2.default,
  collection: _collection2.default,
  form: _form2.default
};
module.exports = exports['default'];