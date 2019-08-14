<template>
  <q-input
    :id="properties.name + '-field'"
    type="url"
    v-model="model"
    clearable
    @blur="onChanged"
    :disabled="disabled"
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
  name: 'k-url-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
