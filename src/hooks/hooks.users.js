import _ from 'lodash'
import makeDebug from 'debug'
import { getItems } from 'feathers-hooks-common'
import { BadRequest } from 'feathers-errors'
const debug = makeDebug('kalisio:kCore:users:hooks')

export function enforcePasswordPolicy (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'enforePasswordPolicy' hook should only be used as a 'before' hook.`)
    }

    // By pass check ?
    if (hook.params.force) return hook
    let app = hook.app
    let user = getItems(hook)
    // Get both password since some rules target one and some the other one
    let clearPassword = _.get(user, options.clearPasswordField || 'clearPassword')
    let hashedPassword = _.get(user, options.hashedPasswordField || 'password')
    if (clearPassword && hashedPassword && app.getPasswordPolicy) {
      debug('enforcing password policy on user', user)
      // First check the clear password
      let validator = app.getPasswordPolicy({ hashedPassword: false })
      let result = validator.validate(clearPassword, { list: true })
      if (!_.isEmpty(result)) {
        throw new BadRequest('The provided password does not comply to the password policy', {
          translation: {
            key: 'WEAK_PASSWORD',
            params: { failedRules: result }
          }
        })
      }
      // Then the hashed one
      validator = app.getPasswordPolicy({ hashedPassword: true })
      result = validator.validate(hashedPassword, { list: true })
      if (!_.isEmpty(result)) {
        throw new BadRequest('The provided password does not comply to the password policy', {
          translation: {
            key: 'WEAK_PASSWORD',
            params: { failedRules: result }
          }
        })
      }
    }
    return hook
  }
}
