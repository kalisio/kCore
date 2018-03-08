import _ from 'lodash'

let baseFieldMixin = {
  props: {
    contextId: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    properties: {
      type: Object,
      required: true
    },
    required: {
      type: Boolean,
      required: true
    },
    display: {
      type: Object,
      required: true
    }
  },
  computed: {
    icon () {
      if (this.display.icon) {
        return _.get(this.properties.field, 'icon', '')
      }
      return ''
    },
    label () {
      if (this.display.label) {
        return this.$t(_.get(this.properties.field, 'label', ''))
      }
      return ''
    },
    labelWidth () {
      return _.get(this.display, 'labelWidth', 3)
    },
    helper () {
      return this.$t(_.get(this.properties.field, 'helper', ''))
    },
    hasError () {
      return !_.isEmpty(this.error)
    },
    errorLabel () {
      return this.error
    }
  },
  data () {
    return {
      // The model to used for data binding with the field
      model: this.emptyModel(),
      // The error message
      error: ''
    }
  },
  methods: {
    emptyModel () {
      return ''
    },
    isEmpty () {
      return _.isEqual(this.model, this.emptyModel())
    },
    value () {
      return this.model
    },
    fill (value) {
      this.model = value
    },
    clear () {
      this.fill(_.get(this.properties, 'default', this.emptyModel()))
    },
    validate () {
      this.error = ''
    },
    invalidate (error) {
      this.error = error
    },
    getMode () {
      if (this.id) return 'update'
      return 'create'
    },
    onChanged () {
      // Tell the form that this field has a new value.
      // Consequently the form will validate or invalidate the field
      // Warning: This method must be called once the form is mounted
      // We need to force a refresh so that the model is correctly updated by Vuejs
      this.$nextTick().then(() => this.$emit('field-changed', this.properties.name, this.model))
    },
    apply (object, field) {
      // To be overloaded if you need to perform specific operations before the form has been submitted
      // By default simply set the current value on the given object field to apply the form
      _.set(object, field, this.value())
    },
    submitted (object, field) {
      // To be overloaded if you need to perform specific operations after the form has been submitted
    }
  }
}

export default baseFieldMixin
