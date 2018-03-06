<template>
  <q-field
    :icon="icon"
    :label="$t(label)"
    :helper="$t(helper)"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-option-group
      :type="properties.field.type"
      v-model="model"
      :options="properties.field.options"
      @change="onChanged"
      @blur="onChanged" />
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField, QOptionGroup } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-options-field',
  components: {
    QField,
    QOptionGroup
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      let type = _.get(this.properties.field.type, 'radio')
      if (type === 'radio') return ''
      return []
    }
  }
}
</script>
