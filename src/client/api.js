import logger from 'loglevel'
import feathers from 'feathers-client'
import feathersHooks from 'feathers-hooks'
import io from 'socket.io-client'
import reactive from 'feathers-reactive'
import rxjs from 'rxjs'
import config from 'config'
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
    api.configure(feathers.socketio(socket))
  }
  api.configure(feathers.authentication({
    storage: window.localStorage,
    path: config.apiPath + '/authentication'
  }))
  api.configure(reactive(rxjs, {
    idField: '_id'
  }))

  // This avoid managing the API path before each service name
  api.getServicePath = function (path, context) {
    // Context is given as string ID
    if (typeof context === 'string') {
      return config.apiPath + '/' + context + '/' + path
    } else if (typeof context === 'object' && context !== null) {
      return config.apiPath + '/' + context._id + '/' + path
    } else {
      return config.apiPath + '/' + path
    }
  }
  api.getService = function (path, context) {
    return api.service(api.getServicePath(path, context))
  }

  api.users = api.getService('users')

  return api
}
