<template>
  <div v-if="isAuthenticated">
    <k-layout />
  </div>
</template>

<script>
import _ from 'lodash'
import { Events } from 'quasar'

export default {
  name: 'k-home',
  data () {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    refresh () {
      this.isAuthenticated = !_.isNil(this.$store.get('user'))
    }
  },
  created () {
    // load the layout component
    this.$options.components['k-layout'] = this.$load(this.$config('home.layout', 'layout/KLayout'))
    // Initialize the user if any
    this.refresh()
    Events.$on('user-changed', this.refresh)
  },
  beforeDestroy () {
    Events.$off('user-changed', this.refresh)
  }
}
</script>