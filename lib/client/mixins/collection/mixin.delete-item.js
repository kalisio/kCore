'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _quasar = require('quasar');

var deleteItemMixin = {
  methods: {
    deleteItem: function deleteItem(item) {
      var _this = this;

      _quasar.Dialog.create({
        title: 'Warning',
        message: 'Are you sure you want to delete ' + item.name + '?',
        buttons: ['Cancel', {
          label: 'Delete',
          handler: function handler() {
            // delete the required item
            _this.$api.getService(_this.service).remove(item._id);
          }
        }]
      });
    }
  },
  mounted: function mounted() {
    this.actions.push({
      label: 'Delete',
      icon: 'delete',
      scope: 'item',
      handler: 'deleteItem'
    });
  }
};

exports.default = deleteItemMixin;
module.exports = exports['default'];