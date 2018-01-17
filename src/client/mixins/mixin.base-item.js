import _ from 'lodash'

let baseItemMixin = {
  props: {
    item: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    },
    actions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed: {
    name () {
      // Check for custom name field
      return (this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name)
    },
    description () {
      // Check for custom name field
      return (this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description)
    },
    tags () {
      // Check for custom name field
      return (this.options.tagsField ? _.get(this.item, this.options.tagsField, '') : this.item.tags)
    }
  },
  watch: {
    actions: () => {
      this.refreshActions()
    }
  },
  data () {
    return {
      permittedActions: []
    }
  },
  methods: {
    refreshActions () {
      this.permittedActions = this.actions.filter(action => {
        // Filter actions according to item-specific permissions when required
        if (action.permissions) {
          let { operation, service, context, id } = action.permissions
          // The operation might directly target the item object or its id when used as a linked object in a relation
          return this.$can(operation, service, context, id ? { [id]: this.item._id } : this.item)
        } else {
          return true
        }
      })
    },
    onActionTriggered (action, item) {
      // If a handler is given call it
      if (action.handler) action.handler.call(this, item)
      // If a route is given activate it with item ID
      else if (action.route) {
        let route = _.merge({ params: { id: item._id } }, action.route)
        this.$router.push(route)
      }
    },
    getAction (name) {
      return this.permittedActions.find(action => action.name === name)
    }
  },
  created () {
    this.refreshActions()
  }
}

export default baseItemMixin
