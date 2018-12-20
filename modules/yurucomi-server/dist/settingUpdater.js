"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _userSettings = _interopRequireDefault(require("./userSettings"));

var _eventEmitter = _interopRequireDefault(require("./eventEmitter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var updater =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (data) {
    if (data._from === undefined) {
      data._from = "_unkown";
    }

    var validatedData = yield Object.entries(data._payload).map(function (ele) {
      return {
        key: ele[0],
        value: ele[1],
        date: Date.now()
      };
    });

    if (!_userSettings.default[data._where]) {
      _userSettings.default[data._where] = {};
    }

    if (!_userSettings.default[data._where][data._from]) {
      _userSettings.default[data._where][data._from] = {};
    }

    var settings = Object.assign({}, _userSettings.default[data._where][data._from]);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var d = _step.value;

        if (settings[d.key]) {
          var index = settings[d.key].findIndex(function (ele) {
            return ele.value === d.value;
          });

          if (index !== -1) {
            settings[d.key].splice(index, 1);
          }

          settings[d.key].unshift({
            value: d.value,
            date: d.date
          });
        } else {
          settings[d.key] = [{
            value: d.value,
            date: d.date
          }];
        }
      };

      for (var _iterator = validatedData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    _userSettings.default[data._where][data._from] = settings;

    _eventEmitter.default.emit("setting_updated", {
      where: data._where,
      who: data._from,
      settings: _userSettings.default[data._where][data._from]
    });

    return _defineProperty({}, data._where, settings);
  });

  return function updater(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = updater;
exports.default = _default;
//# sourceMappingURL=settingUpdater.js.map