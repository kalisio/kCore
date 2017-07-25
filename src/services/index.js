import path from 'path'

module.exports = function () {
  const app = this

  app.createService('users', path.join(__dirname, '..', 'models'), path.join(__dirname, '..', 'services'), {
    perspectives: ['profile', 'github', 'google']
  })
}
