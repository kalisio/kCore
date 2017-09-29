import { serialize, updateTags } from '../../hooks'
const { authenticate } = require('feathers-authentication').hooks
const { hashPassword } = require('feathers-authentication-local').hooks
const commonHooks = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      updateTags,
      serialize([
        {source: 'github.profile.displayName', target: 'name'},
        {source: 'github.profile.emails[0].value', target: 'email'},
        {source: 'google.profile.displayName', target: 'name'},
        {source: 'google.profile.emails[0].value', target: 'email'},
        {source: 'name', target: 'profile.name', delete: true},
        {source: 'email', target: 'profile.description'}
      ]),
      hashPassword()
    ],
    update: [ authenticate('jwt'), updateTags ],
    patch: [ authenticate('jwt'), updateTags ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      commonHooks.when(hook => hook.params.provider, commonHooks.discard('password')),
      serialize([
        {source: 'profile.name', target: 'name'},
        {source: 'profile.description', target: 'description'}
      ])
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [ updateTags ]
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
}
