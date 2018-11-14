import { InsertData } from "./linda/interfaces";
import userSettings from "./userSettings";
import emitter from "./eventEmitter";

const updater = async (data: InsertData) => {
  const validatedData = await Object.entries(data._payload).map(ele => {
    return { key: ele[0], value: ele[1], date: Date.now() };
  });

  if (!userSettings[data._where]) {
    userSettings[data._where] = {};
  }
  if (!userSettings[data._where][data._from]) {
    userSettings[data._where][data._from] = { props: {}, memberSettings: {} };
  }
  const settings = userSettings[data._where][data._from];
  for (let d of validatedData) {
    if (settings.props[d.key]) {
      let index = settings.props[d.key].findIndex(ele => {
        return ele.value === d.value;
      });
      if (index !== -1) {
        settings.props[d.key].splice(index, 1);
      }
      settings.props[d.key].unshift({
        value: d.value,
        date: d.date,
      });
    } else {
      settings.props[d.key] = [
        {
          value: d.value,
          date: d.date,
        },
      ];
    }
  }
  emitter.emit("_settings_update", {
    userName: data._from,
    tsName: data._where,
  });
};

export default updater;
