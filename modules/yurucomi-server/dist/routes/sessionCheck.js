"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _debug2 = _interopRequireDefault(require("debug"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express.default.Router();

var debug = (0, _debug2.default)("server:router/sessionCheck");
router.get("/",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    if (req.session) {
      if (req.session.userName) {
        debug("session name:".concat(req.session.userName));
        var response = yield _axios.default.get("https://scrapbox.io/api/pages/yurucomi");
        var userList = response.data.pages.map(function (ele) {
          return ele.title.toLowerCase();
        });
        var index = userList.findIndex(function (ele) {
          if (req.session) {
            return ele === req.session.userName;
          }

          return false;
        });

        if (index >= 0) {
          res.json({
            result: true,
            name: req.session.userName,
            icon: response.data.pages[index].image
          });
        } else {
          debug("no such user");
          res.json({
            result: false,
            name: null
          });
        }
      } else {
        debug("no session");
        res.json({
          result: false,
          name: null
        });
      }
    } else {
      debug("no session");
      res.json({
        result: false,
        name: null
      });
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;
//# sourceMappingURL=sessionCheck.js.map