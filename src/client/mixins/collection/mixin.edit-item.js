import logger from 'loglevel'

let editItemMixin = {
  dependencies: ['store'],
  methods: {
    editItem (item) {
      let formRoute = Store.get(`config.${this.service}.form`, '')
      if (formRoute) {
        this.$router.push({ name: formRoute, params: { id: item._id } })
      } else {
        logger.warn('editItemMixin:editItem: no route specified for the service ' + this.service)
      }
    }
  },
  mounted () {
    this.actions.push({
      label: 'Edit',
      icon: 'create',
      scope: 'item',
      handler: 'editItem'
    })
  }
}

export default editItemMixin
