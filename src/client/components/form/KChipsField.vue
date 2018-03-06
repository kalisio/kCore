<template>
  <q-field
    :icon="icon"
    :label="$t(label)"
    :helper="$t(helper)"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-chips-input 
      v-model="model" 
      @change="onChanged"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import { QField, QChipsInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-chips-field',
  components: {
    QField,
    QChipsInput
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return []
    }
  }
}
</script>
