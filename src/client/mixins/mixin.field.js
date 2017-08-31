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
    value () {
      return this.model
    },
    clear () {
      this.assign(this.property.default ? this.property.default : '')
    },
    restore () {
      this.assign(this.property.backup)
    },
    fill (value) {
      this.property['backup'] = value
      this.assign(value)
    },
    assign (value) {
      if (this.model !== value) {
        this.model = value
        this.touch()
      }
    },
    touch () {
      this.$emit('field-touched', this.property.name, this.model)
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
    this.clear()
    // Tell the form the field is ready
    this.$emit('field-ready', this.property.name)
  }
}

export default fieldMixin
