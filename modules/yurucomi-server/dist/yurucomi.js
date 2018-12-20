"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _linda = _interopRequireDefault(require("../linda"));

var _settingUpdater = _interopRequireDefault(require("./settingUpdater"));

var _checkMatchUsers = _interopRequireDefault(require("./checkMatchUsers"));

var _eventEmitter = _interopRequireDefault(require("./eventEmitter"));

var _getUserIcon = _interopRequireDefault(require("./getUserIcon"));

var _mergeLocalSettingsData = _interopRequireDefault(require("./mergeLocalSettingsData"));

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
    this.linda = new _linda.default();
  }
  /*
  connct関数を作りたい
  lindaとyurucomiの各メソッドを繋げる
  */


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
      this.linda.tupleSpace(writeOperation.tsName).write(writeOperation,
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(function* (res) {
          (0, _settingUpdater.default)(res);
          callback(res);
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      }());
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
        socket.on("_local_settings", function (data) {
          console.log("data", data);
          (0, _mergeLocalSettingsData.default)(data);
        });
        socket.on("_watch_operation", function (data) {
          var lindaWtachOperation = Object.assign(data, {
            payload: {}
          });

          _eventEmitter.default.on("setting_updated", function (settings) {
            if (settings.who === socket.request.session.userName) {
              socket.emit("_setting_update", settings);
            }
          });

          _this.watch(lindaWtachOperation,
          /*#__PURE__*/
          function () {
            var _ref3 = _asyncToGenerator(function* (resData) {
              var icon = yield (0, _getUserIcon.default)(resData._where, resData._from);
              var returnData = Object.assign(resData, {
                _fromIcon: icon
              });
              var matchedUsers = yield (0, _checkMatchUsers.default)(resData);

              if (matchedUsers.includes(socket.request.session.userName)) {
                socket.emit("_new_event", returnData);
              }
            });

            return function (_x3) {
              return _ref3.apply(this, arguments);
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