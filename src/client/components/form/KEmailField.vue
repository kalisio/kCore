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
  <a :href="'mailto:'+model+'?subject=Kalisio'">
    <q-input
      :id="properties.name + '-field'"
      type="email"
      v-model="model"
      clearable
      @blur="onChanged"
      :inverted="readonly"
      :readonly="readonly"
      :color="backgroundcolor" />
  </a>
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
  mixins: [mixins.baseField]
}
</script>
