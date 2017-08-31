module.exports = function (app, options) {
  options.Model = app.db.collection('tags')
  options.Model.ensureIndex({ value: 1 }, { unique: true })
  options.Model.ensureIndex({ scope: 1 })
}
