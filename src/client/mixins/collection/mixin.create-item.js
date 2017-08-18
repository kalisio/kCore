import logger from 'loglevel'

let createItemMixin = {
  dependencies: ['store'],
  methods: {
    createItem () {
      let formRoute = this.store().get(`config.${this.service}.form`, '')
      if (formRoute) {
        this.$router.push({ name: formRoute, params: { service: this.service } })
      } else {
        logger.warn('createItemMixin:editItem: no route specified for the service ' + this.service)
      }
    }
  },
  mounted () {
    this.actions.push({
      icon: 'add',
      scope: '',
      handler: 'createItem'
    })
  }
}

export default createItemMixin
