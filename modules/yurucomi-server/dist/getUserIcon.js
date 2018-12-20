"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getUserIcon =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (tsName, userName) {
    var url = "https://scrapbox.io/api/pages/yurucomi/".concat(encodeURI(userName));

    try {
      var response = yield _axios.default.get(url);
      return response.data.image;
    } catch (e) {
      return "./images/unknown.png";
    }
  });

  return function getUserIcon(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = getUserIcon;
exports.default = _default;
//# sourceMappingURL=getUserIcon.js.map