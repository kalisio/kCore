<template>
  <div v-if="name !== ''" class="row items-center justify-center full-width sm-gutter">
    <k-block 
      class="col-10"
      color="red" 
      title="Delete your account ?"
      :text="blockText()"
      action="Delete"
      @action-triggered="onDeleteClicked" />
  </div>
</template>

<script>
import { Dialog } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-account-dz',
  mixins: [
    mixins.service,
    mixins.objectProxy
  ],
  data () {
    return {
      name: ''
    }
  },
  methods: {
    blockText () {
      return "Please note that deleting \'" + this.name + 
              "\' will delete any data attached to this account.<br>" +
              "The deletion cannot be undone and you will be logged out of the application."
    },
    loadService () {
      return this._service = this.$api.getService('users')
    },
    onDeleteClicked () {
      Dialog.create({
        title: 'Are you sure you want to delete \'' + this.name + '\' ?',
        form: {
          confirm: {
            type: 'text',
            model: '',
            label: 'Enter your account name to confirm the deletion'
          }
        },
        buttons: [
          {
            label: 'Ok',
            preventClose: true,
            handler: (data, close) => {
              if (data.confirm === this.name) {
                close(() => { 
                  this.loadService().remove(this.id)
                  .then(_ => {
                    this.$router.push({name: 'logout'})
                  })
                })
              }
            }
          },
          'Cancel'
        ]
      })
    }
  },
  created () {
    // Load the components
    this.$options.components['k-block'] = this.$load('frame/KBlock')
    // Update underlying object
    this.loadObject()
    .then(object => this.name = object.name)
  }
}
</script>