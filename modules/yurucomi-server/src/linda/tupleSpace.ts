import {
  ResponseTuple,
  IsMuchResponse,
  WatchCallback,
  WriteCallback,
  ReadTakeCallback,
  InsertOperation,
  WatchResponseTuple,
  InsertData,
  LindaOperation,
} from "./interfaces";
import { EventEmitter2 } from "eventemitter2";
import storageClient from "./dbclient/memoryClient";

export default class tupleSpace {
  emitter: EventEmitter2;
  storage: storageClient;
  tupleSpaceName: string;
  constructor(tupleSpaceName: string) {
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: "::",
      newListener: false,
      maxListeners: 20,
      verboseMemoryLeak: false,
    });
    this.tupleSpaceName = tupleSpaceName;
    this.storage = new storageClient(tupleSpaceName);
  }

  async read(
    readOperationData: LindaOperation,
    callback: ReadTakeCallback
  ): Promise<void> {
    let resData: ResponseTuple = await this.storage.get(
      readOperationData.payload
    );
    callback(resData);
  }

  async write(
    writeOperationData: LindaOperation,
    callback: WriteCallback
  ): Promise<void> {
    let insertData: InsertOperation;
    if (writeOperationData.from) {
      insertData = {
        payload: writeOperationData.payload,
        from: writeOperationData.from,
      };
    } else {
      if (writeOperationData.payload.hasOwnProperty("_from")) {
        const from: string = String(writeOperationData.payload._from);
        const payload = writeOperationData.payload;
        delete payload._from;
        insertData = { payload: payload, from: from };
      } else {
        insertData = { payload: writeOperationData.payload, from: "" };
      }
    }
    const resData: InsertData = await this.storage.insert(insertData);
    this.emitter.emit("_writeData", insertData);
    callback(resData);
  }

  watch(watchOperationData: LindaOperation, callback: WatchCallback): void {
    this.emitter.on("_writeData", (resTuple: InsertOperation) => {
      let result: IsMuchResponse = this.storage.isMuch(
        resTuple.payload,
        watchOperationData.payload
      );
      if (result.isMuched) {
        const resData: WatchResponseTuple = {
          _time: Date.now(),
          _where: this.tupleSpaceName,
          _payload: resTuple.payload,
          _from: resTuple.from || "",
        };
        callback(resData);
      }
    });
  }

  async take(
    takeOperationData: LindaOperation,
    callback: ReadTakeCallback
  ): Promise<void> {
    //FIXME:その場しのぎのany
    let resData: any = await this.storage.get(takeOperationData.payload);
    if (resData._isMuched) {
      await this.storage.delete(resData._id);
    }
    callback(resData);
  }
}
