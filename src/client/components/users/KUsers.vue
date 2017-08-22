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
  dependencies: ['store'],
  data () {
    return {
      context: null
    }
  },
  mixins: [mixins.baseItemAction, mixins.createItem, mixins.deleteItem, mixins.editItem],
  created () {
    let Store = this.store()
    // Load the collection component
    let loadComponent = Store.get('loadComponent')
    this.$options.components['k-collection'] = loadComponent('collection/KCollection')
    // Setups the collection
    this.service = 'users'
    this.context = Store.get('organisation', null)
  }
}
</script>