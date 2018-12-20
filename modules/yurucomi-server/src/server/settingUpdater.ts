import { InsertData } from "../linda/interfaces";
import userSettings from "./userSettings";
import emitter from "./utils/eventEmitter";
import collection from "./utils/mongodb";

const updater = async (data: InsertData) => {
  if (data._from === undefined) {
    data._from = "_unkown";
  }
  const validatedData = await Object.entries(data._payload).map(ele => {
    return { key: ele[0], value: ele[1], date: Date.now() };
  });

  if (!userSettings[data._where]) {
    userSettings[data._where] = {};
  }
  if (!userSettings[data._where][data._from]) {
    userSettings[data._where][data._from] = {};
  }
  const settings = Object.assign({}, userSettings[data._where][data._from]);
  for (let d of validatedData) {
    if (settings[d.key]) {
      let index = settings[d.key].findIndex(ele => {
        return ele.value === d.value;
      });
      if (index !== -1) {
        settings[d.key].splice(index, 1);
      }
      settings[d.key].unshift({
        value: d.value,
        date: d.date,
      });
    } else {
      settings[d.key] = [
        {
          value: d.value,
          date: d.date,
        },
      ];
    }
  }
  userSettings[data._where][data._from] = settings;
  emitter.emit("setting_updated", {
    where: data._where,
    who: data._from,
    settings: userSettings[data._where][data._from],
  });
  const replaceData = Object.assign({}, userSettings[data._where][data._from], {
    _from: data._from,
  });
  await collection(data._where).findOneAndReplace(
    { _from: data._from },
    replaceData,
    { upsert: true }
  );
  return { [data._where]: settings };
};

export default updater;
