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
      type="textarea"
      v-model="model"
      clearable
      :inverted="readonly"
      :readonly="readonly"
      :color="backgroundcolor"
      @blur="onChanged" />
    <p v-else>{{model}}</p>
  </q-field>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-textarea-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
