import io from "socket.io-client";
import { YurucomiEvent, TmpDataArray } from "yurucomi-interfaces";
import {
  setEventToLocalData,
  setWatchingtoLocalData,
} from "./utils/localStorage";
const options = {
  reconnectionDelay: 5000,
  transports: ["websocket"],
};

export default class EventWatcher {
  yurucomiSpaceName: string;
  userName: string;
  socket: SocketIOClient.Socket;
  propsSettings: { [PropsName: string]: Array<{ value: any; date: number }> };
  constructor() {
    this.socket = io(location.origin, options);
    this.propsSettings = {};
    this.yurucomiSpaceName = "";
    this.userName = "";
    this.listen = this.listen.bind(this);
  }

  listen(tupleSpaceName: string, userName: string) {
    this.yurucomiSpaceName = tupleSpaceName;
    this.userName = userName;
    this.socket.emit("_connected", {
      tsName: tupleSpaceName,
      userName: userName,
    });
    this.socket.emit("_watch_operation", {
      _payload: {},
      _where: tupleSpaceName,
      _type: "watch",
    });

    this.socket.on("_setting_update", (settings: any) => {
      console.log(settings);
      setWatchingtoLocalData(this.yurucomiSpaceName, settings);
    });
  }

  disconnect() {
    console.log("close");
    this.socket.close();
  }

  watch(callback: (event: any) => void) {
    this.socket.on("_new_event", (event: YurucomiEvent) => {
      setEventToLocalData(event);
      callback(event);
    });
  }
  getTmpData(callback: (data: Array<YurucomiEvent>) => void) {
    this.socket.on("_tmp_data", (data: TmpDataArray) => {
      const validatedData = data.map(ele => ele.eventData);
      callback(validatedData);
    });
    this.socket.emit("_get_tmp_data", {
      tsName: this.yurucomiSpaceName,
      from: this.userName,
    });
  }
}
