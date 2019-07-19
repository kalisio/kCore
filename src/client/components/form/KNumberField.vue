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
      v-if="!readonly"
      :id="properties.name + '-field'"
      type="number"
      v-model="model"
      clearable
      @blur="onChanged"
      :inverted="readonly"
      :readonly="readonly"
      :color="backgroundcolor" />
    <p v-else>{{model}}</p>
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
