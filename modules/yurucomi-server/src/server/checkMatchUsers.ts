import settings from "./userSettings";
import Asearch from "asearch";
import { LindaResponse } from "yurucomi-interfaces";

const checkMatchUsers = async (data: LindaResponse) => {
  // event発火を制御する部分
  const Users: Array<string> = [];
  for (let user in settings[data._where]) {
    for (let prop in data._payload) {
      if (settings[data._where][user].hasOwnProperty(prop)) {
        const matched = settings[data._where][user][prop].find(ele => {
          const a = new Asearch(ele.value);
          // return ele.value === data._payload[prop];
          return a.match(data._payload[prop], 1);
        });
        if (matched && data._from !== user) {
          Users.push(user);
        }
      }
    }
  }
  console.log(Users);
  return Users;
};

export default checkMatchUsers;
