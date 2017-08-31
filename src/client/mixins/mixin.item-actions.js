import { Dialog } from 'quasar'

let itemActionsMixin = {
  methods: {
    createItem () {
      if (this.context) {
        this.$router.push({ name: 'switch', params: { context: this.context, service: this.service, action: 'create' } })
      } else {
        this.$router.push({ name: 'switch', params: { service: this.service, action: 'create' } })
      }
    },
    editItem (item) {
      if (this.context) {
        this.$router.push({ name: 'switch', params: { context: this.context, service: this.service, action: 'edit', id: item._id } })
      } else {
        this.$router.push({ name: 'switch', params: { service: this.service, action: 'edit', id: item.id } })
      }
    },
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
              this.serviceRemove(item._id)
            }
          }
        ]
      })
    }
  }
}

export default itemActionsMixin
