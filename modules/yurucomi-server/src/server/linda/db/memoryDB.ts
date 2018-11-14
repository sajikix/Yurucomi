import { Memory } from "../interfaces";

let memoryDB: Memory = {
  test: [
    {
      _id: 0,
      time: Date.now(),
      _payload: { type: "init" },
      _from: "_init",
      _where: "test",
    },
  ],
};

export default memoryDB;
