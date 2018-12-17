"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var sessionCheck = function sessionCheck(req, res, next) {
  var tsName = req.originalUrl.match(/^\/\_.+$/) ? "" : req.originalUrl.slice(1);

  if (req.session) {
    if (req.session.userName) {
      next();
    } else {
      res.redirect("/_login?where=".concat(tsName));
    }
  } else {
    res.redirect("/_login?where=".concat(tsName));
  }
};

var _default = sessionCheck;
exports.default = _default;
//# sourceMappingURL=sessionCheck.js.map