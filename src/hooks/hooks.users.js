import _ from 'lodash'
import makeDebug from 'debug'
import { getItems } from 'feathers-hooks-common'
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
      // First check the clear password
      let validator = app.getPasswordPolicy()
      let result = validator.validate(clearPassword, { list: true })
      // Then check for the last used passwords using local auth verifier
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
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'storePreviousPassword' hook should only be used as a 'before' hook.`)
    }
    let user = options.userAsItem ? getItems(hook) : hook.params.user
    let userService = hook.app.getService('users')
    let password = _.get(user, options.passwordField || 'password')
    let previousPasswordsField = options.previousPasswordsField || 'previousPasswords'
    // On a patch we might need to get back missing information
    if (!_.has(user, previousPasswordsField)) {
      user = await userService.get(user._id.toString())
    }
    let previousPasswords = _.get(user, previousPasswordsField, [])
    previousPasswords.push(password)
    // Pop oldest password when required
    const max = options.max || 5
    if (previousPasswords.length > max) previousPasswords.shift()
    await userService.patch(user._id.toString(), { [previousPasswordsField]: previousPasswords })
    return hook
  }
}
