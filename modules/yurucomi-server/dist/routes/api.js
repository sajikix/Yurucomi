"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _debug2 = _interopRequireDefault(require("debug"));

var _index = _interopRequireDefault(require("../index"));

var _memoryDB = _interopRequireDefault(require("../../linda/db/memoryDB"));

var _userSettings = _interopRequireDefault(require("../userSettings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = _express.default.Router();

var debug = (0, _debug2.default)("server:router");
router.get("/:tupleSpaceName/:operation",
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (req, res) {
    var yurucomi = _index.default.get("yurucomi");

    switch (req.params.operation) {
      case "read":
        yurucomi.read({
          tsName: req.params.tupleSpaceName,
          payload: req.query
        }, function (data) {
          res.send(data);
        });
        break;

      case "write":
        var from = null;

        if (req.session && req.session.userName) {
          from = req.session.userName;
        }

        if (req.query._from) {
          from = req.query._from;
          delete req.query._from;
        }

        if (from) {
          yurucomi.write({
            payload: req.query,
            tsName: req.params.tupleSpaceName,
            from: from
          }, function (Data) {
            res.send(Data);
          });
        } else {
          res.send("error: no _from info");
        }

        break;

      case "db":
        res.send(_memoryDB.default[req.params.tupleSpaceName]);
        break;

      case "settings":
        res.send(_userSettings.default[req.params.tupleSpaceName]);
        break;

      default:
        res.send('There is no operation like "' + req.params.operation + '"');
        break;
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
router.post("/:tupleSpaceName",
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    // FIXME:本来_fromをここで計算
    var writeTuple = _objectSpread({}, req.query, {
      _time: Date.now(),
      _from: "hoge"
    });

    yield debug("write tuple:".concat(writeTuple));
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
var _default = router;
exports.default = _default;
//# sourceMappingURL=api.js.map