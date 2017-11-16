<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <div class="row justify-between">
      <k-autocomplete class="col" ref="search" :services="properties.services" @item-selected="onItemSelected" />
      <div class="row col-7" v-if="items.length > 0">
        <q-chip v-for="item in items" :key="item._id" icon="label" color="primary" @close="onItemRemoved(item)" closable>
          {{ item.value }}
        </q-chip>
      </div>
    </div>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QField, QChip, QIcon } from 'quasar'
import { KAutocomplete } from '../collection'
import mixins from '../../mixins'

export default {
  name: 'k-item-field',
  components: {
    QField,
    QChip,
    QIcon,
    KAutocomplete
  },
  mixins: [mixins.baseField],
  computed: {
    autocompleteSize () { 
      return this.items.length > 0 ? 'col-5' : 'col-12'
    }
  },
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
    onItemSelected (newItem) {
      if(_.findIndex(this.items, item => item._id === newItem._id) === -1) {
        this.items.push(newItem)
        this.updateModel()
      }
    },
    onItemRemoved (oldItem) {
      this.items = this.items.filter(item => item._id !== oldItem._id)
      this.updateModel() 
    },
    updateModel () {
      // filter rendering properties only
      this.model = this.items.map(function (item) { return _.omit(item, ['value', 'label', 'icon']) })
      this.onChanged()
    }
  }
}
</script>

<style>
.icon {
  cursor: pointer;
  font-size: 24px;
  color: rgba(0, 0, 0, .54);
}
</style>
