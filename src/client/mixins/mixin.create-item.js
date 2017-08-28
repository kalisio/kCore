import logger from 'loglevel'

let createItemMixin = {
  methods: {
    createItem () {
      if (this.context) {
        this.$router.push({ name: 'create', params: { context: this.context, service: this.service } })
      } else {
        this.$router.push({ name: 'create', params: { service: this.service } })
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
