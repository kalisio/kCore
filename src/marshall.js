import moment from 'moment'
import _ from 'lodash'

export function marshallComparisonFields (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallComparisonFields(value)
    } else if ((key === '$lt') || (key === '$lte') || (key === '$gt') || (key === '$gte')) {
      let number = _.toNumber(value)
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number
      } else {
        // try for dates as well
        let date = moment.utc(value)
        if (date.isValid()) {
          queryObject[key] = date.toDate()
        }
      }
    }
  })
}

// Helper function to convert time objects or array of time objects
export function marshallTime (item, property) {
  if (!item) return
  const time = item[property]
  if (!time) return
  if (Array.isArray(time)) {
    item[property] = time.map(t => {
      if (moment.isMoment(t)) return new Date(t.format())
      else if (typeof t === 'string') return new Date(t)
      else return t
    })
  } else if (moment.isMoment(time)) {
    item[property] = new Date(time.format())
  } else if (typeof time === 'string') {
    item[property] = new Date(time)
  } else if (typeof time === 'object') { // Check if complex object such as comparison operator
    // If so this will recurse
    _.keys(time).forEach(key => marshallTime(time, key))
  }
}

// Helper function to convert time objects or array of time objects
export function unmarshallTime (item, property) {
  if (!item) return
  const time = item[property]
  if (!time) return
  if (Array.isArray(time)) {
    item[property] = time.map(t => !moment.isMoment(t) ? moment.utc(t.toISOString()) : t)
  } else if (!moment.isMoment(time)) {
    // Check if complex object indexed by element
    const keys = _.keys(time)
    // If so recurse
    if (keys.length > 0) keys.forEach(key => unmarshallTime(time, key))
    else item[property] = moment.utc(time.toISOString())
  }
}
