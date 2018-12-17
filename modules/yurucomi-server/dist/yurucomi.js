"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _yurucomiLinda = require("yurucomi-linda");

var _settingUpdater = _interopRequireDefault(require("./settingUpdater"));

var _checkMatchUsers = _interopRequireDefault(require("./checkMatchUsers"));

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var debug = (0, _debug2.default)("linda-connector");

var Yurucomi =
/*#__PURE__*/
function () {
  function Yurucomi(io) {
    _classCallCheck(this, Yurucomi);

    _defineProperty(this, "io", void 0);

    _defineProperty(this, "linda", void 0);

    this.io = io;
    this.linda = new _yurucomiLinda.Linda();
  }

  _createClass(Yurucomi, [{
    key: "watch",
    value: function watch(watchOperation, callback) {
      this.linda.tupleSpace(watchOperation.tsName).watch(watchOperation,
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(function* (res) {
          callback(res);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "write",
    value: function write(writeOperation, callback) {
      this.linda.tupleSpace(writeOperation.tsName).write(writeOperation, function (res) {
        callback(res);
      });
    }
  }, {
    key: "read",
    value: function read(readOperation, callback) {
      this.linda.tupleSpace(readOperation.tsName).read(readOperation, function (res) {
        callback(res);
      });
    }
  }, {
    key: "listen",
    value: function listen() {
      var _this = this;

      this.io.on("connection", function (socket) {
        debug("linda listenning");
        socket.on("_read_operation", function (data) {
          _this.read(data, function (resData) {
            socket.emit("_read_response", resData);
          });
        });
        socket.on("_write_operation", function (data) {
          _this.write(data, function (resData) {
            socket.emit("_write_response", resData);
          });
        });
        socket.on("_watch_operation", function (data) {
          _this.watch(data,
          /*#__PURE__*/
          function () {
            var _ref2 = _asyncToGenerator(function* (resData) {
              if (resData._from === socket.request.session.userName) {
                var newSettingsData = yield (0, _settingUpdater.default)(resData);
                socket.emit("_settings_update", newSettingsData);
              } else {
                var matchedUsers = yield (0, _checkMatchUsers.default)(resData);

                if (matchedUsers.includes(socket.request.session.userName)) {
                  socket.emit("_new_events", resData);
                }
              }
            });

            return function (_x2) {
              return _ref2.apply(this, arguments);
            };
          }());
        });
      });
    }
  }]);

  return Yurucomi;
}();

exports.default = Yurucomi;
//# sourceMappingURL=yurucomi.js.map