<template>
  <div v-if="name !== ''" class="row justify-center full-width">
    <div class="col-12">
      <k-block 
        color="red" 
        :title="$t('KAccountDZ.BLOCK_TITLE')"
        :text="$t('KAccountDZ.BLOCK_TEXT')"
        :action="$t('KAccountDZ.BLOCK_ACTION')"
        @action-triggered="onDeleteClicked" />
    </div>
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
    loadService () {
      return this._service = this.$api.getService('users')
    },
    onDeleteClicked () {
      Dialog.create({
        title: this.$i18n.i18next.t('KAccountDZ.DIALOG_TITLE'),
        form: {
          confirm: {
            type: 'text',
            model: '',
            label: this.$i18n.i18next.t('KAccountDZ.DIALOG_HELPER')
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