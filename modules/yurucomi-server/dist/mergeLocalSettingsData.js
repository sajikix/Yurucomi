"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deepAssign = _interopRequireDefault(require("deep-assign"));

var _userSettings = _interopRequireDefault(require("./userSettings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mergeLocalSettingsData = function mergeLocalSettingsData(data) {
  if (!_userSettings.default[data.tsName]) {
    _userSettings.default[data.tsName] = {};
  }

  if (!_userSettings.default[data.tsName][data.userName]) {
    _userSettings.default[data.tsName][data.userName] = {};
  }

  var newSettings = (0, _deepAssign.default)(data.settings, _userSettings.default[data.tsName][data.userName]);
  console.log("new", newSettings);
  _userSettings.default[data.tsName][data.userName] = newSettings;
};

var _default = mergeLocalSettingsData;
exports.default = _default;
//# sourceMappingURL=mergeLocalSettingsData.js.map