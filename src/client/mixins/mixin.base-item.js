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
    itemActions () {
      return this.actions.filter(action => {
        let { operation, service, context, id } = action.permissions
        // Filter actions according to permissions when required
        return action.permissions ?
          // The operation might directly target the item object or its id when used as a linked object in a relation
          this.$can(operation, service, context, id ? { [id]: this.item._id } : this.item) : true
      })
    },
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
  methods: {
    onActionTriggered (action, item) {
      // If a handler is given call it
      if (action.handler) action.handler.call(this, item)
      // If a route is given activate it with item ID
      else if (action.route) {
        let route = _.merge({ params: { id: item._id } }, action.route)
        this.$router.push(route)
      }
    }
  }
}

export default baseItemMixin
