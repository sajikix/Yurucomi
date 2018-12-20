import { setUserProps, getUserProps } from "./userSettings";
import collection from "./utils/mongodb";

const setDBSetting = async (tsName: string, userName: string) => {
  const userData = await collection(tsName).findOne({ _from: userName });
  delete userData._from;
  delete userData._id;
  await setUserProps(tsName, userName, userData);
  return getUserProps(tsName, userName);
};

export default setDBSetting;
