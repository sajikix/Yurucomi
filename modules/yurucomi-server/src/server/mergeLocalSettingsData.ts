import deepAssign from "deep-assign";
import userSettings from "./userSettings";
import { SettingUpdateData, Setting } from "yurucomi-interfaces";
const mergeLocalSettingsData = (data: SettingUpdateData) => {
  if (!userSettings[data.tsName]) {
    userSettings[data.tsName] = {};
  }
  if (!userSettings[data.tsName][data.userName]) {
    userSettings[data.tsName][data.userName] = {};
  }
  const newSettings: any = deepAssign(
    data.settings,
    userSettings[data.tsName][data.userName]
  );

  console.log("new", newSettings);

  userSettings[data.tsName][data.userName] = newSettings;
};

export default mergeLocalSettingsData;
