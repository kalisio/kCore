<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-input
      type="number"
      v-model="model"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-number-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
