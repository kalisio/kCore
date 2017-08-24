<template>
  <k-collection 
  :service="service"
  :context="context"
  :actions="actions" 
  @actionRequested="onActionRequested" />
</template>

<script>
import mixins from '../../mixins/collection'

export default {
  name: 'k-users',
  data () {
    return {
      context: null
    }
  },
  mixins: [mixins.baseItemAction, mixins.createItem, mixins.deleteItem, mixins.editItem],
  created () {
    // Load the collection component
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-collection'] = loadComponent('collection/KCollection')
    // Setups the collection
    this.service = 'users'
    this.context = this.$store.get('organisation')._id
  }
}
</script>