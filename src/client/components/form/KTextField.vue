<template>
  <q-input
    :id="properties.name + '-field'"
    type="text"
    v-model="model"
    clearable
    @blur="onChanged"
    :icon="icon"
    :label="label"
    :label-width="labelWidth"
    :disabled="disabled"
    :hint="helper"
    :error="hasError"
    :error-message="errorLabel"
    no-error-icon
    bottom-slots
  />
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-text-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
