'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceMixin = {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  watch: {
    service: function service(parameters) {
      var context = this.$store.get(parameters.context, null);
      this._service = this.$api.getService(parameters.path, context);
    }
  },
  methods: {
    find: function find(params) {
      return this._service.find(params);
    },
    get: function get(id, params) {
      return this._service.get(id, params);
    },
    create: function create(data, params) {
      return this._service.create(data, params);
    },
    update: function update(id, data, params) {
      return this._service.update(id, data, params);
    },
    patch: function patch(id, data, params) {
      return this._service.patch(id, data, params);
    },
    remove: function remove(id, params) {
      return this._service.remove(id, params);
    }
  },
  created: function created() {
    if (!this.service.path) {
      _loglevel2.default.error('The \'service\' property should contains a \'path\' property');
      return;
    }
    var path = this.service.path;
    var context = this.$store.get(this.service.context, null);
    this._service = this.$api.getService(path, context);
    if (!this._service) {
      _loglevel2.default.error('The specified service doest not exist');
    }
  }
};

exports.default = serviceMixin;
module.exports = exports['default'];