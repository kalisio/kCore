<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <k-item-chooser class="col" ref="search" :items="items" :services="properties.services" @item-selection-changed="updateModel" />
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField } from 'quasar'
import { KAutocomplete } from '../collection'
import { KItemChooser } from '.'
import mixins from '../../mixins'

export default {
  name: 'k-item-field',
  components: {
    QField,
    KAutocomplete,
    KItemChooser
  },
  mixins: [mixins.baseField],
  data () {
    return {
      items: []
    }
  },
  methods: {
    defaultModel () {
      return []
    },
    fill (value) {
      this.model = value
      // Update items as well
      this.items = this.model.slice()
    },
    updateModel () {
      // filter rendering properties only
      this.model = this.items.map(function (item) { return _.omit(item, ['value', 'label', 'icon']) })
      this.onChanged()
    }
  }
}
</script>
