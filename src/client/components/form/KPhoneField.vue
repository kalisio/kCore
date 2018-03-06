<template>
  <q-field
    :icon="icon"
    :label="$t(label)"
    :helper="$t(helper)"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-input
      type="tel"
      v-model="model"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-phone-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
