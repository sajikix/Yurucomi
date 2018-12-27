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
    this.socket.emit("_connected", {
      tsName: tupleSpaceName,
      userName: userName,
    });
    this.socket.emit("_watch_operation", {
      tsName: tupleSpaceName,
      from: userName,
    });
    const updateTime: number = Number(localStorage.getItem("lastUpdate"));
    if (updateTime > 0 && updateTime < Date.now()) {
      this.socket.emit("_get_tmp_data", {
        tsName: tupleSpaceName,
        from: userName,
        lastUpdate: updateTime,
      });
    }
    this.socket.on("_setting_update", (settings: any) => {
      localStorage.setItem(tupleSpaceName, JSON.stringify(settings.settings));
    });
    this.socket.on("_tmp_data", (data: any) => {
      console.log("tmp", data);
      const localData =
        localStorage.getItem(`${tupleSpaceName}TmpData`) || "[]";
      const oldData = JSON.parse(localData);
      const newData = [...oldData, ...data];
      localStorage.setItem(`${tupleSpaceName}TmpData`, JSON.stringify(newData));
      localStorage.setItem("lastUpdate", String(Date.now()));
    });
  }

  disconnect() {
    console.log("close");
    this.socket.close();
  }

  watch(callback: (event: any) => void) {
    this.socket.on("_new_event", (event: any) => {
      callback(event);
    });
  }
  getTmpData(callback: (data: any) => void) {
    this.socket.on("_tmp_data", (data: any) => {
      callback(data);
    });
  }
}
