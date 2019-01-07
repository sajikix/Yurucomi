import { Settings } from "yurucomi-interfaces";
import collection from "./utils/mongodb";

const userSettings: Settings = {};

const setUserPropsFromDB = async (tsName: string) => {
  const userDataArray = await collection(tsName)
    .find()
    .toArray();
  userDataArray.map(async ele => {
    const userName = ele._from;
    delete ele._from;
    delete ele._id;
    await setUserProps(tsName, userName, ele);
  });
};

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
export { getUserProps, setUserProps, setUserPropsFromDB };
