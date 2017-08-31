let fieldMixin = {
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
      model: '',
      // The error message
      error: ''
    }
  },
  methods: {
    onChanged () {
      this.$emit('field-changed', this.property.name, this.model)
    },
    value () {
      return this.model
    },
    reset () {
      this.assign(this.property.default ? this.property.default : '')
    },
    fill (value) {
      this.property.default = value
      this.assign(value)
    },
    assign (value) {
      this.model = value
      this.onChanged()
    },
    validate () {
      this.error = ''
    },
    invalidate (error) {
      this.error = error
    }
  },
  mounted () {
    // Clear the model (assign a default value if any)
    this.reset()
    // Tell the form the field is ready
    this.$emit('field-ready')
  }
}

export default fieldMixin
