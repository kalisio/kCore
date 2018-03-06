<template>
  <div v-if="name !== ''" class="row justify-center full-width">
    <div class="col-12">
      <k-block 
        color="red" 
        :title="$t('KAccountDZ.TITLE')"
        :text="$t('KAccountDZ.TEXT')"
        :action="$t('KAccountDZ.ACTION')"
        @action-triggered="onDeleteClicked" />
    </div>
  </div>
</template>

<script>
import i18next from 'i18next'
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
                  .then(() => {
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