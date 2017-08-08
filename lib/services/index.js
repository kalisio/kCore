'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelsPath = _path2.default.join(__dirname, '..', 'models');
var servicesPath = _path2.default.join(__dirname, '..', 'services');

module.exports = async function () {
  var app = this;

  app.createService('users', {
    modelsPath: modelsPath,
    servicesPath: servicesPath,
    perspectives: ['profile', 'github', 'google']
  });
};