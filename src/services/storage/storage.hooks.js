import { getBase64DataURI } from 'dauria'
import { disallow } from 'feathers-hooks-common'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ (hook) => {
                // If form multipart data transform to data URI for blob service
                if (!hook.data.uri && hook.params.file){
                  hook.data.uri = getBase64DataURI(hook.params.file.buffer, hook.params.file.mimetype)
                }
            }],
    update: [],
    patch: [],
    remove: []
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
