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
    <q-input
      :id="properties.name + '-field'"
      type="url"
      v-model="model"
      clearable=true
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-url-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
