"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _userSettings = _interopRequireDefault(require("./userSettings"));

var _asearch = _interopRequireDefault(require("asearch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var checkMatchUsers =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (data) {
    // evet発火を制御する部分
    var Users = [];

    for (var user in _userSettings.default[data._where]) {
      var _loop = function _loop(prop) {
        if (_userSettings.default[data._where][user].hasOwnProperty(prop)) {
          var matched = _userSettings.default[data._where][user][prop].find(function (ele) {
            var a = new _asearch.default(ele.value); // return ele.value === data._payload[prop];

            return a.match(data._payload[prop], 1);
          });

          if (matched && data._from !== user) {
            Users.push(user);
          }
        }
      };

      for (var prop in data._payload) {
        _loop(prop);
      }
    }

    return Users;
  });

  return function checkMatchUsers(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = checkMatchUsers;
exports.default = _default;
//# sourceMappingURL=checkMatchUsers.js.map