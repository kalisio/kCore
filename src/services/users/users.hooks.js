import { serialize, updateAbilities } from '../../hooks'
const { authenticate } = require('feathers-authentication').hooks
const { hashPassword } = require('feathers-authentication-local').hooks
const commonHooks = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      commonHooks.when(hook => hook.data.googleId, serialize([
        {source: 'google.profile.displayName', target: 'name'},
        {source: 'google.profile.emails[0].value', target: 'email'}
      ], { throwOnNotFound: true })),
      commonHooks.when(hook => hook.data.githubId, serialize([
        {source: 'github.profile.displayName', target: 'name'},
        {source: 'github.profile.emails[0].value', target: 'email'}
      ], { throwOnNotFound: true })),
      serialize([
        {source: 'name', target: 'profile.name', delete: true},
        {source: 'email', target: 'profile.description'}
      ], { throwOnNotFound: true }),
      hashPassword()
    ],
    update: [ authenticate('jwt') ],
    patch: [ authenticate('jwt') ],
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
    create: [ updateAbilities ],
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
}
