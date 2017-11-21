import logger from 'loglevel'
import _ from 'lodash'
import feathers from 'feathers-client'
import feathersHooks from 'feathers-hooks'
import io from 'socket.io-client'
import reactive from 'feathers-reactive'
import rxjs from 'rxjs'
import config from 'config'
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
  api.getServicePath = function (path, context) {
    // Context is given as string ID or object ?
    if (typeof context === 'string') {
      return config.apiPath + '/' + context + '/' + path
    } else if (typeof context === 'object' && context !== null) {
      return config.apiPath + '/' + context._id + '/' + path
    } else {
      const options = _.get(api.serviceOptions, path, {})
      // Service might also be registered as contextual
      if (options.context) {
        return api.getServicePath(path, Store.get('context'))
      } else {
        return config.apiPath + '/' + path
      }
    }
  }
  api.getService = function (path, context) {
    return api.service(api.getServicePath(path, context))
  }
  // Used to register a service with its options
  api.declareService = function (path, options = {}) {
    _.set(api.serviceOptions, path, options)
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

  return api
}
