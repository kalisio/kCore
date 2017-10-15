<template>
  <div v-if="isAuthenticated">
    <k-layout />
  </div>
</template>

<script>
import { Events } from 'quasar'

export default {
  name: 'k-home',
  computed: {
    isAuthenticated () {
      return this.user !== null
    }
  },
  data () {
    return {
      user: null
    }
  },
  created () {
    // load the layout component
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-layout'] = loadComponent('layout/KLayout')
    // initialize the user
    this.user = this.$store.get('user')
  },
  mounted () {
    // let user = this.$store.get('user')
    // if (user) this.isAuthenticated = true
    Events.$on('user-changed', user => {
      this.user = user
    })
  }
}
</script>