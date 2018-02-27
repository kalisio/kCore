<template>
  <div v-if="id !== ''" class="row justify-center full-width">
    <div v-if="perspective === 'profile'" class="col-11">
      <k-editor service="users" :id="id" perspective="profile"/>
    </div>
    <div v-if="perspective === 'security'"  class="col-11">
      <k-account-security :id="id" />
    </div>
    <div v-else-if="perspective === 'danger-zone'" class="col-11">
      <k-account-dz :id="id" />
    </div>
    <div v-else>
      <!-- Error -->  
    </div>
  </div>
</template>

<script>
import mixins from '../../mixins'
import { Events } from 'quasar'

export default {
  name: 'k-account-activity',
  mixins: [
    mixins.baseActivity,
  ],
  props: {
    perspective: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      id: ''
    }
  },
  methods: {
    onAvatarUploaded(file, response) {
      //this.$api.getService('users').patch({ avatar: this.id })
    },
    refreshActivity () {
      this.clearActivity()
      this.setTitle(this.$store.get('user.name'))
      this.registerTabAction({ 
        name: 'profile', label: 'Profile', icon: 'description', 
        route: { name: 'account-activity', params: { perspective: 'profile' } },
        default: this.perspective === 'profile'
      })
      this.registerTabAction({ 
        name: 'security', label: 'Security', icon: 'security',
        route: { name: 'account-activity', params: { perspective: 'security' } },
        default: this.perspective === 'security'
      })
      this.registerTabAction({ 
        name: 'danger-zone', label: 'Danger Zone', icon: 'warning',
        route: { name: 'account-activity', params: { perspective: 'danger-zone' } },
        default: this.perspective === 'danger-zone'
      })
    },
    refreshAccount () {
      this.id = this.$store.get('user._id', '')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
    this.$options.components['k-account-security'] = this.$load('account/KAccountSecurity')
    this.$options.components['k-account-dz'] = this.$load('account/KAccountDZ')
    // Refresh this component
    this.refreshAccount()
    Events.$on('user-changed', this.refreshAccount)
  },
  beforeDestroy() {
    Events.$off('user-changed', this.refreshAccount)
  }
}
</script>