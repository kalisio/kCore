import moment from 'moment'
import _ from 'lodash'
// import makeDebug from 'debug'

// const debug = makeDebug('kaelia:kCore')

function marshallComparisonFieldsInQuery (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallComparisonFieldsInQuery(value)
    } else if ((key === '$lt') || (key === '$lte') || (key === '$gt') || (key === '$gte')) {
      let number = _.toNumber(value)
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number
      } else {
        // try for dates as well
        let date = moment.utc(value)
        if (date.isValid()) {
          queryObject[key] = new Date(date.format())
        }
      }
    }
  })
}

export function marshallComparisonQuery (hook) {
  let query = hook.params.query
  if (query) {
    // Complex queries might have nested objects so we call a recursive function to handle this
    marshallComparisonFieldsInQuery(query)
  }
}

export function marshallGeometryQuery (hook) {
  let query = hook.params.query
  if (!query) return

  if (typeof query.geometry === 'object') {
    // Geospatial operators begin with $
    let geoOperator = _.keys(query.geometry).find(key => key.startsWith('$'))
    geoOperator = query.geometry[geoOperator]
    _.forOwn(geoOperator, (value, key) => {
      // Geospatial parameters begin with $
      if (key.startsWith('$')) {
        // Some target coordinates
        if (!_.isNil(value.coordinates)) {
          value.coordinates = value.coordinates.map(coordinate => _.toNumber(coordinate))
        } else {
          // Other simple values
          geoOperator[key] = _.toNumber(value)
        }
      }
    })
  }
}
