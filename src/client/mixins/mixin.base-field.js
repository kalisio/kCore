import _ from 'lodash'

let baseFieldMixin = {
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
    icon () {
      if (this.display.icon) {
        return this.property.field.icon
      }
      return ''
    },
    label () {
      if (this.display.label) {
        return this.property.field.label
      }
      return ''
    },
    labelWidth () {
      return this.display.labelWidth
    },
    helper () {
      return this.property.field.helper
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
      model: this.defaultModel(),
      // The error message
      error: ''
    }
  },
  methods: {
    defaultModel () {
      return ''
    },
    isEmpty () {
      return _.isEqual(this.model, this.defaultModel())
    },
    value () {
      return this.model
    },
    fill (value) {
      this.model = value
    },
    clear () {
      this.fill(this.defaultModel())
    },
    reset () {
      this.fill(this.property.default ? this.property.default : this.defaultModel())
    },
    validate () {
      this.error = ''
    },
    invalidate (error) {
      this.error = error
    },
    onChanged () {
      // Tell the form that this field has a new value. 
      // Consequently the form will validate or invalidate the field
      // Warning: This method must be called once the form is mounted
      this.$emit('field-changed', this.property.name, this.model)
    },
  },
  mounted () {
    this.reset()
    // Tell the form the field is ready
    this.$emit('field-ready')
  }
}

export default baseFieldMixin
