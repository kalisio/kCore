<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <k-item-chooser class="col" ref="search" :default-items="model" :services="properties.services" @item-selection-changed="updateModel" />
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField } from 'quasar'
import { KItemChooser } from '.'
import mixins from '../../mixins'

export default {
  name: 'k-item-field',
  components: {
    QField,
    KItemChooser
  },
  mixins: [mixins.baseField],
  methods: {
    defaultModel () {
      return []
    },
    fill (value) {
      this.model = value
    },
    updateModel (items) {
      // filter rendering properties only
      this.model = items.map(function (item) { return _.omit(item, ['value', 'label', 'icon']) })
      this.onChanged()
    }
  }
}
</script>
