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
      type="email"
      v-model="model"
      @change="onChanged" />
  </q-field>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-email-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.field]
}
</script>
