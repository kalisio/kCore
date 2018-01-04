import path from 'path'
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

export function createTagService (context, db) {
  const app = this

  app.createService('tags', {
    servicesPath,
    modelsPath,
    path: context._id.toString() + '/tags',
    db
  })
}

export function removeTagService (context) {
  // TODO
}

export default async function () {
  const app = this
  const config = app.get('authentication')
  let perspectives = ['profile']
  // Add OAuth2 provider perspectives only when required
  if (config.google) perspectives.push('google')
  if (config.github) perspectives.push('github')
  app.createService('users', {
    modelsPath,
    servicesPath,
    perspectives
  })
  app.createService('authorisations', { servicesPath })
  // We have a global tag service and one by context if app requires it
  app.createService('tags', { modelsPath, servicesPath })
}
