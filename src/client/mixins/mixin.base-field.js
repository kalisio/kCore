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
      model: null,
      // The error message
      error: ''
    }
  },
  methods: {
    onChanged () {
      this.$emit('field-changed', this.property.name, this.model)
    },
    fill (value) {
      this.model = value
    },
    validate () {
      this.error = ''
    },
    invalidate (error) {
      this.error = error
    }
  },
  mounted () {
    // Init the model with the default value if any
    if (this.property.default) {
      this.fill(this.property.default)
      // The the form to validate this field
      this.onChanged() 
    }
    // Tell the form the field is ready
    this.$emit('field-ready')
  }
}

export default baseFieldMixin
