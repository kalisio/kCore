import _ from 'lodash'
import { uid, Events } from 'quasar'

let baseActivityMixin = {
  data () {
    return {
      title: '',
      actions: {}
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshActivity()
    }
  },
  methods: {
    registerTabAction (action) {
      this.registerAction('tabBar', action)
      action.uid = uid()
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
    clearActions () {
      // Clear tabBar actions
      this.$store.patch('tabBar', { tabs: [] })
      // Clear Fab actions
      this.$store.patch('fab', { actions: [] })
      // Cleat the actions
      this.actions = {}
    },
    setTitle (title) {
      this.$store.patch('appBar', { subtitle: title })
    },
    clearTitle () {
      this.$store.patch('appBar', { subtitle: '' })
    },
    clearActivity () {
      this.clearTitle()
      this.clearActions()
    },
    // This method should be overriden in activities
    refreshActivity () {
      this.clearActivity()
    }
  },
  created () {
    // Register the actions
    this.refreshActivity()
    // Whenever the user is updated, update abilities as well
    Events.$on('user-abilities-changed', this.refreshActivity)
  },
  beforeDestroy () {
    Events.$off('user-abilities-changed', this.refreshActivity)
  }
}

export default baseActivityMixin
