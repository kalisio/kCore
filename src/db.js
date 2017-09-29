import lodash from 'lodash'
import logger from 'winston'
import mongodb from 'mongodb'
import { ObjectID } from 'mongodb'
import errors from 'feathers-errors'

// Utility function used to convert from string to MongoDB IDs as required by queries
export function objectifyIDs (query) {
  lodash.forOwn(query, (value, key) => {
    // Process current attributes or  recurse
    if (key === '_id') {
      if (typeof value === 'string') query[key] = new ObjectID(value)
      else if (Array.isArray(value)) query[key] = value.map(id => new ObjectID(id))
      else if (typeof value === 'object') objectifyIDs(value)
    } else if (['$in', '$nin'].includes(key)) {
      query[key] = value.map(id => new ObjectID(id))
    } else if (typeof value === 'object') {
      objectifyIDs(value)
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
