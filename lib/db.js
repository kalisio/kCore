'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MongoDatabase = exports.Database = undefined;

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Database = exports.Database = function () {
  function Database(app) {
    (0, _classCallCheck3.default)(this, Database);

    try {
      this.app = app;
      this._adapter = app.get('db').adapter;
    } catch (error) {
      throw new _feathersErrors2.default.GeneralError('Cannot find database adapter configuration in application');
    }
    this._collections = new Map();
  }

  (0, _createClass3.default)(Database, [{
    key: 'connect',
    value: async function connect() {
      // Default implementation
      return null;
    }
  }, {
    key: 'adapter',
    get: function get() {
      return this._adapter;
    }
  }], [{
    key: 'create',
    value: function create(app) {
      switch (app.get('db').adapter) {
        case 'mongodb':
        default:
          return new MongoDatabase(app);
      }
    }
  }]);
  return Database;
}();

var MongoDatabase = exports.MongoDatabase = function (_Database) {
  (0, _inherits3.default)(MongoDatabase, _Database);

  function MongoDatabase(app) {
    (0, _classCallCheck3.default)(this, MongoDatabase);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MongoDatabase.__proto__ || Object.getPrototypeOf(MongoDatabase)).call(this, app));

    try {
      _this._dbUrl = app.get('db').url;
    } catch (error) {
      throw new _feathersErrors2.default.GeneralError('Cannot find database connection URL in application');
    }
    return _this;
  }

  (0, _createClass3.default)(MongoDatabase, [{
    key: 'connect',
    value: async function connect() {
      try {
        this._db = await _mongodb2.default.connect(this._dbUrl);
        return this._db;
      } catch (error) {
        _winston2.default.error('Could not connect to ' + this.app.get('db').adapter + ' database, please check your configuration');
      }
    }
  }, {
    key: 'collection',
    value: function collection(name) {
      // Initializes the `collection` on sublevel `collection`
      if (!this._collections.has(name)) {
        this._collections.set(name, this._db.collection(name));
      }
      return this._collections.get(name);
    }
  }, {
    key: 'instance',
    get: function get() {
      return this._db;
    }
  }]);
  return MongoDatabase;
}(Database);