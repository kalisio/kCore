import { populateSubjects, populateResource } from '../../hooks'
const { authenticate } = require('feathers-authentication').hooks

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ populateSubjects, populateResource ],
    update: [],
    patch: [],
    remove: [ populateSubjects, populateResource ]
  },

  after: {
    all: [],
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
}
