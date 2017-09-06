let baseItemMixin = {
  props: {
    item: {
      type: Object,
      required: true
    },
    actions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    onActionTriggered (handler, item) {
      handler.call(this, item)
    }
  }
}

export default baseItemMixin
