import { LindaOperation, YurucomiEvent } from "yurucomi-interfaces";
import YurucomiSpace from "./yurucomiSpace";
import { getUserProps, setUserPropsFromDB } from "./userSettings";
import emitter from "./utils/eventEmitter";
import { getTmpData } from "./tmpData";
import lindaClient from "linda-client";
import _debug from "debug";
const debug = _debug("yurucomi");

export default class Yurucomi {
  io: SocketIO.Server;
  lindaClient: lindaClient;
  yurucomiSpaces: {
    [ysName: string]: { space: YurucomiSpace; watching: boolean };
  };
  constructor(io: SocketIO.Server) {
    this.io = io;
    this.yurucomiSpaces = {};
    this.lindaClient = new lindaClient();
  }

  yurucomiSpace(ysName: string) {
    if (!this.yurucomiSpaces[ysName]) {
      debug(`${ysName} created`);
      this.yurucomiSpaces[ysName] = {
        space: new YurucomiSpace(ysName),
        watching: false,
      };
    }
    return this.yurucomiSpaces[ysName].space;
  }

  watch(ysName: string) {
    if (!this.yurucomiSpaces[ysName]) {
      this.yurucomiSpace(ysName).watch();
    } else if (!this.yurucomiSpaces[ysName].watching) {
      this.yurucomiSpace(ysName).watch();
    }
    this.yurucomiSpaces[ysName].watching = true;
  }

  listen() {
    this.io.sockets.on("connection", (socket: SocketIO.Socket) => {
      debug("yurucomi listenning");

      socket.on("_write_operation", async (data: LindaOperation) => {
        const resData = this.yurucomiSpace(data._where).write(data._payload);
        socket.emit("_write_response", resData);
      });

      socket.on("_watch_operation", (data: LindaOperation) => {
        emitter.on("setting_updated", settings => {
          if (settings.who === socket.request.session.userName) {
            socket.emit("_setting_update", settings);
          }
        });
        emitter.on("_event", (event: YurucomiEvent) => {
          if (event._where === data._where) {
            if (event._matchedUsers.includes(socket.request.session.userName)) {
              socket.emit("_new_event", event);
            }
          }
        });
        this.watch(data._where);
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
        await setUserPropsFromDB(data.tsName);
        const userData = getUserProps(data.tsName, data.userName);
        socket.emit("_setting_update", {
          settings: userData,
        });
      });
    });
  }
}
