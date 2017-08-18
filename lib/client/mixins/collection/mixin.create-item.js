'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createItemMixin = {
  dependencies: ['store'],
  methods: {
    createItem: function createItem() {
      var formRoute = this.store().get('config.' + this.service + '.form', '');
      if (formRoute) {
        this.$router.push({ name: formRoute, params: { service: this.service } });
      } else {
        _loglevel2.default.warn('createItemMixin:editItem: no route specified for the service ' + this.service);
      }
    }
  },
  mounted: function mounted() {
    this.actions.push({
      icon: 'add',
      scope: '',
      handler: 'createItem'
    });
  }
};

exports.default = createItemMixin;
module.exports = exports['default'];
//# sourceMappingURL=mixin.create-item.js.map