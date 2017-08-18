<template>
  <k-collection 
  :service="'users'"
  :context="context"
  :actions="actions" 
  @actionRequested="onActionRequested" />
</template>

<script>
import { KCollection } from '../collection'
import mixins from '../../mixins/collection'

export default {
  name: 'k-users',
  components: {
    KCollection
  },
  dependencies: ['store'],
  data () {
    return {
      context: null
    }
  },
  mixins: [mixins.baseItemAction, mixins.createItem, mixins.deleteItem, mixins.editItem],
  created () {
    let Store = this.store()
    this.context = Store.get(Store.get('config.users.context'), null)
  }
}
</script>