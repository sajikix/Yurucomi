import collection from "./utils/mongodb";
import { YurucomiEvent, TmpDataArray } from "yurucomi-interfaces";

let lastId = -1;

// FIXME:いつかIDにする
const getTmpData = async (tsName: string, userName: string) => {
  const tmpData: TmpDataArray = await collection(tsName + "_tmp")
    .find({
      name: userName,
    })
    .toArray();
  await collection(tsName + "_tmp").deleteMany({
    name: userName,
  });

  return tmpData;
};

const setTmpData = async (
  matchedUsers: Array<string>,
  tupleData: YurucomiEvent
) => {
  const insertData = matchedUsers.map(ele => {
    return {
      name: ele,
      eventData: tupleData,
    };
  });
  console.log("tmp", insertData);
  await collection(tupleData._where + "_tmp").insertMany(insertData);
};

export { getTmpData, setTmpData };
