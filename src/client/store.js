import _ from 'lodash'
import { Events } from 'quasar'

// Export singleton
let Store = {
  set (path, value) {
    _.set(this, path, value)
    let eventName = _.kebabCase(`${path}-changed`)
    Events.$emit(eventName, value)
  },
  get (path, defaultValue) {
    return _.get(this, path, defaultValue)
  },
  patch (path, value) {
    let previousValue = this.get(path)
    if (previousValue) {
      Object.assign(previousValue, value)
      let eventName = _.kebabCase(`${path}-patched`)
      Events.$emit(eventName, value)
    }
  },
  has (path) {
    return _.has(this, path)
  }
}

export { Store }
