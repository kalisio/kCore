<template>
  <div v-if="id !== ''">
    <k-nav-bar :tabs="actions.tab" :selected="perspective" />
    <div v-if="perspective === 'profile'">
      <k-editor service="users" :id="id" perspective="profile"/>
    </div>
    <div v-if="perspective === 'security'">
      <k-account-security :id="id" />
    </div>
    <div v-else-if="perspective === 'danger-zone'">
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
    refreshActions () {
      this.clearActions()
      this.registerAction('tab', { name: 'profile', label: 'Profile', icon: 'description', route: { 
        name: 'account-activity', params: { perspective: 'profile' } } 
      })
      this.registerAction('tab', { name: 'security', label: 'Security', icon: 'security', route: { 
        name: 'account-activity', params: { perspective: 'security' } } 
      })
      this.registerAction('tab', { name: 'danger-zone', label: 'Danger Zone', icon: 'warning', route: { 
        name: 'account-activity', params: { perspective: 'danger-zone' } } 
      })
    },
    refreshAccount () {
      this.id = this.$store.get('user._id', '')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
    this.$options.components['k-nav-bar'] = this.$load('layout/KNavBar')
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