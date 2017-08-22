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
        @touched="touch"
      />
    </template>
    <!--
      Buttons section
    -->
    <div class="row justify-around" style="padding: 18px">
      <q-btn v-if="cancelButton !== ''" color="primary" @click="cancel">{{ cancelButton }}</q-btn>
      <q-btn color="primary" @click="submit">{{ submitButton }}</q-btn>
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
  dependencies: ['store'],
  props: {
    schema: {
      type: Object,
      required: true
    },
    submitButton: {
      type: String,
      default: 'Submit',
    },
    cancelButton: {
      type: String,
      default: ''
    }
  },
  methods: {
    touch (field, value) {
      // Store the value
      this.values[field] = value
      // Validate the form 
      if (! this.validator(this.values)) {
        // If not value check whether an error is assigned to the field
        for (let i = 0; i < this.validator.errors.length; i++) {
          let error = this.validator.errors[i]
          let property = _.replace(error.dataPath, '.', '')
          if (property === field) {
            // Found an error assigned to the field then invalidate it
            this.$refs[field][0].invalidate(error.message)
            return
          }
        }
      }
      // Validate the field
      this.$refs[field][0].validate()
    },
    fill (values) {
      Object.keys(values).forEach(field => {
        if (this.$refs[field]) {
          this.$refs[field][0].fill(values[field])
        }
      })
    },
    submit () {
      // Validate this form
      // If the validation fails, it iterates though the errors in order
      // to update the validation status of each field
      if (! this.validator(this.values)) {
        this.validator.errors.forEach(error => {
          if (error.keyword === 'required') {
            let property = error.params.missingProperty
            this.$refs[property][0].invalidate(error.message)
          } else {
            let property = _.replace(error.dataPath, '.', '')
            if (Object.keys(this.schema.properties).includes(property)) {
              this.$refs[property][0].invalidate(error.message)
            }
          }
        })
      } else {
        this.$emit('submitted', this.values)
      }
    },
    cancel () {
      this.$emit('canceled')
    }
  },
  created () {
    let Store = this.store()
    let loadComponent = Store.get('loadComponent')
    // Initialize the values to an empty object
    this.values = {}
    // Iterate through the properties in order to 
    // 1- assign a name corresponding to the key to enable a binding between properties and fields
    // 2- assign a component key corresponding to the component path 
    // 3- load the component if not previously loaded
    Object.keys(this.schema.properties).forEach(propertyKey => {
      let property = this.schema.properties[propertyKey]
      property['name'] = propertyKey
      // is the field already loaded ?
      let componentKey = _.kebabCase(property.field.component)
      property['componentKey'] = componentKey
       // is the component already loaded ?
      if (!this.$options.components[componentKey]) {
        this.$options.components[componentKey] = loadComponent(property.field.component)
      } 
    })
    // Create the AJV instance
    this.ajv = new Ajv({ 
      allErrors: true,
      coerceTypes: true,
      $data: true
    })
    // Compile the schema
    this.validator = this.ajv.compile(this.schema)
  }
}
</script>
