<template>
  <q-input :id="properties.name + '-field'" v-model="model"
    :icon="icon"
    :label="label"
    :error-message="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
    :disabled="disabled" @blur="onChanged"
    no-error-icon
    bottom-slots
  >
    <template v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="model" mask="YYYY-MM-DDTHH:mm:ss.SSSZ" v-bind="properties.field" />
        </q-popup-proxy>
      </q-icon>
      <q-icon name="access_time" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-time v-model="model" mask="YYYY-MM-DDTHH:mm:ss.SSSZ" v-bind="properties.field" />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-datetime-field',
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
