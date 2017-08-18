<template>
  <div class="column">
    <!--
      Fields section
    -->
    <template v-for="property in schema.properties">
      <component
        :is="'k-' + property.field.type + '-field'"
        :ref="property.name"
        :form="$refs.form"
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
import KTextField from './KTextField.vue'
import KNumberField from './KNumberField.vue'
import KEmailField from './KEmailField.vue'
import KPasswordField from './KPasswordField.vue'
import KPhoneField from './KPhoneField.vue'
import KUrlField from './KUrlField.vue'
import KChipsField from './KChipsField.vue'

export default {
  name: 'k-form',
  components: {
    KTextField,
    KNumberField,
    KEmailField,
    KPasswordField,
    KPhoneField,
    KUrlField,
    KChipsField,
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
        this.$refs[field][0].fill(values[field])
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
    // Initialize the values to an empty object
    this.values = {}
    // Iterate through the properties in order to add a name to each property corresponding to the key
    Object.keys(this.schema.properties).forEach(propertyKey => {
      let property = this.schema.properties[propertyKey]
      property['name'] = propertyKey
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
