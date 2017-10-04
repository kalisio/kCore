<template>
  <div v-if="id !== ''">
    <k-nav-bar :tabs="navBarTabs()" :selected="perspective" />
    <div v-if="perspective === 'security'">
      <k-account-security :id="id" />
    </div>
    <div v-else-if="perspective === 'danger-zone'">
      <k-account-dz :id="id" />
    </div>
    <div v-else>
      <k-editor service="users" :id="id" :perspective="perspective"/>
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
    navBarTabs () {
      return [ 
        { name: 'profile', label: 'Profile', icon: 'description', route: { 
          name: 'account-activity', params: { perspective: 'profile' } } 
        },
        { name: 'security', label: 'Security', icon: 'security', route: { 
          name: 'account-activity', params: { perspective: 'security' } } 
        },
        { name: 'danger-zone', label: 'Danger Zone', icon: 'warning', route: { 
          name: 'account-activity', params: { perspective: 'danger-zone' } } 
        }
      ]
    },
    refresh () {
      this.id = this.$store.get('user._id', '')
    }
  },
  created () {
    // Load the required components
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-editor'] = loadComponent('editor/KEditor')
    this.$options.components['k-nav-bar'] = loadComponent('layout/KNavBar')
    this.$options.components['k-account-security'] = loadComponent('account/KAccountSecurity')
    this.$options.components['k-account-dz'] = loadComponent('account/KAccountDZ')
    // Refresh this component
    this.refresh()
  },
  mounted () {
    Events.$on('user-changed', user => {
      this.refresh ()
    })
  }
}
</script>