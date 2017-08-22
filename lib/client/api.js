'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.kalisio = kalisio;

var _loglevel = require('loglevel');

var _loglevel2 = _interopRequireDefault(_loglevel);

var _feathersClient = require('feathers-client');

var _feathersClient2 = _interopRequireDefault(_feathersClient);

var _feathersHooks = require('feathers-hooks');

var _feathersHooks2 = _interopRequireDefault(_feathersHooks);

var _socket = require('socket.io-client');

var _socket2 = _interopRequireDefault(_socket);

var _feathersReactive = require('feathers-reactive');

var _feathersReactive2 = _interopRequireDefault(_feathersReactive);

var _rxjs = require('rxjs');

var _rxjs2 = _interopRequireDefault(_rxjs);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function kalisio() {
  var api = (0, _feathersClient2.default)();
  // Setup log level
  if (_config2.default.logs && _config2.default.logs.level) {
    _loglevel2.default.setLevel(_config2.default.logs.level, false);
  } else {
    _loglevel2.default.setLevel('info');
  }
  api.configure((0, _feathersHooks2.default)());
  if (_config2.default.transport === 'http') {
    api.configure(_feathersClient2.default.rest(window.location.origin).fetch(window.fetch.bind(window)));
  } else {
    var socket = (0, _socket2.default)(window.location.origin, {
      transports: ['websocket'],
      path: _config2.default.apiPath + 'ws'
    });
    api.configure(_feathersClient2.default.socketio(socket));
  }
  api.configure(_feathersClient2.default.authentication({
    storage: window.localStorage,
    path: _config2.default.apiPath + '/authentication'
  }));
  api.configure((0, _feathersReactive2.default)(_rxjs2.default, {
    idField: '_id'
  }));

  // This avoid managing the API path before each service name
  api.getService = function (path, context) {
    // Context is given as string ID
    if (typeof context === 'string') {
      return api.service(_config2.default.apiPath + '/' + context + '/' + path);
    } else if ((typeof context === 'undefined' ? 'undefined' : (0, _typeof3.default)(context)) === 'object' && context !== null) {
      return api.service(_config2.default.apiPath + '/' + context._id + '/' + path);
    } else {
      return api.service(_config2.default.apiPath + '/' + path);
    }
  };

  api.users = api.getService('users');

  return api;
}