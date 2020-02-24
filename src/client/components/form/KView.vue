<template>
  <div class="column q-pa-md">
    <!-- Non-grouped fields first -->
    <div v-for="field in fields" :key="field.name" class="row items-center full-width">
      <div class="col-12 col-md-6 col-lg-5 col-xl-4">
        <span class="text-caption">{{ $t(field.field.label) }}</span>
      </div>
      <div class="col-12 col-md-6 col-lg-7 col-xl-8">
        <component
          v-if="!field.group"
          :key="field.name + '-value'"
          :is="field.componentKey"
          :ref="field.name"
          :properties="field"
          :display="display"
          :readOnly="true" />
      </div>
    </div>
    <!-- Grouped fields then -->
    <template v-for="group in groups">
      <q-expansion-item :key="group" icon="wrap_text" :group="group" :label="$t(group)">
        <q-card>
          <q-card-section>
            <template v-for="field in fields">
              <component
                v-if="field.group === group"
                :key="field.name"
                :is="field.componentKey"
                :ref="field.name"
                :properties="field"
                :display="display"
                :readOnly="true" />
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
import mixins from '../../mixins'

export default {
  name: 'k-view',
  mixins: [
    mixins.refsResolver()
  ],
  props: {
    schema: {
      type: Object,
      default: null
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
  watch: {
    schema: async function (schema) {
      if (this.schema) {
        logger.debug('Updating view', this.schema.$id)
        await this.build()
        this.$emit('view-ready', this)
      }
    }
  },
  methods: {
    getField (field) {
      return this.$refs[field][0]
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
      logger.debug('Building view', this.schema.$id)
      // Test in cache first
      return this.buildFields()
    },
    fill (values) {
      logger.debug('Filling form', this.schema.$id, values)
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
  async created () {
    logger.debug('Creating view', this.schema ? this.schema.$id : 'without schema')
    if (this.schema) {
      logger.debug('Initializing view', this.schema.$id)
      await this.build()
      this.$emit('view-ready', this)
    }
  }
}
</script>
