import _ from 'lodash'
import sift from 'sift'
import LruCache from 'lru-cache'
import makeDebug from 'debug'
import { defineAbilities } from '../../common/permissions'

const debug = makeDebug('kalisio:kCore:authorisations')

// Global key to store abilities in cache for anonymous users
const ANONYMOUS_USER = 'anonymous'

// Util function to look for a given resource in a scope
function findResource (scope, query) {
  let results = sift(query, scope)
  return results.length > 0 ? results[0] : null
}

export default {
  // Used to change permissions for a subject on a resource
  // We pass parameters in the query/data object
  // The params object should be already filled by populate hooks
  create (data, params) {
    let query = params.query
    // Make hook usable with query params as well
    let scopeName = data.scope || query.scope // Get scope name first
    return Promise.all(params.subjects.map(subject => {
      // Then retrieve the right scope on the subject
      let scope = _.get(subject, scopeName, [])
      // Then the target resource
      let resource = findResource(scope, { _id: params.resource._id })
      // On first authorisation create the resource in scope
      if (!resource) {
        resource = {
          _id: params.resource._id
        }
        scope.push(resource)
      }
      // Hooks should have populate subject/resource,
      // now we have to set permissions on the given subject's scope
      resource.permissions = data.permissions || query.permissions
      // This cover the case when we create the scope on the first auth,
      // so that if the caller want to get back the update subject he can have it
      _.set(subject, scopeName, scope)
      this.updateAbilities(subject)
      return params.subjectsService.patch(subject._id, {
        [scopeName]: scope
      }, {
        user: params.user
      })
      .then(subject => {
        debug('Authorisation ' + data.permissions + ' set for subject ' + subject._id + ' on resource ' + params.resource._id + ' with scope ' + scopeName)
      })
    }))
  },

  // Used to remove permissions for a subject on a resource
  // We use ID as target resource and pass parameters in the query object
  // The params object should be already filled by populate hooks
  remove (id, params) {
    let query = params.query
    let scopeName = query.scope // Get scope name first
    return Promise.all(params.subjects.map(subject => {
      // Then retrieve the right scope on the subject
      let scope = _.get(subject, scopeName, [])
      // Then the target resource
      scope = scope.filter(sift({ _id: { $ne: id.toString() } }))
      // This cover the case when we create the scope on the first auth,
      // so that if the caller want to get back the update subject he can have it
      _.set(subject, scopeName, scope)
      this.updateAbilities(subject)
      return params.subjectsService.patch(subject._id, {
        [scopeName]: scope
      }, {
        user: params.user
      })
      .then(subject => {
        debug('Authorisation unset for subject ' + subject._id + ' on resource ' + id + ' with scope ' + scopeName)
      })
    }))
  },

  setup (app) {
    const config = app.get('authorisation')
    if (config && config.cache) {
      // Store abilities of the N most active users in LRU cache (defaults to 1000)
      this.cache = new LruCache(config.cache.maxUsers || 1000)
      debug('Using LRU cache for user abilities')
    } else {
      debug('Do not use LRU cache for user abilities')
    }
  },

  // Compute abilities for a given user and set it in cache the first time
  // or get it from cache if found
  getAbilities (subject) {
    if (this.cache) {
      if (subject) {
        if (this.cache.has(subject._id.toString())) return this.cache.get(subject._id.toString())
      } else {
        if (this.cache.has(ANONYMOUS_USER)) return this.cache.get(ANONYMOUS_USER)
      }
    }

    let abilities = defineAbilities(subject)

    if (this.cache) {
      if (subject) {
        this.cache.set(subject._id.toString(), abilities)
      } else {
        this.cache.set(ANONYMOUS_USER, abilities)
      }
    }

    return abilities
  },

  // Compute abilities for a given user and update it in cache
  updateAbilities (subject) {
    if (this.cache) {
      if (subject) {
        this.cache.del(subject._id.toString())
      } else {
        this.cache.del(ANONYMOUS_USER)
      }
    }

    return this.getAbilities(subject)
  }
}
