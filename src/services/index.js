import path from 'path'
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

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
  return (id) => (typeof context === 'object' ? context._id.toString() + '/' + id : context + '/' + id)
}

export function createStorageService (context, blobService) {
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
    }
  })
}

export function removeStorageService (context) {
  // TODO
}

export default async function () {
  const app = this

  app.createService('users', {
    modelsPath,
    servicesPath,
    // Add required OAuth2 provider perspectives
    perspectives: ['profile'].concat(app.authenticationProviders)
  })
  app.createService('authorisations', { servicesPath })
  // We have a global tag service and one by context if app requires it
  app.createService('tags', { modelsPath, servicesPath })
}
