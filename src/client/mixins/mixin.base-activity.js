import _ from 'lodash'
import { uid, Events } from 'quasar'

let baseActivityMixin = {
  data () {
    return {
      title: '',
      actions: {},
      searchQuery: {}
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      // However we don't have to for child routes (forward and back) as the parent remains the same
      if (!to.path.startsWith(from.path) && !from.path.startsWith(to.path)) {
        this.refreshActivity()
      }
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
    getAction (name, type) {
      let action = null
      _.forOwn(this.actions, (value, key) => {
        if (type && key !== type) return
        let actionForType = value.find(action => action.name === name)
        if (actionForType) action = actionForType
      })
      return action
    },
    clearActions () {
      // Clear tabBar actions
      this.$store.patch('tabBar', { tabs: [] })
      // Clear Fab actions
      this.$store.patch('fab', { actions: [] })
      // Clear the actions
      this.actions = {}
    },
    setTitle (title) {
      this.$store.patch('appBar', { title: title })
    },
    clearTitle () {
      this.$store.patch('appBar', { title: '' })
    },
    setSearchBar (field, services = []) {
      for (let i = 0; i < services.length; i++) services[i].limit = 1
      this.$store.patch('searchBar', { field: field, services: services })
    },
    clearSearchBar () {
      this.$store.patch('searchBar', { field: '', services: [] })
    },
    clearActivity () {
      this.clearTitle()
      this.clearSearchBar()
      this.clearActions()
    },
    refreshActivity () {
      // This method should be overriden in activities
      this.clearActivity()
    },
    handleSearch () {
      const search = this.$store.get('searchBar')
      let query = {}
      // Handle the pattern
      if (search.pattern !== '') {
        query[search.field] = { $search: search.pattern }
      }
      // Handle the selection
      search.items.forEach(item => {
        // We must have only one item per service
        let queryPath = item.service + '.' + item.field
        query[queryPath] = item[item.field]
      })
      this.searchQuery = Object.assign({}, query)
    }
  },
  created () {
    // Register the actions
    this.refreshActivity()
    // Whenever the user is updated, update abilities as well
    Events.$on('user-abilities-changed', this.refreshActivity)
    Events.$on('search-bar-changed', this.handleSearch)
  },
  beforeDestroy () {
    Events.$off('user-abilities-changed', this.refreshActivity)
    Events.$off('search-bar-changed', this.handleSearch)
  }
}

export default baseActivityMixin
