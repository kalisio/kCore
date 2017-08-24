import logger from 'loglevel'

let createItemMixin = {
  methods: {
    createItem () {
      let route = this.$store.get(`config.${this.service.path}.createItem`, '')
      if (route) {
        this.$router.push({ name: route })
      } else {
        logger.warn('[createItem] no route specified for the service ' + this.service)
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
