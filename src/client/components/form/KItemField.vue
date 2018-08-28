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
      if (this.properties.multiselect) return []
      return null
    },
    fill (value) {
      this.model = value
      if (this.properties.multiselect) {
        this.defaultItems = _.clone(value)
      } else if (_.isNil(value)) this.defaultItems = []
      else this.defaultItems = [_.clone(value)]
    },
    updateModel (items) {
      // filter rendering properties only if not used as data model properties
      const renderingProperties = ['value', 'label', 'icon']
      let filteredItems = items.map(function (item) {
        let filteredProperties = []
        renderingProperties.forEach(property => {
          if (!_.has(item, property)) filteredProperties.push(property)
        })
        return _.omit(item, filteredProperties)
      })
      if (this.properties.multiselect) this.model = filteredItems
      else this.model = filteredItems.length > 0 ? filteredItems[0] : null
      this.onChanged()
    }
  }
}
</script>
