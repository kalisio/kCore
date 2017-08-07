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
  has (path) {
    return _.has(this, path)
  }
}

export { Store }
