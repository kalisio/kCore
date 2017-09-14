import { Dialog } from 'quasar'

let userActionsMixin = {
  methods: {
    editUser (user) {
      this.$router.push({ 
        name: 'users-activity', 
        params: { context: this.context, operation: 'manage', id: user._id, perspective: 'profile' } 
      })
    },
    addMember () {
      Dialog.create({
        title: 'Add Members',
        message: 'Select the users you want to add:',
        buttons: [
          'Cancel',
          {
            label: 'Add',
            handler: () => {
              // delete the required item
              console.log('TODO')
            }
          }
        ]
      })
    },
    removeMember (user) {
      Dialog.create({
        title: 'Warning',
        message: 'Are you sure you want to remove ' + user.name + '?',
        buttons: [
          'Cancel',
          {
            label: 'Remove',
            handler: () => {
              // delete the required item
              console.log('TODO')
            }
          }
        ]
      })
    }
  },
  created () {
    this.registerAction('editUser', { label: 'Edit', icon: 'description' })
    this.registerAction('addMember', { label: 'Add', icon: 'add' })
    this.registerAction('removeMember', { label: 'Remove', icon: 'delete' })
  }
}

export default userActionsMixin
