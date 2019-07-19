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
    <q-chips-input
      :id="properties.name + '-field'"
      v-model="model" 
      @change="onChanged"
      @blur="onChanged"
      :disable="readonly"/>
  </q-field>
</template>

<script>
import { QField, QChipsInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-chips-field',
  components: {
    QField,
    QChipsInput
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return []
    }
  }
}
</script>
