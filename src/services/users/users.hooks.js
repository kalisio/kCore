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
      serialize( [
        {source: 'github.profile.displayName', target: 'name'}, 
        {source: 'github.profile.emails[0].value', target: 'email'},
        {source: 'google.profile.displayName', target: 'name'}, 
        {source: 'google.profile.emails[0].value', target: 'email'},
      ] ),
      serialize( [
        {source: 'name', target: 'profile.name'}, 
        {source: 'email', target: 'description'},
        {source: 'email', target: 'profile.email'}
      ] ),
      hashPassword()
    ],
    update: [ authenticate('jwt'), updateTags ],
    patch: [ authenticate('jwt'), updateTags ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ commonHooks.when(hook => hook.params.provider, commonHooks.discard('password')) ],
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
