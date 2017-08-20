var path = require('path')
var containerized = require('containerized')()

var API_PREFIX = '/api'

module.exports = {
  port: process.env.PORT || 8081,

  apiPath: API_PREFIX,

  host: 'localhost',
  paginate: {
    default: 10,
    max: 50
  },
  authentication: {
    secret: 'b5KqXTye4fVxhGFpwMVZRO3R56wS5LNoJHifwgGOFkB5GfMWvIdrWyQxEJXswhAC',
    strategies: [
      'jwt',
      'local'
    ],
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users',
    github: {
      clientID: '157fe8bd095367192168',
      clientSecret: '5dd578eb36bf00d0c7c8dbee6ea36d44529d97cf'
    },
    google: {
      clientID: '761859104517-4j6qul9rds52immbhm0ggrq2jbb4fvqk.apps.googleusercontent.com',
      clientSecret: 'a03PrspLJLIUqnJ7ANtLgutd'
    }
  },
  logs: {
    Console: {
      colorize: true,
      level: 'verbose'
    },
    DailyRotateFile: {
      filename: path.join(__dirname, '..', 'test-log-'),
      datePattern: 'yyyy-MM-dd.log'
    }
  },
  db: {
    adapter: 'mongodb',
    url: (containerized ? 'mongodb://mongodb:27017/kalisio-test' : 'mongodb://127.0.0.1:27017/kalisio-test')
  }
}
