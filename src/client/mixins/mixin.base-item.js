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
  methods: {
    onActionTriggered (action, item) {
      // If a handler is given call it
      if (action.handler) handler.call(this, item)
      // If a route is given activate it with item ID
      else if (action.route) {
        let route = _.merge({ params: { id: item._id } }, action.route)
        console.log(route)
        this.$router.push(route)
      }
    }
  }
}

export default baseItemMixin
