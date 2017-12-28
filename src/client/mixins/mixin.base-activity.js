import _ from 'lodash'
import { Events } from 'quasar'

let baseActivityMixin = {
  data () {
    return {
      actions: {}
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshActions()
    }
  },
  methods: {
    registerTabAction (action) {
      this.registerAction('tabBar', action)
      this.$store.patch('tabBar', { tabs: _.concat(this.$store.get('tabBar.tabs'), action) })
    },
    registerFabAction (action) {
      this.registerAction('fab', action)
      this.$store.patch('fab', { actions: _.concat(this.$store.get('fab.actions'), action) })
    },
    registerAction (type, action) {
      if (!this.actions[type]) this.actions[type] = []
      this.actions[type].push(action)
    },
    getActions (type) {
      return this.actions[type] || []
    },
    clearTabActions () {
      this.$store.patch('tabBar', { tabs: [] })
    },
    clearFabActions () {
      this.$store.patch('fab', { actions: [] })
    },
    clearActions () {
      this.clearTabActions()
      this.clearFabActions()
      this.actions = {}
    },
    // This method should be overriden in activities
    refreshActions () {
      this.clearActions()
    }
  },
  created () {
    // Register the actions
    this.refreshActions()
    // Whenever the user is updated, update abilities as well
    Events.$on('user-abilities-changed', this.refreshActions)
  },
  beforeDestroy () {
    Events.$off('user-abilities-changed', this.refreshActions)
  }
}

export default baseActivityMixin
