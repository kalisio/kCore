import logger from 'loglevel'
import _ from 'lodash'
import sift from 'sift'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import reactive from 'feathers-reactive'
import config from 'config'
import { permissions } from '../common'
import { Store } from './store'
import Vue from 'vue'
import { Platform } from 'quasar'
import { Events } from './events'

// Register some global filters for case conversions
Vue.filter('kebabCase', (value) => _.kebabCase(value))
Vue.filter('camelCase', (value) => _.camelCase(value))
Vue.filter('lowerCase', (value) => _.lowerCase(value))
Vue.filter('snakeCase', (value) => _.snakeCase(value))
Vue.filter('startCase', (value) => _.startCase(value))
Vue.filter('upperCase', (value) => _.upperCase(value))

function getBaseUrlStorageKey () {
  return config.appName + '-baseUrl'
}

function siftMatcher (originalQuery) {
  // Filter out Feathers specific operators like $limit, $skip, etc.
  // (copied from https://github.com/feathersjs-ecosystem/feathers-reactive)
  const keysToOmit = Object.keys(originalQuery).filter(key => key.charCodeAt(0) === 36)
  const query = _.omit(originalQuery, ...keysToOmit)
  // Compatibility with fuzzy search that use $search query syntax
  _.forOwn(query, (value, key) => {
    if ((typeof value === 'object') && _.has(value, '$search')) {
      query[key] = { $regex: new RegExp(_.get(value, '$search'), 'i') }
    }
  })
  return sift(query)
}

export function kalisio () {
  const api = feathers()

  // Setup our interface
  // -------------------

  // This avoid managing the API path before each service name
  // If a context is not given it will be retrieved from the store if any and used for contextual services
  api.getServicePath = function (name, context, withApiPrefix = true) {
    const options = _.get(api.serviceOptions, name, {})
    let path
    // For non-contextual services path is always the name
    if (!options.context) {
      path = name
    } else {
      // Context is given as string ID or object ?
      if (typeof context === 'string') {
        if (context) path = context + '/' + name
        // Force global context on empty string
        else path = name
      } else if (typeof context === 'object') {
        if (context && context._id) path = context._id + '/' + name
        // Force global context on empty object
        else path = name
      } else {
        // Otherwise test for current context as service is registered as contextual
        const context = Store.get('context')
        if (context) {
          path = api.getServicePath(name, context, false)
        } else {
          // Because it could also be registered as global with the same name fallback
          path = name
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
    const service = api.service(path)
    if (!service) {
      throw new Error('Cannot retrieve service ' + name + ' for context ' + (typeof context === 'object' ? context._id : context))
    }
    // Store the path on first call
    if (!service.path) service.path = path
    return service
  }
  // Used to register an existing backend service with its options
  api.declareService = function (name, options = {}) {
    _.set(api.serviceOptions, name, options)
  }
  // Used to create a frontend only service with its options
  api.createService = function (name, options = {}) {
    let servicePath = options.path || name
    let contextId
    if (options.context) {
      contextId = (typeof options.context === 'object' ? options.context._id : options.context)
      servicePath = contextId + '/' + servicePath
    }
    servicePath = config.apiPath + '/' + servicePath
    api.declareService(name, options)
    let service = options.service
    // If we get a function try to call it assuming it will return the service object
    if (typeof options.service === 'function') {
      service = service(name, api, options)
    }
    service = api.use(servicePath, service)
    if (options.hooks) service.hooks(options.hooks)
    return api.service(servicePath)
  }
  // Change the base URL/domain to be used (useful for mobile apps)
  api.setBaseUrl = function (baseUrl) {
    window.localStorage.setItem(getBaseUrlStorageKey(), baseUrl)
    // Updating this setting live does not seem to work well in Feathers
    // For now the caller should simply "reload" the app
    /*
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
    */
  }

  api.getBaseUrl = function () {
    // let isMobile = Platform.is.cordova || Platform.is.ios
    let origin = Platform.is.cordova ? config.domain : window.location.origin
    // Check for registered custom base Url if any
    if (window.localStorage.getItem(getBaseUrlStorageKey())) {
      origin = window.localStorage.getItem(getBaseUrlStorageKey())
    }
    return origin
  }

  api.can = function (operation, service, context, resource) {
    const abilities = Store.get('user.abilities')
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

  // Setup log level
  if (config.logs && config.logs.level) {
    logger.setLevel(config.logs.level, false)
  } else {
    logger.setLevel('info')
  }
  const origin = api.getBaseUrl()
  if (config.transport === 'http') {
    api.configure(feathers.rest(origin).fetch(window.fetch.bind(window)))
  } else {
    api.socket = io(origin, {
      transports: ['websocket'],
      path: config.apiPath + 'ws'
    })
    api.configure(feathers.socketio(api.socket, { timeout: config.apiTimeout || 10000 }))
    // Retrieve our specific errors on rate-limiting
    api.socket.on('rate-limit', (error) => Events.$emit('error', error))
  }
  api.configure(feathers.authentication({
    storage: window.localStorage,
    // FIXME: customize cookie/key name
    cookie: config.apiJwt || 'feathers-jwt',
    storageKey: config.apiJwt || 'feathers-jwt',
    path: config.apiPath + '/authentication'
  }))
  api.configure(reactive({
    idField: '_id',
    matcher: siftMatcher // Our custom matcher to handle fuzzy search
  }))
  // Object used to store configuration options for services
  api.serviceOptions = {}

  return api
}
