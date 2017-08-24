'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createItemMixin = {
  methods: {
    createItem: function createItem() {
      var route = this.$store.get('config.' + this.service.path + '.createItem', '');
      if (route) {
        this.$router.push({ name: route });
      } else {
        _loglevel2.default.warn('[createItem] no route specified for the service ' + this.service);
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