'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emit = emit;

var _quasar = require('quasar');

function emit(hook) {
  _quasar.Events.$emit(hook.type + '-hook', hook);
}
//# sourceMappingURL=events.js.map