import moment from 'moment'
import _ from 'lodash'
import { ObjectID } from 'mongodb'
// import makeDebug from 'debug'

// const debug = makeDebug('kalisio:kCore')

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

export function populateObject (serviceField, idField, nameServiceAs, nameIdAs) {
  return function (hook) {
    let app = hook.app
    let data = hook.data
    let params = hook.params
    let query = params.query

    // Check if not already done
    if (typeof _.get(params, nameIdAs || idField) === 'object') return Promise.resolve(hook)
    if (typeof _.get(params, nameServiceAs || serviceField) === 'object') return Promise.resolve(hook)

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    let service = _.get(data, serviceField) || _.get(query, serviceField)
    if (typeof service === 'string') {
      const message = `Cannot find the service for ${serviceField} = ${service} to dynamically populate.`
      service = app.getService(service)
      if (!service) {
        throw new Error(message)
      }
    } else if (!service) {
      throw new Error(`No ${serviceField} given to dynamically populate.`)
    }
    // Then the object ID
    let id = _.get(data, idField) || _.get(query, idField) || _.get(hook, 'id')
    if (!id) {
      throw new Error(`Cannot find the ${idField} to dynamically populate.`)
    }

    // Set the retrieved service on the same field or given one in hook params
    _.set(params, nameServiceAs || serviceField, service)
    // Let it work with id string or real object
    if (typeof id === 'string' || ObjectID.isValid(id)) {
      return service.get(id.toString(), { user: hook.params.user }).then(object => {
        if (!object) {
          throw new Error(`Cannot find object with id ${id} to dynamically populate.`)
        }
        // Set the retrieved object on the same field or given one in hook params
        _.set(params, nameIdAs || idField, object)
        return hook
      })
    } else {
      // Set the object on the same field or given one in hook params
      _.set(params, nameIdAs || idField, id)
      return Promise.resolve(hook)
    }
  }
}

export function populateObjects (serviceField, idField, nameServiceAs, nameIdAs) {
  return function (hook) {
    let app = hook.app
    let data = hook.data
    let params = hook.params
    let query = params.query

    // Check if not already done
    if (Array.isArray(_.get(params, nameIdAs || idField))) return Promise.resolve(hook)
    if (typeof _.get(params, nameServiceAs || serviceField) === 'object') return Promise.resolve(hook)

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    let service = _.get(data, serviceField) || _.get(query, serviceField)
    if (typeof service === 'string') {
      const message = `Cannot find the service for ${serviceField} = ${service} to dynamically populate.`
      service = app.getService(service)
      if (!service) {
        throw new Error(message)
      }
    } else if (!service) {
      throw new Error(`No ${serviceField} given to dynamically populate.`)
    }

    // Set the retrieved service on the same field or given one in hook params
    _.set(params, nameServiceAs || serviceField, service)

    // Then the object ID
    let id = _.get(data, idField) || _.get(query, idField) || _.get(hook, 'id')
    // If no ID given we perform a find, no pagination to be sure we get all objects
    if (!id) {
      return service.find({ paginate: false }, { user: hook.params.user }).then(objects => {
        // Set the retrieved objects on the same field or given one in hook params
        _.set(params, nameIdAs || idField, objects)
        return hook
      })
    } else {
      // Let it work with id string or real object
      if (typeof id === 'string' || ObjectID.isValid(id)) {
        return service.get(id.toString(), { user: hook.params.user }).then(object => {
          if (!object) {
            throw new Error(`Cannot find object for ${idField} = ${id} to dynamically populate.`)
          }
          // Set the retrieved object on the same field or given one in hook params
          _.set(params, nameIdAs || idField, [object])
          return hook
        })
      } else {
        // Set the object on the same field or given one in hook params
        _.set(params, nameIdAs || idField, [id])
        return Promise.resolve(hook)
      }
    }
  }
}
