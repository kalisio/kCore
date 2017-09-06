<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-chips-input 
      v-model="model" 
      @change="onChanged" />
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
  mixins: [mixins.baseField]
}
</script>
