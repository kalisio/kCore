'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.marshallComparisonQuery = marshallComparisonQuery;
exports.marshallGeometryQuery = marshallGeometryQuery;
exports.populateObject = populateObject;
exports.populateObjects = populateObjects;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import makeDebug from 'debug'

// const debug = makeDebug('kalisio:kCore')

function marshallComparisonFieldsInQuery(queryObject) {
  _lodash2.default.forOwn(queryObject, function (value, key) {
    // Process current attributes or  recurse
    if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
      marshallComparisonFieldsInQuery(value);
    } else if (key === '$lt' || key === '$lte' || key === '$gt' || key === '$gte') {
      var number = _lodash2.default.toNumber(value);
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number;
      } else {
        // try for dates as well
        var date = _moment2.default.utc(value);
        if (date.isValid()) {
          queryObject[key] = new Date(date.format());
        }
      }
    }
  });
}

function marshallComparisonQuery(hook) {
  var query = hook.params.query;
  if (query) {
    // Complex queries might have nested objects so we call a recursive function to handle this
    marshallComparisonFieldsInQuery(query);
  }
}

function marshallGeometryQuery(hook) {
  var query = hook.params.query;
  if (!query) return;

  if ((0, _typeof3.default)(query.geometry) === 'object') {
    // Geospatial operators begin with $
    var geoOperator = _lodash2.default.keys(query.geometry).find(function (key) {
      return key.startsWith('$');
    });
    geoOperator = query.geometry[geoOperator];
    _lodash2.default.forOwn(geoOperator, function (value, key) {
      // Geospatial parameters begin with $
      if (key.startsWith('$')) {
        // Some target coordinates
        if (!_lodash2.default.isNil(value.coordinates)) {
          value.coordinates = value.coordinates.map(function (coordinate) {
            return _lodash2.default.toNumber(coordinate);
          });
        } else {
          // Other simple values
          geoOperator[key] = _lodash2.default.toNumber(value);
        }
      }
    });
  }
}

function populateObject(serviceField, idField, nameServiceAs, nameIdAs) {
  return function (hook) {
    var app = hook.app;
    var data = hook.data;
    var params = hook.params;
    var query = params.query;

    // Check if not already done
    if ((0, _typeof3.default)(_lodash2.default.get(params, nameIdAs || idField)) === 'object') return Promise.resolve(hook);

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    var service = _lodash2.default.get(data, serviceField) || _lodash2.default.get(query, serviceField);
    if (typeof service === 'string') {
      var message = 'Cannot find the service for ' + serviceField + ' = ' + service + ' to dynamically populate.';
      service = app.getService(service);
      if (!service) {
        throw new Error(message);
      }
    } else if (!service) {
      throw new Error('No ' + serviceField + ' given to dynamically populate.');
    }
    // Then the object ID
    var id = _lodash2.default.get(data, idField) || _lodash2.default.get(query, idField);

    if (!id) {
      throw new Error('Cannot find the ' + idField + ' to dynamically populate.');
    }

    // Set the retrieved service on the same field or given one in hook params
    _lodash2.default.set(params, nameServiceAs || serviceField, service);
    // Let it work with id string or real object
    if (typeof id === 'string') {
      return service.get(id, { user: hook.params.user }).then(function (object) {
        if (!object) {
          throw new Error('Cannot find object with id ' + id + ' to dynamically populate.');
        }
        // Set the retrieved object on the same field or given one in hook params
        _lodash2.default.set(params, nameIdAs || idField, object);
        return hook;
      });
    } else {
      // Set the object on the same field or given one in hook params
      _lodash2.default.set(params, nameIdAs || idField, id);
      return Promise.resolve(hook);
    }
  };
}

function populateObjects(serviceField, idField, nameServiceAs, nameIdAs) {
  return function (hook) {
    var app = hook.app;
    var data = hook.data;
    var params = hook.params;
    var query = params.query;

    // Check if not already done
    if (Array.isArray(_lodash2.default.get(params, nameIdAs || idField))) return Promise.resolve(hook);

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    var service = _lodash2.default.get(data, serviceField) || _lodash2.default.get(query, serviceField);
    if (typeof service === 'string') {
      var message = 'Cannot find the service for ' + serviceField + ' = ' + service + ' to dynamically populate.';
      service = app.getService(service);
      if (!service) {
        throw new Error(message);
      }
    } else if (!service) {
      throw new Error('No ' + serviceField + ' given to dynamically populate.');
    }

    // Set the retrieved service on the same field or given one in hook params
    _lodash2.default.set(params, nameServiceAs || serviceField, service);

    // Then the object ID
    var id = _lodash2.default.get(data, idField) || _lodash2.default.get(query, idField);
    // If no ID given we perform a find, no pagination to be sure we get all objects
    if (!id) {
      return service.find({ paginate: false }, { user: hook.params.user }).then(function (objects) {
        // Set the retrieved objects on the same field or given one in hook params
        _lodash2.default.set(params, nameIdAs || idField, objects);
        return hook;
      });
    } else {
      // Let it work with id string or real object
      if (typeof id === 'string') {
        return service.get(id, { user: hook.params.user }).then(function (object) {
          if (!object) {
            throw new Error('Cannot find object for ' + idField + ' = ' + id + ' to dynamically populate.');
          }
          // Set the retrieved object on the same field or given one in hook params
          _lodash2.default.set(params, nameIdAs || idField, [object]);
          return hook;
        });
      } else {
        // Set the object on the same field or given one in hook params
        _lodash2.default.set(params, nameIdAs || idField, [id]);
        return Promise.resolve(hook);
      }
    }
  };
}
//# sourceMappingURL=query.js.map