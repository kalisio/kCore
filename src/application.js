import path from 'path'
import makeDebug from 'debug'
import logger from 'winston'
import 'winston-daily-rotate-file'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import { merge } from 'feathers-commons'
import rest from 'feathers-rest'
import socketio from 'feathers-socketio'
import authentication from 'feathers-authentication'
import jwt from 'feathers-authentication-jwt'
import local from 'feathers-authentication-local'
import oauth2 from 'feathers-authentication-oauth2'
import GithubStrategy from 'passport-github'
import GoogleStrategy from 'passport-google-oauth20'
import OAuth2Verifier from './verifier'
import { Database } from './db'

const debug = makeDebug('kalisio:kCore:application')

function auth () {
  const app = this
  const config = app.get('authentication')
  // Store availalbe OAuth2 providers
  app.authenticationProviders = []
  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local())
  if (config.github) {
    app.configure(oauth2({
      name: 'github',
      Strategy: GithubStrategy,
      Verifier: OAuth2Verifier
    }))
    app.authenticationProviders.push('github')
  }
  if (config.google) {
    app.configure(oauth2({
      name: 'google',
      Strategy: GoogleStrategy,
      Verifier: OAuth2Verifier
    }))
    app.authenticationProviders.push('google')
  }
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.getService('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  })
}

export function declareService (path, app, service) {
  const feathersPath = app.get('apiPath') + '/' + path
  let feathersService = app.service(feathersPath)
  // Some internal Feathers service might internally declare the service
  if (feathersService) {
    return feathersService
  }
  // Initialize our service
  app.use(feathersPath, service)
  debug('Service declared on path ' + feathersPath)
  // Return the Feathers service, ie base service + Feathers' internals
  return app.service(feathersPath)
}

export function configureService (name, service, servicesPath) {
  try {
    const hooks = require(path.join(servicesPath, name, name + '.hooks'))
    service.hooks(hooks)
    debug(name + ' service hooks configured on path ' + servicesPath)
  } catch (error) {
    debug('No ' + name + ' service hooks configured on path ' + servicesPath)
    if (error.code !== 'MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  if (service.filter) {
    try {
      const filters = require(path.join(servicesPath, name, name + '.filters'))
      service.filter(filters)
      debug(name + ' service filters configured on path ' + servicesPath)
    } catch (error) {
      debug('No ' + name + ' service filters configured on path ' + servicesPath)
      if (error.code !== 'MODULE_NOT_FOUND') {
        // Log error in this case as this might be linked to a syntax error in required file
        debug(error)
      }
      // As this is optionnal this require has to fail silently
    }
  }

  return service
}

export function createProxyService (options) {
  const targetService = options.service
  function proxy (params) {
    if (options.params) {
      let proxyParams
      if (options.params === 'function') {
        proxyParams = options.params(params)
      } else {
        proxyParams = merge(params, options.params)
      }
      return proxyParams
    } else return params
  }
  return {
    find (params) { return targetService.find(proxy(params)) },
    get (id, params) { return targetService.get(id, proxy(params)) },
    create (data, params) { return targetService.create(data, proxy(params)) },
    update (id, data, params) { return targetService.update(id, data, proxy(params)) },
    patch (id, data, params) { return targetService.patch(id, data, proxy(params)) },
    remove (id, params) { return targetService.remove(id, proxy(params)) }
  }
}

export function createService (name, app, options = {}) {
  const createFeathersService = require('feathers-' + app.db.adapter)

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate
  }, options)
  // For DB services a model has to be provided
  let dbService = false
  try {
    if (options.modelsPath) {
      const configureModel = require(path.join(options.modelsPath, name + '.model.' + app.db.adapter))
      configureModel(app, serviceOptions)
      dbService = true
    }
  } catch (error) {
    debug('No ' + name + ' service model configured on path ' + options.modelsPath)
    if (error.code !== 'MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  // Initialize our service with any options it requires
  let service
  if (dbService) {
    service = createFeathersService(serviceOptions)
  } else if (options.proxy) {
    service = createProxyService(options.proxy)
  } else {
    // Otherwise we expect the service to be provided as a Feathers service interface
    service = require(path.join(options.servicesPath, name, name + '.service'))
    // If we get a function try to call it assuming it will return the service object
    if (typeof service === 'function') {
      service = service(name, app, options)
    }
  }

  // Get our initialized service so that we can register hooks and filters
  let servicePath = options.path || name
  if (options.context) {
    if (typeof options.context === 'object') servicePath = options.context._id.toString() + '/' + servicePath
    else servicePath = options.context + '/' + servicePath
  }
  service = declareService(servicePath, app, service)
  // Register hooks and filters
  service = configureService(name, service, options.servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  if (dbService && options.servicesPath) {
    try {
      const serviceMixin = require(path.join(options.servicesPath, name, name + '.service'))
      service.mixin(serviceMixin)
    } catch (error) {
      debug('No ' + name + ' service mixin configured on path ' + options.servicesPath)
      if (error.code !== 'MODULE_NOT_FOUND') {
        // Log error in this case as this might be linked to a syntax error in required file
        debug(error)
      }
      // As this is optionnal this require has to fail silently
    }
  }
  // Then configuration
  service.name = name
  service.app = app
  service.options = options
  service.path = servicePath
  service.context = options.context

  // Add some utility functions
  service.getPath = function (withApiPrefix) {
    let path = service.path
    if (withApiPrefix) {
      path = app.get('apiPath') + '/' + path
    }
    return path
  }

  debug(service.name + ' service registration completed')
  app.emit('service', service)

  return service
}

function setupLogger (logsConfig) {
  // Remove winston defaults
  try {
    logger.remove(logger.transports.Console)
  } catch (error) {
    // Logger might be down, use console
    console.error('Could not remove default logger transport')
  }
  // We have one entry per log type
  let logsTypes = logsConfig ? Object.getOwnPropertyNames(logsConfig) : []
  // Create corresponding winston transports with options
  logsTypes.forEach(logType => {
    let options = logsConfig[logType]
    // Setup default log level if not defined
    if (!options.level) {
      options.level = (process.env.ENV === 'development' ? 'debug' : 'info')
    }
    try {
      logger.add(logger.transports[logType], options)
    } catch (error) {
      // Logger might be down, use console
      console.error('Could not setup default log levels')
    }
  })
}

export function kalisio () {
  let app = feathers()
  // Load app configuration first
  app.configure(configuration())
  // Then setup logger
  setupLogger(app.get('logs'))

  // This avoid managing the API path before each service name
  app.getService = function (path, context) {
    // Context is given as string ID
    if (context && typeof context === 'string') {
      return app.service(app.get('apiPath') + '/' + context + '/' + path)
    } else if (context && typeof context === 'object') {
      return app.service(app.get('apiPath') + '/' + context._id.toString() + '/' + path)
    } else {
      return app.service(app.get('apiPath') + '/' + path)
    }
  }
  // This is used to add hooks/filters to services
  app.configureService = function (name, service, servicesPath) {
    return configureService(name, service, servicesPath)
  }
  // This is used to create standard services
  app.createService = function (name, options) {
    return createService(name, app, options)
  }
  // Override Feathers configure that do not manage async operations,
  // here we also simply call the function given as parameter but await for it
  app.configure = async function (fn) {
    await fn.call(this)
    return this
  }

  // Enable CORS, security, compression, and body parsing
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Set up plugins and providers
  app.configure(hooks())
  app.configure(rest())
  app.configure(socketio({
    path: app.get('apiPath') + 'ws'
  }))

  app.configure(auth)

  // Initialize DB
  app.db = Database.create(app)

  return app
}
