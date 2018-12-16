import settings from "./userSettings";
import { InsertData } from "../linda/interfaces";

const checkMatchUsers = async (data: InsertData) => {
  // evet発火を制御する部分
  const Users: Array<string> = [];
  for (let user in settings[data._where]) {
    for (let prop in data._payload) {
      if (settings[data._where][user].hasOwnProperty(prop)) {
        const matched = settings[data._where][user][prop].find(ele => {
          return ele.value === data._payload[prop];
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
