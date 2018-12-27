import Linda, { linda } from "../linda";
import {
  WatchResponseTuple,
  LindaReadOperation,
  LindaWriteOperation,
  LindaWatchOperation,
  InsertData,
  ResponseTuple,
} from "../linda/interfaces";
import { YurucomiWatchOperation, SettingUpdateData } from "yurucomi-interfaces";
import settingsUpdater from "./settingUpdater";
import checkMatchUsers from "./checkMatchUsers";
import emitter from "./utils/eventEmitter";
import getUserIcon from "./utils/getUserIcon";
import setDBSettings from "./setDBSettings";
import { setTmpData, getTmpData } from "./tmpData";
import _debug from "debug";
const debug = _debug("linda-connector");

export default class Yurucomi {
  io: SocketIO.Server;
  linda: Linda;
  constructor(io: SocketIO.Server) {
    this.io = io;
    this.linda = linda;
  }
  /*
  connct関数を作りたい
  lindaとyurucomiの各メソッドを繋げる
  */
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
    this.io.sockets.on("connection", (socket: SocketIO.Socket) => {
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
      socket.on("_get_tmp_data", async (data: any) => {
        const tmpData = await getTmpData(
          data.tsName,
          data.from,
          data.lastUpdate
        );
        socket.emit("_tmp_data", tmpData);
      });
      socket.on("_connected", async data => {
        const userData = await setDBSettings(data.tsName, data.userName);
        socket.emit("_setting_update", {
          settings: userData,
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
          const matchedUsers: Array<string> = await checkMatchUsers(resData);
          if (matchedUsers.length > 0) {
            const icon: string = await getUserIcon(
              resData._where,
              resData._from
            );
            const returnData = Object.assign(resData, { _fromIcon: icon });
            await setTmpData(matchedUsers, returnData);
            if (matchedUsers.includes(socket.request.session.userName)) {
              socket.emit("_new_event", returnData);
            }
          }
        });
      });
    });
  }
}
