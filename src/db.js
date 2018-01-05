import lodash from 'lodash'
import logger from 'winston'
import makeDebug from 'debug'
import mongodb, { ObjectID } from 'mongodb'
import errors from 'feathers-errors'

const debug = makeDebug('kalisio:kCore:db')

function isObjectID(id) {
  return (typeof id.toHexString === 'function') && (typeof id.getTimestamp === 'function')
}

function createObjectID(id) {
  // This ensure it works even if id is already an ObjectID
  if (isObjectID(id)) return id
  else return new ObjectID(id)
}

// Utility function used to convert from string to MongoDB IDs as required by queries
export function objectifyIDs (query) {
  lodash.forOwn(query, (value, key) => {
    // Process current attributes or recurse
    // Take care to nested fields like 'field._id'
    if (key === '_id' || key.endsWith('._id')) {
      if (typeof value === 'string') {
        debug('Objectify ID ' + key)
        query[key] = createObjectID(value)
      }
      else if (Array.isArray(value)) {
        debug('Objectify ID array ' + key)
        query[key] = value.map(id => createObjectID(id))
      }
      // Avoid jumping inside an already transformed ObjectID
      else if ((typeof value === 'object') && !isObjectID(value)) objectifyIDs(value)
    } else if (['$in', '$nin'].includes(key)) {
      debug('Objectify ID array ' + key)
      query[key] = value.map(id => createObjectID(id))
    } else if (key === '$or') {
      value.forEach(entry => objectifyIDs(entry))
      // Avoid jumping inside an already transformed ObjectID
    } else if ((typeof value === 'object') && !isObjectID(value)) {
      objectifyIDs(value)
    }
  })
  return query
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
