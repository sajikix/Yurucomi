import {
  IsMuchResponse,
  Tuple,
  ResponseTuple,
  InsertData,
  InsertOperation,
} from "../interfaces";
import memoryDB from "../db/memoryDB";

import settingUpdater from "../../settingUpdater";
import _debug from "debug";
const debug = _debug("server:memoryClient");

export default class storageClient {
  tupleSpace: any;
  tupleSpaceName: string;
  constructor(tupleSpaceName: string) {
    this.tupleSpaceName = tupleSpaceName;
    if (memoryDB[tupleSpaceName]) {
      this.tupleSpace = memoryDB[tupleSpaceName];
      debug(tupleSpaceName + " is already exist");
    } else {
      this.tupleSpace = memoryDB[tupleSpaceName] = [
        {
          _id: 0,
          time: Date.now(),
          _payload: { type: "init" },
          _from: "_init",
          _where: tupleSpaceName,
        },
      ];
      debug(tupleSpaceName + " is created");
    }
  }
  // .fileter使って書き直せる説
  async get(tuple: Tuple): Promise<ResponseTuple> {
    for (let i = 0; i < this.tupleSpace.length; i++) {
      let result = await this.isMuch(this.tupleSpace[i]._payload, tuple);
      if (result.isMuched) {
        let resData: ResponseTuple = await Object.assign(this.tupleSpace[i], {
          _isMuched: true,
        });
        return resData;
      }
      if (!result.isMuched && i == this.tupleSpace.length - 1) {
        break;
      }
    }
    return {
      _isMuched: false,
      _id: null,
      _from: this.tupleSpaceName,
      _payload: null,
      _time: null,
    };
  }

  async insert(insertOperation: InsertOperation): Promise<InsertData> {
    const time = Date.now();
    const insertData: InsertData = {
      _time: time,
      _from: insertOperation.from,
      _payload: insertOperation.payload,
      _id: this.tupleSpace.length,
      _where: this.tupleSpaceName,
    };
    await this.tupleSpace.unshift(insertData);
    await settingUpdater(insertData);
    return insertData;
  }
  //FIXME:
  delete(id: number): void {
    this.tupleSpace.splice(id, 1);
  }

  isMuch(targetTuple: Tuple, searchTuple: Tuple): IsMuchResponse {
    for (let operationKey in searchTuple) {
      if (!targetTuple[operationKey]) {
        return { isMuched: false, res: null };
      } else if (targetTuple[operationKey] !== searchTuple[operationKey]) {
        return { isMuched: false, res: null };
      }
    }
    return { isMuched: true, res: targetTuple };
  }
}
