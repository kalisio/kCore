<template>
  <div>
    <k-block
      color="red"
      :title="$t('KAccountDZ.BLOCK_TITLE')"
      :text="$t('KAccountDZ.BLOCK_TEXT')"
      :action="$t('KAccountDZ.BLOCK_ACTION')"
      @action-triggered="onDeleteClicked" />
  </div>
</template>

<script>
import { Dialog } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-account-dz',
  mixins: [
    mixins.service
  ],
  props: {
    objectId: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  methods: {
    loadService () {
      this._service = this.$api.getService('users')
      return this._service
    },
    onDeleteClicked () {
      Dialog.create({
        title: this.$t('KAccountDZ.DIALOG_TITLE'),
        message: this.$t('KAccountDZ.DIALOG_HELPER'),
        html: true,
        prompt: {
          type: 'text',
          model: ''
        },
        persistent: true,
        ok: {
          label: this.$t('OK')
        },
        cancel: {
          label: this.$t('CANCEL')
        }
      }).onOk(async (data) => {
        if (data === this.name) {
          try {
            await this.loadService().remove(this.objectId)
          } catch (error) {
            // do not logout
            return
          }
          this.$router.push({ name: 'logout' })
        }
      })
    }
  },
  created () {
    // Load the components
    this.$options.components['k-block'] = this.$load('frame/KBlock')
  }
}
</script>
