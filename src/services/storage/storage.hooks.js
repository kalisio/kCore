import { getBase64DataURI } from 'dauria'
import { disallow, discard, iff } from 'feathers-hooks-common'
import { populateAttachmentResource, attachToResource, detachFromResource } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [ disallow() ],
    get: [],
    create: [ populateAttachmentResource, (hook) => {
                // If form multipart data transform to data URI for blob service
                if (!hook.data.uri && hook.params.file) {
                  hook.data.uri = getBase64DataURI(hook.params.file.buffer, hook.params.file.mimetype)
                }
                // Makes uploaded files public when required
                if (hook.data.public) hook.params.s3 = { ACL: 'public-read' }
              } ],
    update: [ disallow() ],
    patch: [ disallow() ],
    remove: [ populateAttachmentResource ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Let the attachment on the resource object occur only when resource has been found
    create: [ iff(hook => hook.params.resource, attachToResource), discard('uri'), (hook) => {
                // If form multipart data get filename
                if (hook.params.file) {
                  hook.result.name = hook.params.file.originalname
                }
              } ],
    update: [],
    patch: [],
    // Let the detachment on the resource object occur only when resource has been found
    remove: [ iff(hook => hook.params.resource, detachFromResource), discard('uri') ]
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
