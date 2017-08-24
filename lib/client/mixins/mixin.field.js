'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fieldMixin = {
  props: {
    property: {
      type: Object,
      required: true
    },
    display: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon: function icon() {
      if (this.display.icon) {
        return this.property.field.icon;
      }
      return '';
    },
    label: function label() {
      if (this.display.label) {
        return this.property.field.label;
      }
      return '';
    },
    labelWidth: function labelWidth() {
      return this.display.labelWidth;
    },
    helper: function helper() {
      return this.property.field.helper;
    },
    hasError: function hasError() {
      return !_lodash2.default.isEmpty(this.error);
    },
    errorLabel: function errorLabel() {
      return this.error;
    }
  },
  data: function data() {
    return {
      // The model to used for data binding with the field
      model: '',
      // The error message
      error: ''
    };
  },

  methods: {
    validate: function validate() {
      this.error = '';
    },
    invalidate: function invalidate(error) {
      this.error = error;
    },
    touch: function touch() {
      this.$emit('touched', this.property.name, this.model);
    },
    value: function value() {
      return this.model;
    },
    fill: function fill(value) {
      this.model = value;
      this.touch();
    }
  },
  mounted: function mounted() {
    // Initialize the model with a default value if any
    if (_lodash2.default.has(this.property, 'default')) {
      this.fill(this.property.default);
    }
  }
};

exports.default = fieldMixin;
module.exports = exports['default'];