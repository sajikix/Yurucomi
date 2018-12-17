"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

var debug = (0, _debug2.default)("server:router");
router.get("/", function (req, res) {
  res.render("index");
});
router.get("/:tupleSpaceName", function (req, res) {
  res.render("index");
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=main.js.map