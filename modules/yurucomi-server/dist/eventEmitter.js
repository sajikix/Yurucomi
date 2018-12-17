"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventemitter = require("eventemitter2");

var emitter = new _eventemitter.EventEmitter2({
  wildcard: true,
  delimiter: "::",
  newListener: false,
  maxListeners: 20,
  verboseMemoryLeak: false
});
var _default = emitter;
exports.default = _default;
//# sourceMappingURL=eventEmitter.js.map