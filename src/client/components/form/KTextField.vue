<template>
  <q-input
    :id="properties.name + '-field'"
    type="text"
    v-model="model"
    clearable
    @blur="onChanged"
    :error="hasError"
    :error-message="errorLabel"
    no-error-icon
    bottom-slots
  >
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-text-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
