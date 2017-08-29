let editItemMixin = {
  methods: {
    editItem (item) {
      if (this.context) {
        this.$router.push({ name: 'collection', params: { context: this.context, service: this.service, action: 'edit', id: item._id } })
      } else {
        this.$router.push({ name: 'collection', params: { service: this.service, action: 'edit', id: item.id } })
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
