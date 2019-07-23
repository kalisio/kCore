<template>
  <q-select
    :id="properties.name + '-field'"
    :multiple="properties.field.multiple ? properties.field.multiple : false"
    :toggle="properties.field.toggle ? properties.field.toggle : false"
    :radio="properties.field.radio ? properties.field.radio : false"
    :chips="properties.field.chips ? properties.field.chips : false"
    v-model="model"
    :options="options"
    @change="onChanged"
    @blur="onChanged"
    emit-value
    map-options
    :label="label"
    :label-width="labelWidth"
    :error="hasError"
    :error-message="errorLabel"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <template v-if="icon" v-slot:append>
      <q-icon name="icon" />
    </template>

    <template v-if="helper" v-slot:hint>
      {{helper}}
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { QSelect } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-select-field',
  components: {
    QSelect
  },
  mixins: [mixins.baseField],
  computed: {
    options () {
      return this.properties.field.options.map(option => {
        // Check if we have a translation key or directly the label content
        const label = _.get(option, 'label', '')
        return Object.assign({}, option, { label: (this.$i18n.i18next.exists(label) ? this.$t(label) : label) })
      })
    }
  },
  methods: {
    emptyModel () {
      let multiple = _.get(this.properties, 'field.multiple', false)
      if (multiple) return []
      return (this.properties.type === 'object' ? {} : '')
    }
  }
}
</script>
