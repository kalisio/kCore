<template>
  <div class="column q-gutter-sm">
    <!-- Non-grouped fields first -->
    <template v-for="field in fields">
      <slot :name="'before-' + field.name"/>
      <slot :name="field.name">
        <component
          v-if="!field.group"
          :key="field.name"
          :is="field.componentKey"
          :ref="field.name"
          :required="field.required"
          :properties="field"
          :display="display"
          @field-changed="onFieldChanged"
        />
      </slot>
      <slot :name="'after-' + field.name"/>
    </template>
    <!-- Grouped fields then -->
    <template v-for="group in groups">
      <q-expansion-item :key="group" icon="wrap_text" :group="group" :label="$t(group)">
        <q-card>
          <q-card-section>
            <template v-for="field in fields">
              <slot v-if="field.group === group" :name="'before-' + field.name"/>
              <slot v-if="field.group === group" :name="field.name">
                <component
                  :key="field.name"
                  :is="field.componentKey"
                  :ref="field.name"
                  :required="field.required"
                  :properties="field"
                  :display="display"
                  @field-changed="onFieldChanged" />
              </slot>
              <slot v-if="field.group === group" :name="'after-' + field.name"/>
            </template>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import Ajv from 'ajv'
import AjvLocalize from 'ajv-i18n'
import mixins from '../../mixins'
import { getLocale } from '../../utils'

// Create the AJV instance
const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  $data: true
})
// Backward compatibility for our old schemas as now AJV supports draft-07 by default
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'))

export default {
  name: 'k-form',
  mixins: [
    mixins.refsResolver()
  ],
  props: {
    schema: {
      type: Object,
      default: null
    },
    clearOnCreate: {
      type: Boolean,
      default: true
    },
    display: {
      type: Object,
      default: () => {
        return {
          icon: false,
          label: false,
          labelWidth: 3
        }
      }
    }
  },
  data () {
    return {
      fields: [],
      groups: []
    }
  },
  methods: {
    getField (field) {
      return this.$refs[field][0]
    },
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
      // Checks whether the form is valid
      if (!this.validator(this.values())) {
        const locale = getLocale()
        if (AjvLocalize[locale]) {
          AjvLocalize[locale](this.validator.errors)
        }
        // Checks whether the touched field has an error
        const error = this.hasFieldError(field)
        if (error) {
          // Invalidate the field
          this.getField(field).invalidate(error.message)
          return
        }
      }
      // Validate the field
      this.getField(field).validate()
    },
    hasFieldError (field) {
      for (let i = 0; i < this.validator.errors.length; i++) {
        const error = this.validator.errors[i]
        // Check whether the field is required
        if (error.keyword === 'required') {
          if (error.params.missingProperty === field) return error
        } else {
          // Check whether is the field in invalid
          const fieldDataPath = '.' + field
          if (error.dataPath === fieldDataPath) return error
        }
      }
      return null
    },
    buildFields  () {
      // Clear the fields states
      this.fields = []
      this.groups = []
      this.nbExpectedFields = Object.keys(this.schema.properties).length
      this.nbReadyFields = 0
      // Build the fields
      // 1- assign a name corresponding to the key to enable a binding between properties and fields
      // 2- assign a component key corresponding to the component path
      // 3- load the component if not previously loaded
      Object.keys(this.schema.properties).forEach(property => {
        const field = this.schema.properties[property]
        // 1- assign a name corresponding to the key to enable a binding between properties and fields
        field.name = property
        // 2- assign a component key corresponding to the component path
        const componentKey = _.kebabCase(field.field.component)
        field.componentKey = componentKey
        // Adds the field to the list of fields to be rendered
        this.fields.push(field)
        if (field.group && !this.groups.includes(field.group)) this.groups.push(field.group)
        // 3- load the component if not previously loaded
        if (!this.$options.components[componentKey]) {
          this.$options.components[componentKey] = this.$load(field.field.component)
        }
        // 4- Assign whether the field is required or not
        field.required = _.includes(this.schema.required, property)
      })
      // Set the refs to be resolved
      this.setRefs(this.fields.map(field => field.name))
      return this.loadRefs()
    },
    async build () {
      // Since schema is injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      if (!this.schema) throw Error('Cannot build the form without schema')
      logger.debug('Building form', this.schema.$id)
      // Test in cache first
      this.validator = this.ajv.getSchema(this.schema.$id)
      if (!this.validator) {
        // Otherwise add it
        this.ajv.addSchema(this.schema, this.schema.$id)
        this.validator = this.ajv.compile(this.schema)
      }
      return this.buildFields()
    },
    fill (values) {
      logger.debug('Filling form', this.schema.$id, values)
      if (!this.loadRefs().isFulfilled()) throw Error('Cannot fill the form while not ready')
      this.fields.forEach(field => {
        if (_.has(values, field.name)) {
          this.getField(field.name).fill(_.get(values, field.name), values)
        } else {
          // The field has no value, then assign a default one
          this.getField(field.name).clear()
        }
      })
    },
    values () {
      const values = {}
      _.forEach(this.fields, field => {
        if (!this.getField(field.name).isEmpty()) {
          Object.assign(values, { [field.name]: this.getField(field.name).value() })
        }
      })
      return values
    },
    clear () {
      logger.debug('Clearing form', this.schema.$id)
      if (!this.loadRefs().isFulfilled()) throw Error('Cannot clear the form while not ready')
      this.fields.forEach(field => this.getField(field.name).clear())
    },
    validate () {
      if (!this.loadRefs().isFulfilled()) throw Error('Cannot validate the form while not ready')
      logger.debug('Validating form', this.schema.$id)
      const result = {
        isValid: false,
        values: this.values()
      }
      // If the validation fails, it iterates though the errors in order
      // to update the validation status of each field
      if (!this.validator(result.values)) {
        const locale = getLocale()
        if (AjvLocalize[locale]) {
          AjvLocalize[locale](this.validator.errors)
        }
        this.fields.forEach(field => {
          const error = this.hasFieldError(field.name)
          if (error) {
            this.getField(field.name).invalidate(error.message)
          } else {
            this.getField(field.name).validate()
          }
        })
        return result
      }
      this.fields.forEach(field => {
        this.getField(field.name).validate()
      })
      result.isValid = true
      return result
    },
    async apply (object) {
      if (!this.loadRefs().isFulfilled()) throw Error('Cannot apply the form while not ready')
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        await this.getField(field.name).apply(object, field.name)
      }
    },
    async submitted (object) {
      if (!this.loadRefs().isFulfilled()) throw Error('Cannot run submitted on the form while not ready')
      for (let i = 0; i < this.fields.length; i++) {
        const field = this.fields[i]
        await this.getField(field.name).submitted(object, field.name)
      }
    }
  },
  async created () {
    // Store the AJV instance
    this.ajv = ajv
    // If a schema is already registered automatially build the form
    // otherwise the parent component would have to manually
    // FIXME: cannot know when the form is built => should be done by the parent or need to emit an event
    logger.debug('Creating form', this.schema ? this.schema.$id : 'without schema')
    if (this.schema) {
      logger.debug('Initializing form', this.schema.$id)
      await this.build()
      if (this.clearOnCreate) this.clear()
      this.$emit('form-ready', this)
    }
  }
}
</script>
