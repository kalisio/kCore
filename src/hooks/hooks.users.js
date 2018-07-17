import _ from 'lodash'
import generateRandomPassword from 'password-generator'
import makeDebug from 'debug'
import { getItems, replaceItems } from 'feathers-hooks-common'
import { BadRequest } from '@feathersjs/errors'

const debug = makeDebug('kalisio:kCore:users:hooks')

export function enforcePasswordPolicy (options = {}) {
  return async function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'enforePasswordPolicy' hook should only be used as a 'before' hook.`)
    }
    // By pass check ?
    if (hook.params.force) return hook
    let app = hook.app
    let item = getItems(hook)
    let user = options.userAsItem ? item : hook.params.user
    // Get both password(s) since some rules target one and some the other one(s)
    let clearPassword = _.get(item, options.passwordField || 'clearPassword')
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
            keys: result.map(rule => 'WEAK_PASSWORD_' + rule.toUpperCase()),
            params: Object.assign({ failedRules: result }, _.omit(validator.options, ['prohibited']))
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
    if (app.getPasswordPolicy && hook.params.previousItem) {
      const validator = app.getPasswordPolicy()
      // Based on previous password value
      let user = hook.params.previousItem
      const passwordField = options.passwordField || 'password'
      let password = _.get(user, passwordField)
      const previousPasswordsField = options.previousPasswordsField || 'previousPasswords'
      let previousPasswords = _.get(user, previousPasswordsField, [])
      debug(`Moving previous password from field ${passwordField} in field ${previousPasswords} on user`, user)
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

export function generatePassword (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'generatePassword' hook should only be used as a 'before' hook.`)
  }
  let app = hook.app
  let data = hook.data
  // Generate a password
  let passwordRule = new RegExp('[\\w\\d\\?\\-]')
  // If we have a password policy ensure we match it
  if (app.getPasswordPolicy) {
    const validator = app.getPasswordPolicy()
    do {
      data.password = generateRandomPassword(validator.options.minLength || 12, false, passwordRule)
    } while (!validator.validate(data.password))
  } else {
    data.password = generateRandomPassword(12, false, passwordRule)
  }
  return hook
}
