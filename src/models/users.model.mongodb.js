module.exports = function (app, options) {
  options.Model = app.db.collection('users')
  options.Model.ensureIndex({ email: 1 }, { unique: true })
  options.Model.ensureIndex({ 'profile.name': 1 })
  // Inactive user account might expire at a given date
  options.Model.ensureIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
}
