import { populateResource, addTag, removeTag, tagResource, untagResource } from '../../hooks'
import { disallow, iff } from 'feathers-hooks-common'
const { authenticate } = require('feathers-authentication').hooks

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [ disallow() ],
    create: [ populateResource, addTag ],
    update: [ disallow() ],
    patch: [ disallow('external') ],
    // Let the removal of the actual tag object by ID pass without running these hooks
    // Indeed the initial call is used to remove the tag from the resource with the ID of the resource given, not the tag one
    remove: [ iff(hook => hook.params.query && hook.params.query.value && hook.params.query.scope, populateResource, removeTag) ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ tagResource ],
    update: [],
    patch: [],
    // Let the removal of the actual tag object by ID pass without running these hooks
    // Indeed the initial call is used to remove the tag from the resource with the ID of the resource given, not the tag one
    remove: [ iff(hook => hook.params.query && hook.params.query.value && hook.params.query.scope, untagResource) ]
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
