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
      var route = this.store().get('config.' + this.service + '.editItem', '');
      if (route) {
        this.$router.push({ name: route });
      } else {
        _loglevel2.default.warn('[editItem] no route specified for the service ' + this.service);
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