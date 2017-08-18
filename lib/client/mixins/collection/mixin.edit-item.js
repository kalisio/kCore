'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var editItemMixin = {
  dependencies: ['store'],
  methods: {
    editItem: function editItem(item) {
      var formRoute = Store.get('config.' + this.service + '.form', '');
      if (formRoute) {
        this.$router.push({ name: formRoute, params: { id: item._id } });
      } else {
        _loglevel2.default.warn('editItemMixin:editItem: no route specified for the service ' + this.service);
      }
    }
  },
  mounted: function mounted() {
    this.actions.push({
      label: 'Edit',
      icon: 'create',
      scope: 'item',
      handler: 'editItem'
    });
  }
};

exports.default = editItemMixin;
module.exports = exports['default'];
//# sourceMappingURL=mixin.edit-item.js.map