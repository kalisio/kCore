let baseActivityMixin = {
  data () {
    return {
      actions: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshActions()
    }
  },
  methods: {
    registerAction (type, action) {
      if (!this.actions[type]) this.actions[type] = []
      this.actions[type].push(action)
    },
    getActions (type) {
      return this.actions[type] || []
    },
    clearActions () {
      this.actions = {}
    },
    //This method should be overriden in activities
    refreshActions () {
      this.clearActions()
    }
  }
}

export default baseActivityMixin
