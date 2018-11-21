import io from "socket.io-client";
import { Tuple } from "yurucomi-interfaces";
const options = {
  reconnectionDelay: 5000,
  transports: ["websocket"],
};

export default class EventWatcher {
  socket: SocketIOClient.Socket;
  propsSettings: { [PropsName: string]: Array<{ value: any; date: number }> };
  constructor() {
    this.socket = io(location.origin, options);
    this.propsSettings = {};
    this.listen = this.listen.bind(this);
    this.filter = this.filter.bind(this);
  }

  listen(tupleSpaceName: string) {
    this.socket.emit("_join_tuplespace", {
      tsName: tupleSpaceName,
    });
    this.socket.emit("_get_my_props_settings", { tsName: "masuilab" });
    this.socket.emit("_watch_operation", {
      tsName: tupleSpaceName,
      payload: {},
    });
    this.socket.on("_res_props_settings", (res: any) => {
      console.log("_res_props_settings", res);
      this.propsSettings = res;
    });
    this.socket.on("_settings_update", (res: any) => {
      console.log("_settings_update", res);
      this.propsSettings = res;
    });
  }

  watch(userName: string, callback: (data: any) => void) {
    this.socket.on("_watch_response", (resData: any) => {
      const result = this.filter(resData, userName);
      console.log("result", result);
      if (result.isMuch) {
        callback(result.data);
      }
    });
  }

  filter(resData: any, userName: string) {
    console.log("resData", resData);
    if (Object.keys(this.propsSettings).length === 0) {
      return { isMuch: false, data: null };
    } else if (resData._from === userName) {
      return { isMuch: false, data: null };
    } else {
      for (let prop of Object.keys(this.propsSettings)) {
        if (resData._payload.hasOwnProperty(prop)) {
          if (
            this.propsSettings[prop].findIndex(ele => {
              return ele.value === resData._payload[prop];
            }) >= 0
          ) {
            return { isMuch: true, data: resData };
          }
        }
      }
      return { isMuch: false, data: null };
    }
  }
}
