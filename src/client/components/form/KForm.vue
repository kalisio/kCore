<template>
  <div class="column">
    <template v-for="field in fields">
      <component
        :is="field.componentKey"
        :ref="field.name"
        :properties="field"
        :display="display"
        @field-changed="onFieldChanged"
      />
    </template>
  </div>
</template>

<script>
import logger from 'loglevel'
import lodash from 'lodash'
import Ajv from 'ajv'

export default {
  name: 'k-form',
  props: {
    schema: {
      type: [String, Object],
      default: () => ({})
    }
  },
  data () {
    return {
      fields: [],
      display: { icon: false, label: true, labelWidth: 3 }
    }
  },
  watch: {
    // Watch the schema because the form has to be rebuilt if the prop changes
    schema: function () {
      this.build()
    }
  },
  methods: {
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
    buildFields  (schema) {
      // Clear the fields states
      this.nbExpectedFields = Object.keys(schema.properties).length
      this.nbReadyFields = 0
      // Build the fields
      // 1- assign a name corresponding to the key to enable a binding between properties and fields
      // 2- assign a component key corresponding to the component path 
      // 3- load the component if not previously loaded
      let loadComponent = this.$store.get('loadComponent')
      Object.keys(schema.properties).forEach(property => {
        let field = schema.properties[property]
        // 1- assign a name corresponding to the key to enable a binding between properties and fields
        field['name'] = property
        // 2- assign a component key corresponding to the component path
        let componentKey = lodash.kebabCase(field.field.component)
        field['componentKey'] = componentKey
        // Adds the field to the list of fields to be rendered
        this.fields.push(field)
        // 3- load the component if not previously loaded
        if (!this.$options.components[componentKey]) {
          this.$options.components[componentKey] = loadComponent(field.field.component)
        } 
      })
    },
    build () {
      // Clears the fields
      this.fields = []
      // If the schema value is empty there is nothing todo
      if (lodash.isEmpty(this.schema)) return
      // Handle the schema and build the fields
      if (typeof this.schema === "string") {
        // We need to load the schema
        let loadSchema = this.$store.get('loadSchema')
        loadSchema(this.schema)
        .then(schema => {
          this.validator = this.ajv.getSchema(this.schema)
          if (!this.validator) {
            this.ajv.addSchema(schema, this.schema)
            this.validator = this.ajv.compile(schema)
          }
          this.buildFields(schema)
        })
      } else if (typeof this.schema === "object") {
        this.validator = this.ajv.compile(this.schema)
        this.buildFields(this.schema)
      } else {
        logger.warn("Invalid schema value")
      }
    },
    fill (values) {
      this.fields.forEach(field => {
        let value = lodash.get(values, field.name)
        if (value) {
          // Override the default value in order to use this value when reseting the form
          lodash.set(field, 'default', value)
          this.$refs[field.name][0].fill(value)
        } else {
          // The field has no value, then assign a default one
          this.$refs[field.name][0].reset()
        }
      })
      this.validate()
    },
    values () {
      let values = {}
      this.fields.forEach(field => {
        if (!this.$refs[field.name][0].isEmpty()) {
          values[field.name] = this.$refs[field.name][0].value()
        }
      })
      return values
    },
    clear () {
      this.fields.forEach(field => {
        this.$refs[field.name][0].clear()
      })
    },
    reset () {
      this.fields.forEach(field => {
        this.$refs[field.name][0].reset()
      })
      this.validate()
    },
    validate () {
      let result = { 
        isValid: false, 
        values: this.values() 
      }
      // If the validation fails, it iterates though the errors in order
      // to update the validation status of each field
      if (!this.validator(result.values)) {
        this.fields.forEach(field => {
          let error = this.hasFieldError(field.name)
          if (error) {
            this.$refs[field.name][0].invalidate(error.message)
          } else {
            this.$refs[field.name][0].validate()
          }
        })
        return result
      }
      this.fields.forEach(field => {
        this.$refs[field.name][0].validate()
      })
      result.isValid = true
      return result
    }
  },
  updated () {
    // Because the fields are dynamically loaded and we check whether 
    // the references are created before signaling the form is ready
    let missingField = false
    this.fields.forEach(field => {
      if (!this.$refs[field.name]) {
        missingField = true
        return
      }
    })
    if (! missingField) {
      this.$emit('form-ready')
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
