"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _userSettings = _interopRequireDefault(require("./userSettings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var checkMatchUsers = function checkMatchUsers(data) {
  var Users = [];

  for (var user in _userSettings.default[data._where]) {
    var _loop = function _loop(prop) {
      if (_userSettings.default[data._where][user].hasOwnProperty(prop)) {
        var matched = _userSettings.default[data._where][user][prop].find(function (ele) {
          return ele.value === data._payload[prop];
        });

        if (matched) {
          Users.push(user);
        }
      }
    };

    for (var prop in data._payload) {
      _loop(prop);
    }
  }

  return Users;
};

var _default = checkMatchUsers;
exports.default = _default;
//# sourceMappingURL=checkMatchUsers.js.map