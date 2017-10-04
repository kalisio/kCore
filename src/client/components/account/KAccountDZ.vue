<template>
  <div>
    <div v-if="name !== ''" class="row items-center justify-center full-width sm-gutter">
      <!-- 
        Page section
      -->
      <div class="col-10">
        <k-block
          color="red" 
          title="Delete your account ?"
          :text="`Please note that deleting \'${name}\' will delete any data attached to this account.<br>
                  The deletion cannot be undone and you will be logged out of the application`"
          action="Delete"
          @action-triggered="onDeletion" />
      </div>
    </div>
    <!-- 
      Confim section
     -->
     <k-confirm ref="confirm" 
      :title="`Are you sure you want to delete \'${name}\' ?`"
      action="Delete"
      :prevent="{ textToMatch: name, label: 'Please enter the name of this account to confim' }" 
      @confirmed="onDeletionConfirmed" />
  </div>
</template>

<script>
import { KBlock, KConfirm } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-account-dz',
  components: {
    KBlock,
    KConfirm
  },
  mixins: [
    mixins.objectProxy
  ],
  data () {
    return {
      name: ''
    }
  },
  methods: {
    getService () {
      return this.$api.getService('users')
    },
    onDeletion () {
      this.$refs.confirm.open()
    },
    onDeletionConfirmed () {
      // Close the modal
      this.$refs.confirm.close()
      // Delete tht user
      this.getService().remove(this.id)
      .then(_ => {
        this.$router.push({name: 'logout'})
      })
    }
  },
  created () {
    // Install an object-changed callback
    this.$on('object-changed', _ =>  {
      if (this.getObject()) {
        this.name = this.getObject().name
      } else {
        this.name = ''
      }
    })
  }
}
</script>