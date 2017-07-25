import path from 'path'
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

module.exports = function () {
  const app = this

  app.createService('users', {
    modelsPath,
    servicesPath,
    perspectives: ['profile', 'github', 'google']
  })
}
