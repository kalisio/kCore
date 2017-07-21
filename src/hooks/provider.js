// A hook that extract user profile informations from OAuth providers
import { each } from 'feathers-commons'
import _ from 'lodash'

export function processUserProfile (provider, propertyMap) {
  return function (hook) {
    // As an example extract the user email
    if (hook.data.hasOwnProperty(provider)) {
      each(propertyMap, (value, key) => {
        _.set(hook.data, key, _.get(hook.data[provider], value))
      })
    }
  }
}
