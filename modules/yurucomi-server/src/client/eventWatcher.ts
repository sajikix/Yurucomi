import io from "socket.io-client";

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

  watch(callback: (data: any) => void) {
    this.socket.on("_watch_response", (resData: any) => {
      const result = this.filter(resData._payload);
      console.log("result", resData);
      if (result.isMuch) {
        callback(result.data);
      }
    });
  }

  filter(resData: { [key: string]: any }) {
    if (Object.keys(this.propsSettings).length === 0) {
      return { isMuch: true, data: resData };
    } else {
      for (let prop of Object.keys(this.propsSettings)) {
        console.log("prop", prop);
        console.log("resData", resData);
        if (resData.hasOwnProperty(prop)) {
          console.log("place2");
          if (
            this.propsSettings[prop].findIndex(ele => {
              return ele.value === resData[prop];
            }) >= 0
          ) {
            console.log("place3");
            return { isMuch: true, data: resData };
          }
        }
      }
      return { isMuch: false, data: null };
    }
  }
}
