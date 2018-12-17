"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)("server:mongo");
var url = process.env.MONGODB_URI || "mongodb://localhost/yurucomi";
var db;

_mongodb.MongoClient.connect(url, function (err, client) {
  if (err) {
    console.log(err);
  }

  debug("connected to DB(".concat(url, ")"));
  db = client.db();
});

var collection = function collection(collectionName) {
  return db.collection(collectionName);
};

var _default = collection;
exports.default = _default;
//# sourceMappingURL=mongodb.js.map