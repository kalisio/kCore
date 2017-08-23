'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseItemAction = {
  dependencies: ['api'],
  data: function data() {
    return {
      actions: []
    };
  },

  methods: {
    onActionRequested: function onActionRequested(handler, item) {
      var action = this[handler];
      if (typeof action === 'function') {
        action.call(this, item);
      } else {
        _loglevel2.default.warn('[onActionRequested] invalid handler');
      }
    }
  }
};

exports.default = baseItemAction;
module.exports = exports['default'];
//# sourceMappingURL=mixin.base-item-action.js.map