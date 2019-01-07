import collection from "./utils/mongodb";

let lastId = -1;

// FIXME:いつかIDにする
const getTmpData = async (
  tsName: string,
  userName: string,
  lastTime: number
) => {
  const tmpData = await collection(tsName + "_tmp")
    .find({
      name: userName,
      time: { $gt: lastTime },
    })
    .toArray();
  await collection(tsName + "_tmp").deleteMany({
    name: userName,
    time: { $gt: lastTime },
  });
  return tmpData;
};

const setTmpData = async (
  matchedUsers: Array<string>,
  tupleId: number | any,
  tupleData: any
) => {
  console.log("tmpdata set");
  if (lastId !== tupleId) {
    const insertData = matchedUsers.map(ele => {
      return {
        name: ele,
        tuple: tupleData._payload,
        time: tupleData._time,
        icon: tupleData._fromIcon,
        from: tupleData._from,
        tupleId: tupleId,
      };
    });
    lastId = tupleId;
    await collection(tupleData._where + "_tmp").insertMany(insertData);
  }
};

export { getTmpData, setTmpData };
