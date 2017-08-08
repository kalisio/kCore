'use strict';

var _hooks = require('../../hooks');

var authenticate = require('feathers-authentication').hooks.authenticate;

var hashPassword = require('feathers-authentication-local').hooks.hashPassword;

var commonHooks = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [(0, _hooks.processUserProfile)('github', { email: 'profile.emails[0].value', name: 'profile.displayName' }), (0, _hooks.processUserProfile)('google', { email: 'profile.emails[0].value', name: 'profile.displayName' }), hashPassword()],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [commonHooks.when(function (hook) {
      return hook.params.provider;
    }, commonHooks.discard('password')), _hooks.processPerspectives],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};