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
    <k-item-chooser
      :id="properties.name + '-field'"
      :multiselect="properties.multiselect" 
      :default-items="defaultItems" 
      :services="properties.services" 
      @changed="updateModel" />
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField } from 'quasar'
import { KItemChooser } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-item-field',
  components: {
    QField,
    KItemChooser
  },
  mixins: [mixins.baseField],
  data () {
    return {
      defaultItems: []
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    fill (value) {
      this.model = value
      this.defaultItems = _.clone(value)
    },
    updateModel (items) {
      // filter rendering properties only if not used as data model properties
      const renderingProperties = ['value', 'label', 'icon']
      this.model = items.map(function (item) {
        let filteredProperties = []
        renderingProperties.forEach(property => {
          if (!_.has(item, property)) filteredProperties.push(property)
        })
        return _.omit(item, filteredProperties)
      })
      this.onChanged()
    }
  }
}
</script>
