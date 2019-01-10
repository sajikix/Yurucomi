import userSettings from "./userSettings";
import { LindaResponse } from "yurucomi-interfaces";
const checkMatch = (
  data: LindaResponse,
  callback: (users: Array<string>) => Promise<void>
) => {
  const matchedUsers = Object.entries(userSettings[data._where])
    .filter(userData => {
      return (
        Object.entries(userData[1])
          .filter(prop => {
            return data._payload.hasOwnProperty(prop[0]);
          })
          .filter(prop => {
            return (
              prop[1].filter(valueInfo => {
                return valueInfo.value === data._payload[prop[0]];
              }).length > 0
            );
          }).length > 0
      );
    })
    .map(ele => {
      return ele[0];
    });
  if (matchedUsers.length > 0) {
    callback(matchedUsers);
  }
  console.log("ele", matchedUsers);
};

export default checkMatch;
