"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _http = require("http");

var _socket = _interopRequireDefault(require("socket.io"));

var _routes = require("./routes");

var _debug2 = _interopRequireDefault(require("debug"));

var _sessionCheck = _interopRequireDefault(require("./sessionCheck"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _yurucomi = _interopRequireDefault(require("./yurucomi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//import Linda from "./linda";
// import settingListener from "./settingListener";
var debug = (0, _debug2.default)("server:main");

_dotenv.default.load();

var PORT = Number(process.env.PORT) || 3000;
var sessionMiddleware = (0, _expressSession.default)({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
});
var app = (0, _express.default)();

var main =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    var server = (0, _http.createServer)(app);
    var options = {
      cookie: false,
      serveClient: false,
      pingTimeout: 15000,
      pingInterval: 13000
    };
    app.set("views", "views/");
    app.set("view engine", "pug");
    app.use(_express.default.static("public/"));
    app.use(_bodyParser.default.json());
    app.use(_bodyParser.default.urlencoded({
      extended: true
    }));
    app.use((0, _cookieParser.default)());
    app.use((0, _cors.default)());
    app.use(_express.default.static("public"));
    app.use(sessionMiddleware);
    app.use("/_api", _routes.routeApi);
    app.use("/", _routes.routeTop);
    app.use("/_logout", _routes.routeLogout);
    app.use("/_login", _routes.routeLogin);
    app.use("/_sessioncheck", _routes.routeSessionCheck);
    app.use("/", _sessionCheck.default, _routes.routeMain);
    var io = (0, _socket.default)(server, options);
    io.use(function (socket, next) {
      sessionMiddleware(socket.request, socket.request.res || {}, next);
    });
    var yurucomi = new _yurucomi.default(io);
    yurucomi.listen(); // settingListener(io);

    app.set("yurucomi", yurucomi);
    app.set("io", io);
    server.listen(PORT,
    /*#__PURE__*/
    _asyncToGenerator(function* () {
      debug("Yurucomi server listen on :".concat(PORT));
      debug("process.env.NODE_ENV=".concat(String(process.env.NODE_ENV)));
    }));
  });

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main().catch(function (e) {
  debug("error:".concat(e));
  process.exit(1);
});
var _default = app;
exports.default = _default;
//# sourceMappingURL=index.js.map