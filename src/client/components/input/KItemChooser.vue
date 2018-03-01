<template>
  <div class="row full-width justify-between items-center">
    <k-autocomplete v-if="!isCompleted" class="col" ref="autocomplete" :services="services" @changed="onAutocompleteChanged" />
    <div class="col-8" v-if="items.length > 0">
      <q-chip v-for="item in items" :key="item._id" class="chip" :icon="itemIcon(item)" color="primary" @close="onItemRemoved(item)" closable>
        {{itemName(item)}}
      </q-chip>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QChip, QIcon } from 'quasar'
import KAutocomplete from './KAutocomplete.vue'

export default {
  name: 'k-item-chooser',
  components: {
    QChip,
    QIcon,
    KAutocomplete
  },
  computed: {
    autocompleteSize () { 
      return this.itemslength > 0 ? 'col-5' : 'col-12'
    },
    isCompleted () {
      return this.multiselect ? false : (this.items.length > 0)
    }
  },
  props: {
    defaultItems: {
      type: Array,
      default: () => {
        return []
      }
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
  watch: {
    services: function () {
      this.clear()
    }
  },
  data () {
    return {
      items: this.defaultItems,
      pattern: ''
    }
  },
  methods: {
    clear () {
      this.items = []
      this.pattern = ''
      this.$refs.autocomplete.clear()
    },
    itemIcon (item) {
      if (item.icon && item.icon.name) return item.icon.name
      return item.icon
    },
    itemName (item) {
      if (item.value) return item.value
      return item.name
    },
    onItemRemoved (oldItem) {
      this.items = this.items.filter(item => item._id !== oldItem._id)
      this.$emit('changed', this.items, this.pattern)
    },
    onAutocompleteChanged (value) {
      if (typeof value === 'string') {
        // The input pattern has changed
        this.pattern = value
        this.$emit('changed', this.items, this.pattern)
      }
      else {
        // An item has been selected
        if(_.findIndex(this.items, item => item._id === value._id) === -1) {
          this.$refs.autocomplete.clear()
          this.pattern = ''
          this.items.push(value)
          this.$emit('changed', this.items, this.pattern)
        }
      }
    }
  }
}
</script>

<style>
.chip {
  margin: 4px;
}
</style>
