'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = log;

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function log(hook) {
  var message = hook.type + ': ' + hook.path + ' - Method: ' + hook.method;

  if (hook.type === 'error') {
    message += ': ' + hook.error.message;
  }

  _loglevel2.default.debug(message);
  if (hook.error) {
    _loglevel2.default.error(hook.error);
  }
  if (hook.data) {
    _loglevel2.default.trace(hook.data);
  }
  if (hook.params) {
    _loglevel2.default.trace(hook.params);
  }
  if (hook.result) {
    _loglevel2.default.trace(hook.result);
  }
} // A hook that logs service method before, after and error
//# sourceMappingURL=logger.js.map