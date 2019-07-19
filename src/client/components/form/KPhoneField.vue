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
      type="tel"
      v-model="model"
      clearable
      @blur="onChanged"/>
    <a :href="'tel:'+model" v-else>{{model}}</a>
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
