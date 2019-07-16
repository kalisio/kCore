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
    <q-toggle
      :id="properties.name + '-field'"
      v-model="model" 
      v-bind="properties.field"
      @blur="onChanged"
      :disable="readonly"
      :readonly="readonly"
      :color="backgroundcolor" />
  </q-field>
</template>

<script>
import { QField, QToggle } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-toggle-field',
  components: {
    QField,
    QToggle
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return false
    }
  }
}
</script>
