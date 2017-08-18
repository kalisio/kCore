<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :helper="helper"
      :error-label="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
    >
      <q-input
        type="password"
        v-model="model"
        @blur="touch" />
    </q-field>
  </div>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins/form'

export default {
  name: 'k-email-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
