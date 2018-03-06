<template>
  <q-field
    :icon="icon"
    :label="$t(label)"
    :helper="$t(helper)"
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
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      let now = Date.now()
      // ADD given offset in seconds if any
      if (this.properties.field.defaultOffset) {
        now += this.properties.field.defaultOffset * 1000
      }
      return new Date(now).toISOString()
    },
    updateModel (date) {
      // Convert from date object to string
      this.model = date.toISOString()
      this.onChanged()
    }
  }
}
</script>
