import path from 'path'
import logger from 'winston'
import 'winston-daily-rotate-file'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import feathers from 'feathers'
import configuration from 'feathers-configuration'
import hooks from 'feathers-hooks'
import rest from 'feathers-rest'
import socketio from 'feathers-socketio'
import authentication from 'feathers-authentication'
import jwt from 'feathers-authentication-jwt'
import local from 'feathers-authentication-local'
import oauth2 from 'feathers-authentication-oauth2'
import GithubStrategy from 'passport-github'
import GoogleStrategy from 'passport-google-oauth20'
import { Database } from './db'

function auth () {
  const app = this
  const config = app.get('authentication')

  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local())
  app.configure(oauth2({
    name: 'github',
    Strategy: GithubStrategy
  }))
  app.configure(oauth2({
    name: 'google',
    Strategy: GoogleStrategy
  }))
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

function declareService (name, app, service) {
  const path = app.get('apiPath') + '/' + name
  // Initialize our service
  app.use(path, service)

  return app.getService(name)
}

function configureService (name, service, servicesPath) {
  const hooks = require(path.join(servicesPath, name, name + '.hooks'))
  service.hooks(hooks)

  if (service.filter) {
    const filters = require(path.join(servicesPath, name, name + '.filters'))
    service.filter(filters)
  }

  return service
}

export function createService (name, app, modelsPath, servicesPath, options) {
  const createFeathersService = require('feathers-' + app.db.adapter)
  const configureModel = require(path.join(modelsPath, name + '.model.' + app.db.adapter))

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate
  }, options || {})
  configureModel(app, serviceOptions)

  // Initialize our service with any options it requires
  let service = createFeathersService(serviceOptions)
  // Get our initialized service so that we can register hooks and filters
  service = declareService(name, app, service)
  // Register hooks and filters
  service = configureService(name, service, servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  try {
    const serviceMixin = require(path.join(servicesPath, name, name + '.service'))
    service.mixin(serviceMixin)
  } catch (error) {
    // As this is optionnal this require has to fail silently
  }
  // Then configuration
  service.name = name
  service.app = app

  return service
}

export function createContextualService (context, name, app, modelsPath, servicesPath, options) {
  const createFeathersService = require('feathers-' + app.db.adapter)
  const configureModel = require(path.join(modelsPath, name + '.model.' + app.db.adapter))

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate
  }, options || {})
  configureModel(app, serviceOptions)

  // Initialize our service with any options it requires
  let service = createFeathersService(serviceOptions)
  // Get our initialized service so that we can register hooks and filters
  service = declareService(context._id + '/' + name, app, service)
  // Register hooks and filters
  service = configureService(name, service, servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  try {
    const serviceMixin = require(path.join(servicesPath, name, name + '.service'))
    service.mixin(serviceMixin)
  } catch (error) {
    // As this is optionnal this require has to fail silently
  }
  // Then configuration
  service.name = name
  service.app = app

  return service
}

function setupLogger (logsConfig) {
  // Remove winston defaults
  try {
    logger.remove(logger.transports.Console)
  } catch (error) {

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

    }
  })
}

export default function kaelia () {
  let app = feathers()
  // Load app configuration first
  app.configure(configuration())
  // Then setup logger
  setupLogger(app.get('logs'))

  // This avoid managing the API path before each service name
  app.getService = function (path, context) {
    // Context is given as string ID
    if (typeof context === 'string') {
      return app.service(app.get('apiPath') + '/' + context + '/' + path)
    } else if (typeof context === 'object') {
      return app.service(app.get('apiPath') + '/' + context._id + '/' + path)
    } else {
      return app.service(app.get('apiPath') + '/' + path)
    }
  }
  // This is used to create standard services
  app.createService = function (name, modelsPath, servicesPath, options) {
    return createService(name, app, modelsPath, servicesPath, options)
  }
  // This is used to create services attached to a given context object
  app.createContextualService = function (object, name, modelsPath, servicesPath, options) {
    return createContextualService(object, name, app, modelsPath, servicesPath, options)
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
