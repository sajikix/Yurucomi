import Linda from "../linda";
import {
  WatchResponseTuple,
  LindaReadOperation,
  LindaWriteOperation,
  LindaWatchOperation,
  InsertData,
  ResponseTuple,
} from "../linda/interfaces";
import { YurucomiWatchOperation } from "yurucomi-interfaces";
import settingsUpdater from "./settingUpdater";
import userSettings from "./userSettings";
import checkMatchUsers from "./checkMatchUsers";
import emitter from "./eventEmitter";
import getUserIcon from "./getUserIcon";
import _debug from "debug";
const debug = _debug("linda-connector");

export default class Yurucomi {
  io: SocketIO.Server;
  linda: Linda;
  constructor(io: SocketIO.Server) {
    this.io = io;
    this.linda = new Linda();
  }
  watch(
    watchOperation: LindaWatchOperation,
    callback: (res: WatchResponseTuple) => void
  ) {
    this.linda
      .tupleSpace(watchOperation.tsName)
      .watch(watchOperation, async res => {
        callback(res);
      });
  }
  write(
    writeOperation: LindaWriteOperation,
    callback: (res: InsertData) => void
  ) {
    this.linda
      .tupleSpace(writeOperation.tsName)
      .write(writeOperation, async res => {
        settingsUpdater(res);
        callback(res);
      });
  }
  read(
    readOperation: LindaReadOperation,
    callback: (res: ResponseTuple) => void
  ) {
    this.linda.tupleSpace(readOperation.tsName).read(readOperation, res => {
      callback(res);
    });
  }
  listen() {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      debug("linda listenning");
      socket.on("_read_operation", (data: LindaReadOperation) => {
        this.read(data, (resData: ResponseTuple) => {
          socket.emit("_read_response", resData);
        });
      });
      socket.on("_write_operation", (data: LindaWriteOperation) => {
        this.write(data, (resData: InsertData) => {
          socket.emit("_write_response", resData);
        });
      });
      socket.on("_watch_operation", (data: YurucomiWatchOperation) => {
        const lindaWtachOperation = Object.assign(data, { payload: {} });
        emitter.on("setting_updated", settings => {
          if (settings.who === socket.request.session.userName) {
            socket.emit("_setting_update", settings);
          }
        });
        this.watch(lindaWtachOperation, async (resData: WatchResponseTuple) => {
          const icon: string = await getUserIcon(resData._where, resData._from);
          const returnData = Object.assign(resData, { _fromIcon: icon });
          const matchedUsers: Array<string> = await checkMatchUsers(resData);
          if (matchedUsers.includes(socket.request.session.userName)) {
            socket.emit("_new_event", returnData);
          }
        });
      });
    });
  }
}
