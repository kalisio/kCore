import lodash from 'lodash'

let baseFieldMixin = {
  props: {
    properties: {
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
        return lodash.get(this.properties.field, 'icon', '')
      }
      return ''
    },
    label () {
      if (this.display.label) {
        return lodash.get(this.properties.field, 'label', '')
      }
      return ''
    },
    labelWidth () {
      return lodash.get(this.display, 'labelWidth', 3)
    },
    helper () {
      return lodash.get(this.properties.field, 'helper', '')
    },
    hasError () {
      return !lodash.isEmpty(this.error)
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
      return lodash.isEqual(this.model, this.defaultModel())
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
      this.fill(lodash.get(this.properties, 'default', this.defaultModel()))
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
      this.$emit('field-changed', this.properties.name, this.model)
    }
  },
  created () {
    this.reset()
  }
}

export default baseFieldMixin
