<template>
  <div class="column">
    <!-- Non-grouped fields first -->  
    <template v-for="field in fields">
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
    </template>
    <!-- Grouped fields then -->  
    <template v-for="group in groups">
      <q-collapsible icon="wrap_text" :group="group" :label="$t(group)">
        <template v-for="field in fields">
          <component
            v-if="field.group === group"
            :key="field.name"
            :is="field.componentKey"
            :ref="field.name"
            :required="field.required"
            :properties="field"
            :display="display"
            @field-changed="onFieldChanged"
          />
        </template>
      </q-collapsible>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { QCollapsible } from 'quasar'
import Ajv from 'ajv'
import AjvLocalize from 'ajv-i18n'
import mixins from '../../mixins'
import { getLocale } from '../../utils'
import KTextViewField from '../view/KTextViewField.vue';

export default {
  name: 'k-view',
  mixins: [
    mixins.refsResolver()
  ],
  components: {
    QCollapsible
  },
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
          icon: true,
          label: true,
          labelWidth: 3,
          readonly: true
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
      // Validate the field
      this.getField(field).validate()
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
        let field = this.schema.properties[property]
        // 1- assign a name corresponding to the key to enable a binding between properties and fields
        field['name'] = property
        // 2- assign a component key corresponding to the component path
        let componentKey = _.kebabCase(field.field.component)
        field['componentKey'] = componentKey
        // Adds the field to the list of fields to be rendered
        this.fields.push(field)
        if (field.group && !this.groups.includes(field.group)) this.groups.push(field.group)
        // 3- load the component if not previously loaded
        if (!this.$options.components[componentKey]) {
          this.$options.components[componentKey] = this.$load(field.field.component)
        }
        // 4- Assign whether the field is required or not
        field['required'] = _.includes(this.schema.required, property)
      })
      // Set the refs to be resolved
      this.setRefs(this.fields.map(field => field.name))
      return this.loadRefs()
    },
    async build () {
      // Since schema is injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      if (!this.schema) throw Error('Cannot build the view without schema')
      logger.debug('Building view', this.schema.$id)
      return this.buildFields()
    },
    fill (values) {
      logger.debug('Filling view', this.schema.$id, values)
      if (!this.loadRefs().isFulfilled()) throw Error('Cannot fill the view while not ready')
      this.fields.forEach(field => {
        if (_.has(values, field.name)) {
          this.getField(field.name).fill(_.get(values, field.name), values)
        } else {
          // The field has no value, then assign a default one
          this.getField(field.name).clear()
        }
      })
    }
  },
  created () {
    // If a schema is already registered automatially build the form
    // otherwise the parent component would have to manually
    // FIXME: cannot know when the form is built => should be done by the parent or need to emit an event
    logger.debug('Creating view', this.schema ? this.schema.$id : 'without schema')
    if (this.schema) {
      logger.debug('Initializing view', this.schema.$id)
      this.build()
      .then(() => {
        if (this.clearOnCreate) this.clear()
        this.$emit('view-ready', this)
      })
    }
  }
}
</script>
