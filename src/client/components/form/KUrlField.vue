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
      type="url"
      v-model="model"
      clearable
      @blur="onChanged"
      :inverted="readonly"
      :readonly="readonly"
      :color="backgroundcolor" />
    <a :href="'https://'+model" v-else target="_blank">{{model}}</a>
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
