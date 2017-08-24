import _ from 'lodash'

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
    validate () {
      this.error = ''
    },
    invalidate (error) {
      this.error = error
    },
    touch () {
      this.$emit('touched', this.property.name, this.model)
    },
    value () {
      return this.model
    },
    fill (value) {
      this.model = value
      this.touch()
    }
  },
  mounted () {
    // Initialize the model with a default value if any
    if (_.has(this.property, 'default')) {
      this.fill(this.property.default)
    }
  }
}

export default fieldMixin
