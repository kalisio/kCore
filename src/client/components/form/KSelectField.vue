<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-select
      :multiple="properties.field.multiple ? properties.field.multiple : false"
      :toggle="properties.field.toggle ? properties.field.toggle : false"
      :radio="properties.field.radio ? properties.field.radio : false"
      :chips="properties.field.chips ? properties.field.chips : false"
      v-model="model"
      :options="properties.field.options"
      @change="onChanged"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField, QSelect } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-select-field',
  components: {
    QField,
    QSelect
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      let multiple = _.get(this.properties, 'field.multiple', false)
      if (multiple) return []
      return (this.properties.type === 'object' ? {} : '')
    }
  }
}
</script>
