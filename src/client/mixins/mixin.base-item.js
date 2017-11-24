let baseItemMixin = {
  props: {
    item: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: {}
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
