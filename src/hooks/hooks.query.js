import moment from 'moment'
import _ from 'lodash'
import { ObjectID } from 'mongodb'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:query:hooks')

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
          queryObject[key] = date.toDate()
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

export function populateObject (options) {
  return function (hook) {
    let app = hook.app
    let data = hook.data
    let params = hook.params
    let query = params.query
    const context = hook.service.context
    const idProperty = options.nameIdAs || options.idField
    const serviceProperty = options.nameServiceAs || options.serviceField

    // Check if not already done
    if (typeof _.get(params, idProperty) === 'object') {
      debug(`Skipping populating ${idProperty} as already done`)
      return Promise.resolve(hook)
    }
    if (typeof _.get(params, serviceProperty) === 'object') {
      debug(`Skipping populating ${serviceProperty} as already done`)
      return Promise.resolve(hook)
    }

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    let service = _.get(data, options.serviceField) || _.get(query, options.serviceField)
    if (typeof service === 'string') {
      const message = `Cannot find the service for ${options.serviceField} = ${service} to dynamically populate.`
      service = app.getService(service, context)
      if (!service) {
        if (options.throwOnNotFound) throw new Error(message)
        else return Promise.resolve(hook)
      }
    } else if (!service) {
      if (options.throwOnNotFound) throw new Error(`No ${options.serviceField} given to dynamically populate.`)
      else return Promise.resolve(hook)
    }
    // Then the object ID
    let id = _.get(data, options.idField) || _.get(query, options.idField) || _.get(hook, 'id')
    if (!id) {
      if (options.throwOnNotFound) throw new Error(`Cannot find the ${options.idField} to dynamically populate.`)
      else return Promise.resolve(hook)
    }

    debug(`Populating ${idProperty} with ID ${id}`)
    // Set the retrieved service on the same field or given one in hook params
    _.set(params, serviceProperty, service)
    // Let it work with id string or real object
    if (typeof id === 'string' || ObjectID.isValid(id)) {
      return service.get(id.toString(), { user: hook.params.user }).then(object => {
        if (!object) {
          if (options.throwOnNotFound) throw new Error(`Cannot find object with id ${id} to dynamically populate.`)
          else return hook
        }
        // Set the retrieved object on the same field or given one in hook params
        _.set(params, idProperty, object)
        return hook
      })
    } else {
      // Set the object on the same field or given one in hook params
      _.set(params, idProperty, id)
      return Promise.resolve(hook)
    }
  }
}

export function populateObjects (options) {
  return function (hook) {
    let app = hook.app
    let data = hook.data
    let params = hook.params
    let query = params.query
    const context = hook.service.context
    const idProperty = options.nameIdAs || options.idField
    const serviceProperty = options.nameServiceAs || options.serviceField

    // Check if not already done
    if (Array.isArray(_.get(params, idProperty))) {
      debug(`Skipping populating ${idProperty} as already done`)
      return Promise.resolve(hook)
    }
    if (typeof _.get(params, serviceProperty) === 'object') {
      debug(`Skipping populating ${serviceProperty} as already done`)
      return Promise.resolve(hook)
    }

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    let service = _.get(data, options.serviceField) || _.get(query, options.serviceField)
    if (typeof service === 'string') {
      const message = `Cannot find the service for ${options.serviceField} = ${service} to dynamically populate.`
      service = app.getService(service, context)
      if (!service) {
        if (options.throwOnNotFound) throw new Error(message)
        else return Promise.resolve(hook)
      }
    } else if (!service) {
      if (options.throwOnNotFound) throw new Error(`No ${options.serviceField} given to dynamically populate.`)
      else return Promise.resolve(hook)
    }

    // Set the retrieved service on the same field or given one in hook params
    _.set(params, serviceProperty, service)

    // Then the object ID
    let id = _.get(data, options.idField) || _.get(query, options.idField)
    // If no ID given we perform a find, no pagination to be sure we get all objects
    if (!id) {
      debug(`Populating ${idProperty}`)
      return service.find({ query: {}, paginate: false, user: hook.params.user }).then(objects => {
        // Set the retrieved objects on the same field or given one in hook params
        debug(`Populated ${objects.length} ${idProperty}`)
        _.set(params, idProperty, objects)
        return hook
      })
    } else {
      debug(`Populating ${idProperty} with ID ${id}`)
      // Let it work with id string or real object
      if (typeof id === 'string' || ObjectID.isValid(id)) {
        return service.get(id.toString(), { user: hook.params.user }).then(object => {
          if (!object) {
            if (options.throwOnNotFound) throw new Error(`Cannot find ${options.idField} = ${id} to dynamically populate.`)
            else return hook
          }
          // Set the retrieved object on the same field or given one in hook params
          _.set(params, idProperty, [object])
          return hook
        })
      } else {
        // Set the object on the same field or given one in hook params
        _.set(params, idProperty, [id])
        return Promise.resolve(hook)
      }
    }
  }
}
