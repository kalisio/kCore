import { Dialog } from 'quasar'

let deleteItemMixin = {
  methods: {
    deleteItem (item) {
      Dialog.create({
        title: 'Warning',
        message: 'Are you sure you want to delete ' + item.name + '?',
        buttons: [
          'Cancel',
          {
            label: 'Delete',
            handler: () => {
              // delete the required item
              this.$api.getService(this.service).remove(item._id)
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.actions.push({
      label: 'Delete',
      icon: 'delete',
      scope: 'item',
      handler: 'deleteItem'
    })
  }
}

export default deleteItemMixin
