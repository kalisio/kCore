module.exports = function (app, options) {
  let db = options.db || app.db
  options.Model = db.collection('tags')
  options.Model.ensureIndex({ value: 1 }, { unique: true })
  options.Model.ensureIndex({ scope: 1 })
}
