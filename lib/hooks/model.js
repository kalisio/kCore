'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processPerspectives = processPerspectives;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _feathersHooksCommon = require('feathers-hooks-common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import makeDebug from 'debug'

// const debug = makeDebug('kaelia:kCore')

function processPerspectives(hook) {
  var params = hook.params;
  var query = params.query;
  var service = hook.service;

  // Test if some perspectives are defined on the model
  if (!service.perspectives) return;

  // Iterate through known perspectives of the model
  service.perspectives.forEach(function (perspective) {
    // Only discard if not explicitely asked by $select
    if (_lodash2.default.isNil(query) || _lodash2.default.isNil(query.$select) || !query.$select.includes(perspective)) {
      (0, _feathersHooksCommon.discard)(perspective)(hook);
    }
  });
}
//# sourceMappingURL=model.js.map