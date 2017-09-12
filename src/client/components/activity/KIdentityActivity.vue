<template>
  <div v-if="operation === 'manage'">
    <k-nav-bar :tabs="navBarTabs()" :selected="perspective" />
    <k-editor service="users" :id="id" :perspective="perspective" />
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-identity-activity',
  mixins: [
    mixins.baseActivity,
  ],
  props: {
    operation: {
      type: String,
      required: true
    },
    id : {
      type: String,
      required: true
    },
    perspective: {
      type: String,
      default: 'profile'
    }
  },
  methods: {
    navBarTabs () {
      return [ 
        { name: 'profile', label: 'Profile', icon: 'description', route: { 
          name: 'identity-activity', params: { operation: 'manage', id: this.id } } 
        },
        { name: 'security', label: 'Security', icon: 'security', route: { 
          name: 'identity-activity', params: { operation: 'manage', id: this.id, perspective: 'security' } } 
        }
      ]
    }
  },
  created () {
    // Load the required components
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-editor'] = loadComponent('editor/KEditor')
    this.$options.components['k-nav-bar'] = loadComponent('layout/KNavBar')
  }
}
</script>