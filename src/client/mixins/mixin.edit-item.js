let editItemMixin = {
  methods: {
    editItem (item) {
      if (this.context) {
        this.$router.push({ name: 'update', params: { context: this.context, service: this.service, id: item._id } })
      } else {
        this.$router.push({ name: 'update', params: { service: this.service, id: item.id } })
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
