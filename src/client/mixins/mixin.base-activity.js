let baseActivityMixin = {
  methods: {
    registerAction (handler, decoration) {
      if (!this.actions) this.actions = new Map()
      decoration['handler'] = this[handler].bind(this)
      this.actions.set(handler, decoration)
    },
    filterActions (keys) {
      let result = []
      if (this.actions) {
        keys.forEach(key => {
          let action = this.actions.get(key)
          if (action) result.push(action)
        })
      }
      return result
    }
  }
}

export default baseActivityMixin
