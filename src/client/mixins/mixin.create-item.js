import logger from 'loglevel'

let createItemMixin = {
  methods: {
    createItem () {
      if (this.context) {
        this.$router.push({ name: 'collection', params: { context: this.context, service: this.service, action: 'create' } })
      } else {
        this.$router.push({ name: 'collection', params: { service: this.service, action: 'create' } })
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
