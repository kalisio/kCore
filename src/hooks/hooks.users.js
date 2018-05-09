import _ from 'lodash'
import makeDebug from 'debug'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { BadRequest } from 'feathers-errors'

const debug = makeDebug('kalisio:kCore:users:hooks')

export function enforcePasswordPolicy (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'enforePasswordPolicy' hook should only be used as a 'before' hook.`)
    }
    // By pass check ?
    if (hook.params.force) return hook
    let app = hook.app
    let user = options.userAsItem ? getItems(hook) : hook.params.user
    // Get both password(s) since some rules target one and some the other one(s)
    let clearPassword = _.get(user, options.passwordField || 'clearPassword')
    let hashedPasswords = _.get(user, options.previousPasswordsField || 'previousPasswords', [])
    if (clearPassword && hashedPasswords && app.getPasswordPolicy) {
      debug('Enforcing password policy on user', user)
      const validator = app.getPasswordPolicy()
      // First check the clear password
      let result = validator.validate(clearPassword, { list: true })
      // Then check for the last used passwords using password policy verifier
      for (let i = 0; i < hashedPasswords.length; i++) {
        try {
          await validator.comparePassword({ password: hashedPasswords[i] }, clearPassword)
          // If we have found a similar password stop
          result.push('previous')
          break
        } catch (error) {
          // Check next one
        }
      }

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

export function storePreviousPassword (options = {}) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'storePreviousPassword' hook should only be used as a 'before' hook.`)
    }
    let app = hook.app
    let data = getItems(hook)
    if (data.password && app.getPasswordPolicy && hook.params.previousItem) {
      const validator = app.getPasswordPolicy()
      // Based on previous password value
      let user = hook.params.previousItem
      const passwordField = options.passwordField || 'password'
      let password = _.get(user, passwordField)
      const previousPasswordsField = options.previousPasswordsField || 'previousPasswords'
      let previousPasswords = _.get(user, previousPasswordsField, [])
      previousPasswords.push(password)
      // Pop oldest password when required
      const max = _.get(validator, 'options.history', 5)
      if (previousPasswords.length > max) previousPasswords.shift()
      Object.assign(data, { [previousPasswordsField]: previousPasswords })
      replaceItems(hook, data)
    }
    return hook
  }
}
