import logger from 'loglevel'
import feathers from 'feathers-client'
import feathersHooks from 'feathers-hooks'
import io from 'socket.io-client'
import reactive from 'feathers-reactive'
import rxjs from 'rxjs'
import config from 'config'

export function kalisio () {
  let api = feathers()
  // Setup log level
  if (config.logs && config.logs.level) {
    logger.setLevel(config.logs.level, false)
  } else {
    logger.setLevel('info')
  }
  api.configure(feathersHooks())
  if (config.transport === 'http') {
    api.configure(feathers.rest(window.location.origin).fetch(window.fetch.bind(window)))
  } else {
    let socket = io(window.location.origin, {
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
  api.getService = function (path, context) {
    // Context is given as string ID
    if (typeof context === 'string') {
      return api.service(config.apiPath + '/' + context + '/' + path)
    } else if (typeof context === 'object' && context !== null) {
      return api.service(config.apiPath + '/' + context._id + '/' + path)
    } else {
      return api.service(config.apiPath + '/' + path)
    }
  }

  api.users = api.getService('users')

  return api
}
