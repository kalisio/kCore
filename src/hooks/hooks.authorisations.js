import _ from 'lodash'
import { merge } from 'feathers-commons'
import { getItems } from 'feathers-hooks-common'
import { Forbidden } from 'feathers-errors'
import { populateObject, populateObjects } from './hooks.query'
import { objectifyIDs } from '../db'
import { hasServiceAbilities, hasResourceAbilities, getQueryForAbilities } from '../common/permissions'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:authorisations:hooks')

export function populateSubjects (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'populateSubjects' hook should only be used as a 'before' hook.`)
  }

  return populateObjects({ serviceField: 'subjectsService', idField: 'subjects', throwOnNotFound: true })(hook)
}

export function populateResource (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'populateResource' hook should only be used as a 'before' hook.`)
  }

  return populateObject({ serviceField: 'resourcesService', idField: 'resource', throwOnNotFound: true })(hook)
}

export function authorise (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'authorise' hook should only be used as a 'before' hook.`)
  }

  // If called internally we skip authorisation
  let checkAuthorisation = hook.params.hasOwnProperty('provider')
  debug('Access check ' + (checkAuthorisation ? 'enabled' : 'disabled') + ' for provider')
  // If already checked we skip authorisation
  if (hook.params.authorised) {
    debug('Access already granted')
    checkAuthorisation = false
  }
  // We also skip authorisation for built-in Feathers services like authentication
  if (typeof hook.service.getPath !== 'function') {
    debug('Access disabled on built-in services')
    checkAuthorisation = false
  }
  // If explicitely asked to perform/skip, override defaults
  if (hook.params.hasOwnProperty('checkAuthorisation')) {
    checkAuthorisation = hook.params.checkAuthorisation
    // Bypass authorisation for next hooks otherwise we will loop infinitely
    delete hook.params.checkAuthorisation
    debug('Access check ' + (checkAuthorisation ? 'forced' : 'unforced'))
  }

  const operation = hook.method
  const resourceType = hook.service.name
  const context = hook.service.context
  debug('Provider is', hook.params.provider)
  if (hook.params.user) debug('User is', hook.params.user)
  debug('Operation is', operation)
  if (resourceType) debug('Resource type is', resourceType)

  if (checkAuthorisation) {
    // Build ability for user
    let authorisationService = hook.app.getService('authorisations')
    const abilities = authorisationService.getAbilities(hook.params.user)
    hook.params.abilities = abilities
    debug('User abilities are', abilities.rules)

    // Check for access to service fisrt
    if (!hasServiceAbilities(abilities, hook.service)) {
      debug('Service acces not granted')
      throw new Forbidden(`You are not allowed to access service ${hook.service.getPath()}`)
    }

    if (!hook.id) {
      // In this specific case there is no query to be run,
      // simply check against the object we'd like to create
      if (operation === 'create') {
        let resource = hook.data
        debug('Target resource is ', resource)
        if (!hasResourceAbilities(abilities, operation, resourceType, context, resource)) {
          debug('Resource acces not granted')
          throw new Forbidden(`You are not allowed to perform ${operation} operation on ${resourceType}`)
        }
      } else {
        // When we find/update/patch/remove multiple items this ensures that
        // only the ones authorised by constraints on the resources will be fetched
        // This avoid fetching all first then check it one by one
        const dbQuery = objectifyIDs(getQueryForAbilities(abilities, operation, resourceType))
        if (dbQuery) {
          debug('Target resource conditions are ', dbQuery)
          merge(hook.params.query, dbQuery)
        } else {
          hook.result = { total: 0, skip: 0, data: [] }
        }
      }
      debug('Resource acces granted')
    // Some specific services might not expose a get function, in this case we cannot check for authorisation
    // this has to be implemented by the service itself
    } else if (typeof hook.service.get === 'function') {
      // In this case (single get/update/patch) we need to fetch the item first
      return hook.service.get(hook.id, Object.assign({ checkAuthorisation: false }, _.omit(hook.params, ['provider'])))
      .then(resource => {
        debug('Target resource is', resource)
        // Then check against the object we'd like to manage
        if (!hasResourceAbilities(abilities, operation, resourceType, context, resource)) {
          debug('Resource acces not granted')
          throw new Forbidden(`You are not allowed to perform ${operation} operation on ${resourceType}`)
        }
        // Avoid fetching again the object in this case
        if (operation === 'get') {
          hook.result = resource
        }
        hook.params.authorised = true
        debug('Resource acces granted')
        return hook
      })
    }
  } else {
    debug('Authorisation check skipped, acces granted')
  }

  hook.params.authorised = true
  return Promise.resolve(hook)
}

export function updateAbilities (options = {}) {
  return async function (hook) {
    let app = hook.app
    let params = hook.params
    let authorisationService = app.getService('authorisations')
    let subject = (options.subjectAsItem ? getItems(hook) : params.user)
    // We might not have all information required eg on patch to compute new abilities,
    // in this case we have to fetch the whole subject
    if (options.fetchSubject) {
      subject = await hook.service.get(subject._id.toString())
    }
    const abilities = authorisationService.updateAbilities(subject)
    debug('Abilities updated on subject', subject, abilities.rules)
    return hook
  }
}

