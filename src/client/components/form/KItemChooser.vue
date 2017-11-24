<template>
  <div class="row justify-between">
    <k-autocomplete v-if="!isCompleted" class="col" ref="search" :services="services" @item-selected="onItemSelected" />
    <div class="row col-7" v-if="items.length > 0">
      <q-chip v-for="item in items" :key="item._id" :icon="item.icon || 'label'" color="primary" @close="onItemRemoved(item)" closable>
        {{ item.value }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QChip, QIcon } from 'quasar'
import { KAutocomplete } from '../collection'

export default {
  name: 'k-item-chooser',
  components: {
    QChip,
    QIcon,
    KAutocomplete
  },
  computed: {
    autocompleteSize () { 
      return this.items.length > 0 ? 'col-5' : 'col-12'
    },
    isCompleted () {
      return this.multiselect ? false : (this.items.length > 0)
    }
  },
  props: {
    defaultItems: {
      type: Array,
      required: true
    },
    services: {
      type: Array,
      required: true
    },
    multiselect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      items: this.defaultItems
    }
  },
  methods: {
    onItemSelected (newItem) {
      if(_.findIndex(this.items, item => item._id === newItem._id) === -1) {
        this.items.push(newItem)
        this.$emit('item-selection-changed', this.items)
      }
    },
    onItemRemoved (oldItem) {
      this.items = this.items.filter(item => item._id !== oldItem._id)
      this.$emit('item-selection-changed', this.items)
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
