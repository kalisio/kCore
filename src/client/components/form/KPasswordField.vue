<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :helper="helper"
      :error-label="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
    >
      <q-input
        :id="properties.name + '-field'"
        type="password"
        v-model="model"
        clearable
        @blur="onChanged" />
    </q-field>
  </div>
</template>

<script>
import { QField, QInput } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-password-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
