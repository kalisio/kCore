<template>
  <div>
    <!-- 
      Page section
    -->
    <div v-if="name !== ''" class="row items-center justify-center full-width">
      <k-block class="col-10"
        color="red" 
        title="Delete your account ?"
        :text="`Please note that deleting \'${name}\' will delete any data attached to this account.<br>
                The deletion cannot be undone and you will be logged out of the application`"
        action="Delete"
        @action-triggered="deletionClicked" />
    </div>
    <!-- 
      Confim section
     -->
     <k-confirm ref="confirm" 
      :title="`Are you sure you want to delete \'${name}\' ?`"
      action="Delete"
      :prevent="{ capture: name, label: 'Please enter the name of this account to confim' }" 
      @confirmed="deletionConfirmed" />
  </div>
</template>

<script>
import { KBlock, KConfirm } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-identity-dz',
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
    deletionClicked () {
      this.$refs.confirm.open()
    },
    deletionConfirmed () {
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