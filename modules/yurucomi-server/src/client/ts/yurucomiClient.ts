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
  }

  listen(tupleSpaceName: string, userName: string) {
    this.socket.emit("_local_settings", {
      tsName: tupleSpaceName,
      userName: userName,
      settings: JSON.parse(localStorage.getItem(tupleSpaceName) || "{}"),
    });
    this.socket.emit("_watch_operation", {
      tsName: tupleSpaceName,
      from: userName,
    });
    this.socket.on("_setting_update", (settings: any) => {
      console.log("settings", settings);
      localStorage.setItem(tupleSpaceName, JSON.stringify(settings.settings));
    });
  }

  watch(callback: (event: any) => void) {
    this.socket.on("_new_event", (event: any) => {
      callback(event);
    });
  }
}
