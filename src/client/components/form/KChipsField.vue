<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
    :disabled="disabled"
  >
    <q-select
      :id="properties.name + '-field'"
      v-model="model"
      @change="onChanged"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QSelect } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-chips-field',
  components: {
    QField,
    QSelect
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return []
    }
  }
}
</script>
