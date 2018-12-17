"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

var debug = (0, _debug2.default)("server:router/logout");
router.get("/", function (req, res) {
  if (req.session) {
    if (req.session.userName) {
      debug("userName-session was deleted");
      delete req.session.userName;
    }

    if (req.session.groupName) {
      debug("groupName-session was deleted");
      delete req.session.groupName;
    }

    res.send({
      logouted: true
    });
  } else {
    res.send({
      logouted: true
    });
  }
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=logout.js.map