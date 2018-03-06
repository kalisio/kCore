<template>
  <q-field
    :icon="icon"
    :label="$t(label)"
    :helper="$t(helper)"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-toggle
      v-model="model" 
      v-bind="properties.field"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QToggle } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-toggle-field',
  components: {
    QField,
    QToggle
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return false
    }
  }
}
</script>
