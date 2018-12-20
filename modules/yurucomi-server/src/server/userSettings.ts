import { Settings } from "yurucomi-interfaces";

const userSettings: Settings = {};

const getUserProps = async (tsName: string, userName: string) => {
  if (!userSettings[tsName]) {
    userSettings[tsName] = {};
    userSettings[tsName][userName] = {};
  } else if (!userSettings[tsName][userName]) {
    userSettings[tsName][userName] = {};
  }
  return userSettings[tsName][userName];
};

const setUserProps = async (tsName: string, userName: string, data: any) => {
  if (!userSettings[tsName]) {
    userSettings[tsName] = {};
    userSettings[tsName][userName] = {};
  } else if (!userSettings[tsName][userName]) {
    userSettings[tsName][userName] = {};
  }
  userSettings[tsName][userName] = data;
};

export default userSettings;
export { getUserProps, setUserProps };
