import logger from 'loglevel'
import _ from 'lodash'
import feathers from 'feathers-client'
import feathersHooks from 'feathers-hooks'
import io from 'socket.io-client'
import reactive from 'feathers-reactive'
import rxjs from 'rxjs'
import config from 'config'
import { permissions } from '../common'
import { Store } from './store'
import { Platform } from 'quasar'

export function kalisio () {
  let api = feathers()
  // Setup log level
  if (config.logs && config.logs.level) {
    logger.setLevel(config.logs.level, false)
  } else {
    logger.setLevel('info')
  }
  api.configure(feathersHooks())
  const origin = Platform.is.cordova ? config.domain : window.location.origin
  if (config.transport === 'http') {
    api.configure(feathers.rest(origin).fetch(window.fetch.bind(window)))
  } else {
    let socket = io(origin, {
      transports: ['websocket'],
      path: config.apiPath + 'ws'
    })
    api.configure(feathers.socketio(socket, { timeout: 10000 }))
  }
  api.configure(feathers.authentication({
    storage: window.localStorage,
    path: config.apiPath + '/authentication'
  }))
  api.configure(reactive(rxjs, {
    idField: '_id'
  }))
  // Object used to store configuration options for services
  api.serviceOptions = {}

  // This avoid managing the API path before each service name
  api.getServicePath = function (name, context, withApiPrefix = true) {
    const options = _.get(api.serviceOptions, name, {})
    let path
    // For non-contextual services path is always the name
    if (!options.context) {
      path = name
    } else {
      // Context is given as string ID or object ?
      if (context && typeof context === 'string') {
        path = context + '/' + name
      } else if (context && typeof context === 'object') {
        path = context._id + '/' + name
      } else {
        // Service is registered as contextual
        const context = Store.get('context')
        if (context) {
          path = api.getServicePath(name, context, false)
        } else {
          throw new Error('Cannot retrieve context for contextual service ' + name)
        }
      }
    }

    if (withApiPrefix) {
      path = config.apiPath + '/' + path
    }
    return path
  }
  api.getService = function (name, context) {
    const path = api.getServicePath(name, context)
    let service = api.service(path)
    // Store the path on first call
    if (!service.path) service.path = path
    return service
  }
  // Used to register a service with its options
  api.declareService = function (name, options = {}) {
    _.set(api.serviceOptions, name, options)
  }
  // change the base URL/domain to be used (useful for mobile apps)
  api.setBaseUrl = function (baseUrl) {
    if (config.transport === 'http') {
      Object.keys(this.services).forEach(path => {
        const service = this.service(path)
        if (service.base) {
          service.base = `${baseUrl}/${path}`
        }
      })
    } else {
      let socket = io(baseUrl, {
        transports: ['websocket'],
        path: config.apiPath + 'ws'
      })
      this.configure(feathers.socketio(socket))
    }
  }

  api.can = function (operation, service, context, resource) {
    let abilities = Store.get('user.abilities')
    logger.debug('Check for abilities ', operation, service, context, resource, abilities)
    if (!abilities) {
      logger.debug('Access denied without abilities')
      return false
    }
    // Check for access to service fisrt
    const path = api.getServicePath(service, context, false)
    let result = permissions.hasServiceAbilities(abilities, path)
    if (!result) {
      logger.debug('Access to service path ' + path + ' denied')
      return false
    } else if (operation === 'service') {
      // When we only check for service-level access return
      return true
    }
    // Then for access to resource
    result = permissions.hasResourceAbilities(abilities, operation, service, context, resource)
    if (!result) {
      logger.debug('Access to resource denied')
    } else {
      logger.debug('Access to resource granted')
    }
    return result
  }

  return api
}
