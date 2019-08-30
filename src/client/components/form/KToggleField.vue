<template>
  <q-field
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    no-error-icon
    bottom-slots
  >
    <q-toggle
      :id="properties.name + '-field'"
      v-model="model"
      v-bind="properties.field"
      @blur="onChanged" />

    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>

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
    },
    isEmpty () {
      // Can't actually be
      return false
    }
  }
}
</script>
