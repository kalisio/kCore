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
      type="email"
      v-model="model"
      clearable
      @blur="onChanged"
      :inverted="readonly"
      :readonly="readonly"
      :color="backgroundcolor" />
    <a :href="'mailto:'+model+'?subject=Kalisio'" v-else>{{model}}</a>      
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
