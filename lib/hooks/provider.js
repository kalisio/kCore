'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processUserProfile = processUserProfile;

var _feathersCommons = require('feathers-commons');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A hook that extract user profile informations from OAuth providers
function processUserProfile(provider, propertyMap) {
  return function (hook) {
    // As an example extract the user email
    if (hook.data.hasOwnProperty(provider)) {
      (0, _feathersCommons.each)(propertyMap, function (value, key) {
        _lodash2.default.set(hook.data, key, _lodash2.default.get(hook.data[provider], value));
      });
    }
  };
}