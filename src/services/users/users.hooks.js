import { serialize, updateAbilities } from '../../hooks'
const { hashPassword } = require('feathers-authentication-local').hooks
const commonHooks = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
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
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      commonHooks.when(hook => hook.params.provider, commonHooks.discard('password')),
      serialize([
        {source: 'profile.name', target: 'name'},
        {source: 'profile.avatar', target: 'avatar'},
        {source: 'profile.description', target: 'description'}
      ])
    ],
    find: [],
    get: [],
    create: [ updateAbilities() ],
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
