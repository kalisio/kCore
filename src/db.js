import _ from 'lodash'
import logger from 'winston'
import moment from 'moment'
import makeDebug from 'debug'
import mongodb, { ObjectID } from 'mongodb'
import errors from 'feathers-errors'

const debug = makeDebug('kalisio:kCore:db')

// This ensure moment objects are correctly serialized in MongoDB
Object.getPrototypeOf(moment()).toBSON = function () {
  return this.toDate()
}

export function isObjectID (id) {
  return id && (typeof id.toHexString === 'function') && (typeof id.getTimestamp === 'function')
}

export function createObjectID (id) {
  // This ensure it works even if id is already an ObjectID
  if (isObjectID(id)) return id
  else if (!ObjectID.isValid(id)) return null
  else return new ObjectID(id)
}

// Utility function used to convert from string to MongoDB IDs as required eg by queries
export function objectifyIDs (object) {
  _.forOwn(object, (value, key) => {
    // Process current attributes or recurse
    // Take care to nested fields like 'field._id'
    if (key === '_id' || key.endsWith('._id')) {
      if (typeof value === 'string') {
        debug('Objectify ID ' + key)
        const id = createObjectID(value)
        if (id) {
          object[key] = id
        }
      } else if (Array.isArray(value)) {
        debug('Objectify ID array ' + key)
        object[key] = value.map(id => createObjectID(id)).filter(id => id)
      } else if ((typeof value === 'object') && !isObjectID(value)) objectifyIDs(value) // Avoid jumping inside an already transformed ObjectID
    } else if (['$in', '$nin'].includes(key)) {
      debug('Objectify ID array ' + key)
      object[key] = value.map(id => createObjectID(id)).filter(id => id)
    } else if (key === '$or') {
      value.forEach(entry => objectifyIDs(entry))
      // Avoid jumping inside an already transformed ObjectID
    } else if ((typeof value === 'object') && !isObjectID(value)) {
      objectifyIDs(value)
    }
  })
  return object
}

// Utility function used to convert from string to MongoDB IDs a fixed set of properties on a given object
export function toObjectIDs (object, properties) {
  properties.forEach(property => {
    const id = createObjectID(_.get(object, property))
    if (id) {
      _.set(object, property, id)
    }
  })
}

export class Database {
  constructor (app) {
    try {
      this.app = app
      this._adapter = app.get('db').adapter
    } catch (error) {
      throw new errors.GeneralError('Cannot find database adapter configuration in application')
    }
    this._collections = new Map()
  }

  get adapter () {
    return this._adapter
  }

  async connect () {
    // Default implementation
    return null
  }

  static create (app) {
    switch (app.get('db').adapter) {
      case 'mongodb':
      default:
        return new MongoDatabase(app)
    }
  }
}

export class MongoDatabase extends Database {
  constructor (app) {
    super(app)
    try {
      this._dbUrl = app.get('db').url
    } catch (error) {
      throw new errors.GeneralError('Cannot find database connection URL in application')
    }
  }

  async connect () {
    try {
      this._db = await mongodb.connect(this._dbUrl)
      debug('Connected to DB ' + this.app.get('db').adapter)
      return this._db
    } catch (error) {
      logger.error('Could not connect to ' + this.app.get('db').adapter + ' database, please check your configuration')
      throw error
    }
  }

  get instance () {
    return this._db
  }

  collection (name) {
    // Initializes the `collection` on sublevel `collection`
    if (!this._collections.has(name)) {
      this._collections.set(name, this._db.collection(name))
    }
    return this._collections.get(name)
  }
}
