<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-datetime
      v-model="model"
      v-bind="properties.field"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QDatetime } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-datetime-field',
  components: {
    QField,
    QDatetime
  },
  mixins: [mixins.baseField]
}
</script>
