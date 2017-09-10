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
      <q-btn v-if="clearButton !== ''" color="primary" @click="clear">{{ clearButton }}</q-btn>
      <q-btn v-if="resetButton !== ''" color="primary" @click="reset">{{ resetButton }}</q-btn>
      <q-btn loader color="primary" @click="submit">{{ submitButton }}</q-btn>
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
    QBtn,
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    submitButton: {
      type: String,
      default: 'Submit'
    },
    clearButton: {
      type: String,
      default: ''
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
      // Checks whether the form is valid
      if (! this.validator(this.values())) {
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
      // Compile the schema
      this.validator = this.ajv.compile(this.schema)
      // Clear the field values/states
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
    values () {
      let values = {}
      Object.keys(this.schema.properties).forEach(property => {
        if (!this.$refs[property][0].isEmpty()) {
          values[property] = this.$refs[property][0].value()
        }
      })
      return values
    },
    fill (values) {
      Object.keys(this.schema.properties).forEach(property => {
        let value = _.get(values, property)
        if (value) {
          // Override the default value in order to use this value when reseting the form
          _.set(this.schema.properties[property], 'default', value)
          this.$refs[property][0].fill(value)
        } else {
          // The field has no value, then assign a default one
          this.$refs[property][0].reset()
        }
      })
      this.validate(this.values())
    },
    clear () {
      Object.keys(this.schema.properties).forEach(property => {
        this.$refs[property][0].clear()
      })
    },
    reset () {
      Object.keys(this.schema.properties).forEach(property => {
        this.$refs[property][0].reset()
      })
      this.validate(this.values())
    },
    validate (values) {
      // If the validation fails, it iterates though the errors in order
      // to update the validation status of each field
      if (!this.validator(values)) {
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
    cancel () {
      this.$emit('canceled')
    },
    submit (event, done) {
      let values = this.values()
      if (this.validate(values)) {
        this.$emit('submitted', values, done)
      } else  {
        done()
      }
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
