import Linda, { linda } from "../linda";

import {
  YurucomiWatchOperation,
  LindaOperation,
  LindaResponse,
  Tuple,
} from "yurucomi-interfaces";
import settingUpdater from "./settingUpdater";
import { getUserProps, setUserPropsFromDB } from "./userSettings";
import checkMatchUsers from "./checkMatchUsers";
import emitter from "./utils/eventEmitter";
import getUserIcon from "./utils/getUserIcon";
import { setTmpData, getTmpData } from "./tmpData";
import lindaClient from "linda-client";
import _debug from "debug";
const debug = _debug("linda-connector");

export default class Yurucomi {
  io: SocketIO.Server;
  linda: Linda;
  lindaClient: lindaClient;
  constructor(io: SocketIO.Server) {
    this.io = io;
    // this.linda = linda;
    this.lindaClient = new lindaClient();
  }
  /*
  connct関数を作りたい
  lindaとyurucomiの各メソッドを繋げる
  */

  async connect(tsName: string) {
    await this.lindaClient.connect(
      // "https://new-linda.herokuapp.com",
      "http://localhost:7777",
      tsName
    );
  }

  private async write(tuple: Tuple) {
    const resData = await this.lindaClient.write(tuple);
    return resData;
  }
  private watch(tuple: Tuple, callback: (res: LindaResponse) => void) {
    this.lindaClient.watch(tuple, async res => {
      if (!res._from && res._payload._from) {
        res._from = res._payload._from;
      }
      callback(res);
    });
  }
  listen() {
    this.io.sockets.on("connection", (socket: SocketIO.Socket) => {
      debug("yurucomi listenning");

      socket.on("_write_operation", async (data: LindaOperation) => {
        const resData = await this.write(data);
        socket.emit("_write_response", resData);
      });

      socket.on("_watch_operation", (tuple: Tuple) => {
        emitter.on("setting_updated", settings => {
          if (settings.who === socket.request.session.userName) {
            socket.emit("_setting_update", settings);
          }
        });
        this.watch(tuple, async (resData: LindaResponse) => {
          if (resData._from) {
            await settingUpdater(resData);
            const matchedUsers: Array<string> = await checkMatchUsers(resData);
            console.log("matched", matchedUsers);
            if (matchedUsers.length > 0) {
              const icon: string = await getUserIcon(
                resData._where,
                resData._from
              );
              const returnData = Object.assign(resData, {
                _fromIcon: icon,
              });
              await setTmpData(matchedUsers, resData._id, returnData);
              if (matchedUsers.includes(socket.request.session.userName)) {
                socket.emit("_new_event", returnData);
              }
            }
          }
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
        //tupleSpaceを指定
        await this.connect(data.tsName);
        await setUserPropsFromDB(data.tsName);
        const userData = getUserProps(data.tsName, data.userName);
        socket.emit("_setting_update", {
          settings: userData,
        });
      });
    });
  }
}
