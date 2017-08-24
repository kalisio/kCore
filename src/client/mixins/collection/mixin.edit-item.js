import logger from 'loglevel'

let editItemMixin = {
  methods: {
    editItem (item) {
      let route = this.$store.get(`config.${this.service}.editItem`, '')
      if (route) {
        this.$store.set('selection', item)
        this.$router.push({ name: route })
      } else {
        logger.warn('[editItem] no route specified for the service ' + this.service)
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
