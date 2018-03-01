<template>
  <div v-if="isVisible" class="row full-width">
    <k-item-chooser 
      :multiselect="true" 
      :services="search.services" 
      @changed="onItemsChanged" />
  </div>
</template>

<script>
import { QBtn, QIcon } from 'quasar'

export default {
  name: 'k-search-bar',
  components: {
    QBtn,
    QIcon
  },
  props: {
    debounce: {
      type: Number,
      default: 50
    }
  },
  computed: {
    isVisible () {
      return this.search.field !== ''
    }
  },
  data () {
    return {
      search: this.$store.get('search')
    }
  },
  methods: {
    onItemsChanged (items, pattern) {
       this.$store.patch('search', { pattern: pattern, items: items })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-item-chooser'] = this.$load('input/KItemChooser')
  }
}
</script>
