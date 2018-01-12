<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-toggle
      v-model="model" 
      @blur="onChanged" />
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
