import _ from 'lodash'
import { Events } from 'quasar'

let baseItemMixin = {
  props: {
    contextId: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      actions: {
        pane: [],
        menu: []
      }
    }
  },
  methods: {
    registerPaneAction (action) {
      this.registerAction('pane', action)
    },
    registerMenuAction (action) {
      this.registerAction('menu', action)
    },
    registerAction (type, action) {
      if (!this.actions[type]) this.actions[type] = []
      this.actions[type].push(action)
    },
    getActions (type) {
      return this.actions[type] || []
    },
    getAction (name) {
      let action = null
      _.forOwn(this.actions, (value, key) => {
        let actionForType = value.find(action => action.name === name)
        if (actionForType) action = actionForType
      })
      return action
    },
    clearActions () {
      this.actions = {}
    },
    // This method should be overriden in items
    refreshActions () {
      this.clearActions()
    },
    isActionPermitted(action) {
      // Filter actions according to item-specific permissions when required
      if (action.permissions) {
        let { operation, service, context, id } = action.permissions
        // The operation might directly target the item object or its id when used as a linked object in a relation
        return this.$can(operation, service, context, id ? { [id]: this.item._id } : this.item)
      } else {
        return true
      }
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

export default baseItemMixin
