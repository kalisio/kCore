'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.declareService = declareService;
exports.configureService = configureService;
exports.createProxyService = createProxyService;
exports.createService = createService;
exports.kalisio = kalisio;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

require('winston-daily-rotate-file');

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _feathers = require('feathers');

var _feathers2 = _interopRequireDefault(_feathers);

var _feathersConfiguration = require('feathers-configuration');

var _feathersConfiguration2 = _interopRequireDefault(_feathersConfiguration);

var _feathersHooks = require('feathers-hooks');

var _feathersHooks2 = _interopRequireDefault(_feathersHooks);

var _feathersCommons = require('feathers-commons');

var _feathersRest = require('feathers-rest');

var _feathersRest2 = _interopRequireDefault(_feathersRest);

var _feathersSocketio = require('feathers-socketio');

var _feathersSocketio2 = _interopRequireDefault(_feathersSocketio);

var _feathersAuthentication = require('feathers-authentication');

var _feathersAuthentication2 = _interopRequireDefault(_feathersAuthentication);

var _feathersAuthenticationJwt = require('feathers-authentication-jwt');

var _feathersAuthenticationJwt2 = _interopRequireDefault(_feathersAuthenticationJwt);

var _feathersAuthenticationLocal = require('feathers-authentication-local');

var _feathersAuthenticationLocal2 = _interopRequireDefault(_feathersAuthenticationLocal);

var _feathersAuthenticationOauth = require('feathers-authentication-oauth2');

var _feathersAuthenticationOauth2 = _interopRequireDefault(_feathersAuthenticationOauth);

var _passportGithub = require('passport-github');

var _passportGithub2 = _interopRequireDefault(_passportGithub);

var _passportGoogleOauth = require('passport-google-oauth20');

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _db = require('./db');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('kalisio:kCore');

function auth() {
  var app = this;
  var config = app.get('authentication');

  // Set up authentication with the secret
  app.configure((0, _feathersAuthentication2.default)(config));
  app.configure((0, _feathersAuthenticationJwt2.default)());
  app.configure((0, _feathersAuthenticationLocal2.default)());
  app.configure((0, _feathersAuthenticationOauth2.default)({
    name: 'github',
    Strategy: _passportGithub2.default
  }));
  app.configure((0, _feathersAuthenticationOauth2.default)({
    name: 'google',
    Strategy: _passportGoogleOauth2.default
  }));
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.getService('authentication').hooks({
    before: {
      create: [_feathersAuthentication2.default.hooks.authenticate(config.strategies)],
      remove: [_feathersAuthentication2.default.hooks.authenticate('jwt')]
    }
  });
}

function declareService(name, app, service) {
  var path = app.get('apiPath') + '/' + name;
  // Initialize our service
  app.use(path, service);

  debug(name + ' service declared on path ' + path);

  return app.getService(name);
}

function configureService(name, service, servicesPath) {
  try {
    var _hooks = require(_path2.default.join(servicesPath, name, name + '.hooks'));
    service.hooks(_hooks);
    debug(name + ' service hooks configured');
  } catch (error) {
    // As this is optionnal this require has to fail silently
  }

  if (service.filter) {
    try {
      var filters = require(_path2.default.join(servicesPath, name, name + '.filters'));
      service.filter(filters);
      debug(name + ' service filters configured');
    } catch (error) {
      // As this is optionnal this require has to fail silently
    }
  }

  return service;
}

function createProxyService(options) {
  var targetService = options.service;
  function proxy(params) {
    if (options.params) {
      var proxyParams = void 0;
      if (options.params === 'function') {
        proxyParams = options.params(params);
      } else {
        proxyParams = (0, _feathersCommons.merge)(params, options.params);
      }
      return proxyParams;
    } else return params;
  }
  return {
    find: function find(params) {
      return targetService.find(proxy(params));
    },
    get: function get(id, params) {
      return targetService.get(id, proxy(params));
    },
    create: function create(data, params) {
      return targetService.create(data, proxy(params));
    },
    update: function update(id, data, params) {
      return targetService.update(id, data, proxy(params));
    },
    patch: function patch(id, data, params) {
      return targetService.patch(id, data, proxy(params));
    },
    remove: function remove(id, params) {
      return targetService.remove(id, proxy(params));
    }
  };
}

function createService(name, app, options) {
  var createFeathersService = require('feathers-' + app.db.adapter);

  var paginate = app.get('paginate');
  var serviceOptions = Object.assign({
    name: name,
    paginate: paginate
  }, options || {});
  // For DB services a model has to be provided
  var dbService = true;
  try {
    var configureModel = require(_path2.default.join(options.modelsPath, name + '.model.' + app.db.adapter));
    configureModel(app, serviceOptions);
  } catch (error) {
    // As this is optionnal this require has to fail silently
    dbService = false;
  }

  // Initialize our service with any options it requires
  var service = void 0;
  if (dbService) {
    service = createFeathersService(serviceOptions);
  } else if (options.proxy) {
    service = createProxyService(options.proxy);
  } else {
    // Otherwise we expect the service to be provided as a Feathers service interface
    service = require(_path2.default.join(options.servicesPath, name, name + '.service'));
    // If we get a function try to call it assuming it will return the service object
    if (typeof service === 'function') {
      service = service(name, app, options);
    }
  }

  // Get our initialized service so that we can register hooks and filters
  service = declareService(options.path || name, app, service);
  // Register hooks and filters
  service = configureService(name, service, options.servicesPath);
  // Optionnally a specific service mixin can be provided, apply it
  if (dbService) {
    try {
      var serviceMixin = require(_path2.default.join(options.servicesPath, name, name + '.service'));
      service.mixin(serviceMixin);
    } catch (error) {
      // As this is optionnal this require has to fail silently
    }
  }
  // Then configuration
  service.name = name;
  service.app = app;
  if (options) {
    service.perspectives = options.perspectives;
  }

  debug(service.name + ' service registration completed');

  return service;
}

function setupLogger(logsConfig) {
  // Remove winston defaults
  try {
    _winston2.default.remove(_winston2.default.transports.Console);
  } catch (error) {}
  // We have one entry per log type
  var logsTypes = logsConfig ? Object.getOwnPropertyNames(logsConfig) : [];
  // Create corresponding winston transports with options
  logsTypes.forEach(function (logType) {
    var options = logsConfig[logType];
    // Setup default log level if not defined
    if (!options.level) {
      options.level = process.env.ENV === 'development' ? 'debug' : 'info';
    }
    try {
      _winston2.default.add(_winston2.default.transports[logType], options);
    } catch (error) {}
  });
}

function kalisio() {
  var app = (0, _feathers2.default)();
  // Load app configuration first
  app.configure((0, _feathersConfiguration2.default)());
  // Then setup logger
  setupLogger(app.get('logs'));

  // This avoid managing the API path before each service name
  app.getService = function (path, context) {
    // Context is given as string ID
    if (typeof context === 'string') {
      return app.service(app.get('apiPath') + '/' + context + '/' + path);
    } else if ((typeof context === 'undefined' ? 'undefined' : (0, _typeof3.default)(context)) === 'object') {
      return app.service(app.get('apiPath') + '/' + context._id + '/' + path);
    } else {
      return app.service(app.get('apiPath') + '/' + path);
    }
  };
  // This is used to add hooks/filters to services
  app.configureService = function (name, service, servicesPath) {
    return configureService(name, service, servicesPath);
  };
  // This is used to create standard services
  app.createService = function (name, options) {
    return createService(name, app, options);
  };
  // Override Feathers configure that do not manage async operations,
  // here we also simply call the function given as parameter but await for it
  app.configure = async function (fn) {
    await fn.call(this);
    return this;
  };

  // Enable CORS, security, compression, and body parsing
  app.use((0, _cors2.default)());
  app.use((0, _helmet2.default)());
  app.use((0, _compression2.default)());
  app.use(_bodyParser2.default.json());
  app.use(_bodyParser2.default.urlencoded({ extended: true }));

  // Set up plugins and providers
  app.configure((0, _feathersHooks2.default)());
  app.configure((0, _feathersRest2.default)());
  app.configure((0, _feathersSocketio2.default)({
    path: app.get('apiPath') + 'ws'
  }));

  app.configure(auth);

  // Initialize DB
  app.db = _db.Database.create(app);

  return app;
}
//# sourceMappingURL=application.js.map