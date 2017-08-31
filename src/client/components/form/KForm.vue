<template>
  <div class="column">
    <!--
      Fields section
    -->
    <template v-for="property in schema.properties">
      <component
        :is="property.componentKey"
        :ref="property.name"
        :property="property"
        :display="schema.form.properties"
        @field-changed="onFieldChanged"
        @field-ready="onFieldReady"
      />
    </template>
    <!--
      Buttons section
    -->
    <div class="row justify-around" style="padding: 18px">
      <q-btn v-if="cancelButton !== ''" color="primary" @click="cancel">{{ cancelButton }}</q-btn>
      <q-btn v-if="resetButton !== ''" color="primary" @click="reset">{{ resetButton }}</q-btn>
      <q-btn :disabled="!canSubmit" color="primary" @keyup.enter="submit" @click="submit">{{ submitButton }}</q-btn>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Ajv from 'ajv'
import { QBtn } from 'quasar'

export default {
  name: 'k-form',
  components: {
    QBtn
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    submitButton: {
      type: String,
      default: 'Submit',
    },
    resetButton: {
      type: String,
      default: ''
    },
    cancelButton: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      canSubmit: false
    }
  },
  methods: {
    onFieldReady () {
      // Increments the number of ready fields
      this.nbFieldReady++
      // Check whether the form is ready, that is to say all the fields are ready
      if (this.nbFieldReady === _.size(this.schema.properties)) {
        this.$emit('form-ready')
      }
    },
    onFieldChanged (field, value) {
      // this.$store the value if not empty
      if (_.isEmpty(value))  {
        if (this.values[field]) {
          delete this.values[field]
        }
      } else {
        this.values[field] = value
      }
      // Checks whether the form is valid
      if (! this.validator(this.values)) {
        // If not disable submit button
        this.canSubmit = false
        // Checks whether the touched field has an error
        let error = this.hasFieldError(field)
        if (error) {
          // Invalidate the field
          this.$refs[field][0].invalidate(error.message)
          return
        }
      } 
      // Validate the field
      this.$refs[field][0].validate()
      this.canSubmit = true
    },
    hasFieldError (field) {
      for (let i = 0; i < this.validator.errors.length; i++) {
        let error = this.validator.errors[i]
        // Check whether the field is required
        if (error.keyword === 'required') {
          if (error.params.missingProperty === field) return error
        } else {
          // Check whether is the field in invalid
          let fieldDataPath = "." + field
          if (error.dataPath === fieldDataPath) return error
        }
      }
      return null
    },
    build () {
      this.canSubmit = false
      // Compile the schema
      this.validator = this.ajv.compile(this.schema)
      // Clear the field values/states
      this.values = {}
      this.nbFieldReady = 0
      // 1- assign a name corresponding to the key to enable a binding between properties and fields
      // 2- assign a component key corresponding to the component path 
      // 3- load the component if not previously loaded
      let loadComponent = this.$store.get('loadComponent')
      Object.keys(this.schema.properties).forEach(propertyKey => {
        let property = this.schema.properties[propertyKey]
        // 1- assign a name corresponding to the key to enable a binding between properties and fields
        property['name'] = propertyKey
        // 2- assign a component key corresponding to the component path
        let componentKey = _.kebabCase(property.field.component)
        property['componentKey'] = componentKey
        // 3- load the component if not previously loaded
        if (!this.$options.components[componentKey]) {
          this.$options.components[componentKey] = loadComponent(property.field.component)
        } else {
          // Otherwise tell the field is ready
          this.onFieldReady()
        }
      })
    },
    validate () {
      // If the validation fails, it iterates though the errors in order
      // to update the validation status of each field
      if (!this.validator(this.values)) {
        Object.keys(this.schema.properties).forEach(property => {
          let error = this.hasFieldError(property)
          if (error) {
            this.$refs[property][0].invalidate(error.message)
          } else {
            this.$refs[property][0].validate()
          }
        })
        return false
      }
      Object.keys(this.schema.properties).forEach(property => {
        this.$refs[property][0].validate()
      })
      return true
    },
    fill (values) {
      this.canSubmit = false
      this.values = {}
      Object.keys(this.schema.properties).forEach(property => {
        let value = _.get(values, property, '')
        if (!_.isEmpty(value)) {
          this.values[property] = value
          _.set(this.schema.properties[property], 'default', value)
        }
        this.$refs[property][0].fill(value)
      })
      this.validate()
    },
    reset () {
      this.canSubmit = false
      this.values = {}
      Object.keys(this.schema.properties).forEach(property => {
        let value = _.get(this.schema.properties[property], 'default', '')
        if (!_.isEmpty(value)) this.values[property] = value
        this.$refs[property][0].fill(value)
      })
      this.validate()
    },
    submit () {
      this.canSubmit = false
      if (this.validate()) {
        this.$emit('submitted', this.values)
      }
    },
    cancel () {
      this.$emit('canceled')
    }
  },
  created () {
    // Create the AJV instance
    this.ajv = new Ajv({ 
      allErrors: true,
      coerceTypes: true,
      $data: true
    })
    this.build()
  }
}
</script>
