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
  <!-- TODO quasar v1: QDatetime is not supported anymore - split into QDate and QTime -->
    <q-datetime
      :id="properties.name + '-field'"
      v-model="model"
      v-bind="properties.field"
      @blur="onChanged" />
  </q-field>
</template>

<script>
// TODO quasar v1: QDatetime is not supported anymore - split into QDate and QTime
import { QField } from 'quasar'
//import { QField, QDatetime } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-datetime-field',
  components: {
    QField
    // TODO quasar v1: QDatetime is not supported anymore - split into QDate and QTime
    // QDatetime
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
