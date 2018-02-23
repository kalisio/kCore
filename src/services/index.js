import path from 'path'
import makeDebug from 'debug'
import multer from 'multer'
import aws from 'aws-sdk'
import store from 's3-blob-store'
import BlobService from 'feathers-blob'
const multipart = multer().single('file')
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kalisio:kCore:services')

export function createTagService (context, db) {
  const app = this

  app.createService('tags', {
    servicesPath,
    modelsPath,
    context,
    db
  })
}

export function removeTagService (context) {
  // TODO
}

function proxyStorageId (context) {
  return (id) => (context ? (typeof context === 'object' ? context._id.toString() + '/' + id : context + '/' + id) : id)
}

export function createStorageService (blobService, context) {
  const app = this

  app.createService('storage', {
    servicesPath,
    modelsPath,
    context,
    // Create a proxy on top of a Feathers blob service, adding context as prefix on all keys
    proxy: {
      service: blobService,
      id: proxyStorageId(context),
      data: (data) => (data.id ? Object.assign(data, { id: proxyStorageId(context)(data.id) }) : data)
    },
    // Add required middlewares to handle multipart form data
    middlewares: {
      before: [
        multipart,
        (req, res, next) => {
          req.feathers.file = req.file
          next()
        }
      ]
    }
  })
}

export function removeStorageService (context) {
  // TODO
}

export default async function () {
  const app = this
  const config = app.get('storage')
  const client = new aws.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  })
  const bucket = config.bucket
  debug('S3 core storage client created with config ', config)

  app.createService('users', {
    modelsPath,
    servicesPath,
    // Add required OAuth2 provider perspectives
    perspectives: ['profile'].concat(app.authenticationProviders)
  })
  app.createService('authorisations', { servicesPath })
  // We have a global tag/storage service and one by context if app requires it
  app.createService('tags', { modelsPath, servicesPath })
  const blobStore = store({ client, bucket })
  const blobService = BlobService({ Model: blobStore, id: '_id' })
  createStorageService.call(app, blobService)
}
