import path from 'path'
import makeDebug from 'debug'
import logger from 'winston'
import _ from 'lodash'
import 'winston-daily-rotate-file'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { RateLimiter as SocketLimiter } from 'limiter'
import HttpLimiter from 'express-rate-limit'
import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { TooManyRequests } from '@feathersjs/errors'
import express from '@feathersjs/express'
import rest from '@feathersjs/express/rest'
import socketio from '@feathersjs/socketio'
import authentication from '@feathersjs/authentication'
import jwt from '@feathersjs/authentication-jwt'
import local from '@feathersjs/authentication-local'
import oauth2 from '@feathersjs/authentication-oauth2'
import GithubStrategy from 'passport-github'
import GoogleStrategy from 'passport-google-oauth20'
import OAuth2Verifier from './verifier'
import PasswordValidator from 'password-validator'
import { ObjectID } from 'mongodb'
import { Database } from './db'

const debug = makeDebug('kalisio:kCore:application')
const debugLimiter = makeDebug('kalisio:kCore:application:limiter')

function auth () {
  const app = this
  const config = app.get('authentication')
  const limiter = config.limiter
  if (limiter && limiter.http) {
    app.use(config.path, new HttpLimiter(limiter.http))
  }
  // Store availalbe OAuth2 providers
  app.authenticationProviders = []
  // Get access to password validator if a policy is defined
  if (config.passwordPolicy) {
    let validator
    app.getPasswordPolicy = function () {
      // Create on first access, should not be done outside a function because the app has not yet been correctly initialized
      if (validator) return validator
      let { minLength, maxLength, uppercase, lowercase, digits, symbols, noSpaces, prohibited } = config.passwordPolicy

      validator = new PasswordValidator()
      if (minLength) validator.is().min(minLength)
      if (maxLength) validator.is().max(maxLength)
      if (uppercase) validator.has().uppercase()
      if (lowercase) validator.has().lowercase()
      if (digits) validator.has().digits()
      if (symbols) validator.has().symbols()
      if (noSpaces) validator.not().spaces()
      if (prohibited) validator.is().not().oneOf(prohibited)
      // Add util functions/options to compare with previous passwords stored in history when required
      const verifier = new local.Verifier(app, _.merge({ usernameField: 'email', passwordField: 'password' },
        _.pick(config, ['service']), config.local))
      validator.comparePassword = verifier._comparePassword
      validator.options = config.passwordPolicy

      return validator
    }
  }
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

export function declareService (path, app, service, middlewares = {}) {
  const feathersPath = app.get('apiPath') + '/' + path
  let feathersService = app.service(feathersPath)
  // Some internal Feathers service might internally declare the service
  if (feathersService) {
    return feathersService
  }
  // Initialize our service by providing any middleware as well
  let args = [ feathersPath ]
  if (middlewares.before) args = args.concat(middlewares.before)
  args.push(service)
  if (middlewares.after) args = args.concat(middlewares.after)
  app.use.apply(app, args)
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

  try {
    const channels = require(path.join(servicesPath, name, name + '.channels'))
    _.forOwn(channels, (publisher, event) => {
      if (event === 'all') service.publish(publisher)
      else service.publish(event, publisher)
    })
    debug(name + ' service channels configured on path ' + servicesPath)
  } catch (error) {
    debug('No ' + name + ' service channels configured on path ' + servicesPath)
    if (error.code !== 'MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  return service
}

export function createProxyService (options) {
  const targetService = options.service
  function proxyParams (params) {
    if (options.params) {
      let proxiedParams
      if (options.params === 'function') {
        proxiedParams = options.params(params)
      } else {
        proxiedParams = _.merge(params, options.params)
      }
      return proxiedParams
    } else return params
  }
  function proxyId (id) {
    if (options.id) return options.id(id)
    else return id
  }
  function proxyData (data) {
    if (options.data) return options.data(data)
    else return data
  }
  function proxyResult (data) {
    if (options.result) return options.result(data)
    else return data
  }
  return {
    async find (params) { return proxyResult(await targetService.find(proxyParams(params))) },
    async get (id, params) { return proxyResult(await targetService.get(proxyId(id), proxyParams(params))) },
    async create (data, params) { return proxyResult(await targetService.create(proxyData(data), proxyParams(params))) },
    async update (id, data, params) { return proxyResult(await targetService.update(proxyId(id), proxyData(data), proxyParams(params))) },
    async patch (id, data, params) { return proxyResult(await targetService.patch(proxyId(id), proxyData(data), proxyParams(params))) },
    async remove (id, params) { return proxyResult(await targetService.remove(proxyId(id), proxyParams(params))) }
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
  let contextId
  if (options.context) {
    contextId = (typeof options.context === 'object'
      ? (ObjectID.isValid(options.context) ? options.context.toString() : options.context._id.toString()) : options.context)
    servicePath = contextId + '/' + servicePath
  }
  service = declareService(servicePath, app, service, options.middlewares)
  // Register hooks and event filters
  service = configureService(name, service, options.servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  if (dbService && options.servicesPath) {
    try {
      let serviceMixin = require(path.join(options.servicesPath, name, name + '.service'))
      // If we get a function try to call it assuming it will return the mixin object
      if (typeof serviceMixin === 'function') {
        serviceMixin = serviceMixin(name, app, options)
      }
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
  service.getContextId = function () {
    return contextId // As string
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
    console.error('Could not remove default logger transport', error)
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
      console.error('Could not setup default log levels', error)
    }
  })
}

function tooManyRequests (socket, message, key) {
  debug(message)
  const error = new TooManyRequests(message, { translation: { key } })
  socket.emit('rate-limit', error)
  // Add a timeout so that error message is correctly handled
  setTimeout(() => socket.disconnect(true), 3000)
}

function setupSockets (app) {
  const apiLimiter = app.get('apiLimiter')
  const authConfig = app.get('authentication')
  const authLimiter = authConfig.limiter
  let connections = {}
  let nbConnections = 0

  return io => {
    // By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
    // The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
    io.sockets.setMaxListeners(0)
    const maxConnections = _.get(apiLimiter, 'websocket.maxConcurrency', 0)
    const maxIpConnections = _.get(apiLimiter, 'websocket.concurrency', 0)

    io.on('connection', socket => {
      nbConnections++
      debug('New socket connection', socket.id, socket.conn.remoteAddress, nbConnections)
      // Setup disconnect handler first
      socket.on('disconnect', () => {
        nbConnections--
        debug('Socket disconnection', socket.id, socket.conn.remoteAddress, nbConnections)
        if (maxIpConnections > 0) {
          const nbIpConnections = _.get(connections, socket.conn.remoteAddress) - 1
          debug('Total number of connections for', socket.id, socket.conn.remoteAddress, nbIpConnections)
          _.set(connections, socket.conn.remoteAddress, nbIpConnections)
        }
      })
      if (maxConnections > 0) {
        if (nbConnections > maxConnections) {
          tooManyRequests(socket, 'Too many concurrent connections (rate limiting)', 'RATE_LIMITING_CONCURRENCY')
          return
        }
      }
      if (maxIpConnections > 0) {
        if (_.has(connections, socket.conn.remoteAddress)) {
          const nbIpConnections = _.get(connections, socket.conn.remoteAddress) + 1
          debug('Total number of connections for', socket.id, socket.conn.remoteAddress, nbConnections)
          _.set(connections, socket.conn.remoteAddress, nbIpConnections)
          if (nbIpConnections > maxIpConnections) {
            tooManyRequests(socket, 'Too many concurrent connections (rate limiting)', 'RATE_LIMITING_CONCURRENCY')
            return
          }
        } else {
          _.set(connections, socket.conn.remoteAddress, 1)
        }
      }
      /* For debug purpose: trace all data received
      socket.use((packet, next) => {
        console.log(packet)
        next()
      })
      */
      if (apiLimiter && apiLimiter.websocket) {
        const { tokensPerInterval, interval } = apiLimiter.websocket
        socket.socketLimiter = new SocketLimiter(tokensPerInterval, interval)
        socket.use((packet, next) => {
          if (packet.length > 0) {
            // Message are formatted like this 'service_path::service_method'
            let pathAndMethod = packet[0].split('::')
            if (pathAndMethod.length > 0) {
              // const servicePath = pathAndMethod[0]
              debugLimiter(socket.socketLimiter.getTokensRemaining() + ' remaining API token for socket', socket.id, socket.conn.remoteAddress)
              if (!socket.socketLimiter.tryRemoveTokens(1)) { // if exceeded
                tooManyRequests(socket, 'Too many requests in a given amount of time (rate limiting)', 'RATE_LIMITING')
                // FIXME: calling this causes a client timeout
                // next(error)
                // Need to normalize the error object as JSON
                // let result = {}
                // Object.getOwnPropertyNames(error).forEach(key => (result[key] = error[key]))
                // Trying to send error like in https://github.com/feathersjs/transport-commons/blob/auk/src/events.js#L103
                // does not work either (also generates a client timeout)
                // socket.emit(`${servicePath} error`, result)
                // socket.emit(result)
                return
              }
            }
          }
          next()
        })
      }

      if (authLimiter && authLimiter.websocket) {
        const { tokensPerInterval, interval } = authLimiter.websocket
        socket.authSocketLimiter = new SocketLimiter(tokensPerInterval, interval)
        socket.on('authenticate', (data) => {
          // We only limit password guessing
          if (data.strategy === 'local') {
            debugLimiter(socket.authSocketLimiter.getTokensRemaining() + ' remaining authentication token for socket', socket.id, socket.conn.remoteAddress)
            if (!socket.authSocketLimiter.tryRemoveTokens(1)) { // if exceeded
              tooManyRequests(socket, 'Too many authentication requests in a given amount of time (rate limiting)', 'RATE_LIMITING_AUTHENTICATION')
            }
          }
        })
      }
    })
  }
}

export function kalisio () {
  let app = express(feathers())
  // By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
  // The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
  app.setMaxListeners(0)
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
      // Could be Object ID or raw object
      if (ObjectID.isValid(context)) return app.service(app.get('apiPath') + '/' + context.toString() + '/' + path)
      else return app.service(app.get('apiPath') + '/' + context._id.toString() + '/' + path)
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
    await fn.call(this, this)
    return this
  }
  const apiLimiter = app.get('apiLimiter')
  if (apiLimiter && apiLimiter.http) {
    app.use(app.get('apiPath'), new HttpLimiter(apiLimiter.http))
  }

  // Enable CORS, security, compression, and body parsing
  app.use(cors())
  app.use(helmet())
  app.use(compress())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  // Set up plugins and providers
  app.configure(rest())
  app.configure(socketio({ path: app.get('apiPath') + 'ws' }, setupSockets(app)))
  app.configure(auth)

  // Initialize DB
  app.db = Database.create(app)

  return app
}
