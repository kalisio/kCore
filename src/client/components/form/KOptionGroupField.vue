<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-option-group
      :type="property.field.type"
      v-model="model"
      :options="property.field.options"
      @change="onChanged" />
  </q-field>
</template>

<script>
import { QField, QOptionGroup } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-option-group-field',
  components: {
    QField,
    QOptionGroup
  },
  mixins: [mixins.baseField]
}
</script>
