<template>
  <div v-if="isVisible" class="row full-width">
    <k-item-chooser 
      :multiselect="true" 
      :services="searchBar.services" 
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
  computed: {
    isVisible () {
      return this.searchBar.field !== ''
    }
  },
  data () {
    return {
      searchBar: this.$store.get('searchBar')
    }
  },
  methods: {
    onItemsChanged (items, pattern) {
       this.$store.patch('searchBar', { pattern: pattern, items: items })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-item-chooser'] = this.$load('input/KItemChooser')
  }
}
</script>
