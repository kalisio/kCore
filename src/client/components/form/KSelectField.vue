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
      :multiple="this.property.field.multiple ? this.property.field.multiple : false"
      :toggle="property.field.toggle ? property.field.toggle : false"
      :radio="property.field.radio ? property.field.radio : false"
      :chips="property.field.chips ? property.field.chips : false"
      v-model="model"
      :options="property.field.options"
      @change="onChanged"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import lodash from 'lodash'
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
    defaultModel () {
      let multiple = lodash.get(this.properties.field.multiple, false)
      if (multiple) return []
      return ''
    }
  }
}
</script>
