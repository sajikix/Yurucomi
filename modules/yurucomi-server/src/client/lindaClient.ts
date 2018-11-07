import io from "socket.io-client";
import {
  Tuple,
  Callback,
  ResponseTuple,
  ConnectCallback,
} from "./interfaces/index";

export default class LindaClient {
  tupleSpaceName: string;
  constructor(tupleSpaceName: string) {
    this.tupleSpaceName = tupleSpaceName;
  }

  connect(callback: ConnectCallback) {
    const socket = io(location.origin);
    socket.emit("_join_tuplespace", {
      tsName: this.tupleSpaceName,
    });
    callback(socket);
  }

  read(tuple: Tuple, socket: SocketIOClient.Socket, callback: Callback) {
    let readData = { tsName: this.tupleSpaceName, payload: tuple };
    socket.emit("_read_operation", readData);
    socket.on("_read_response", (resData: ResponseTuple) => {
      callback(resData);
    });
  }

  write(tuple: Tuple, socket: SocketIOClient.Socket, callback: Callback) {
    let writeData = { tsName: this.tupleSpaceName, payload: tuple };
    socket.on("_write_response", (resData: ResponseTuple) => {
      callback(resData);
    });
    socket.emit("_write_operation", writeData);
  }

  take(tuple: Tuple, socket: SocketIOClient.Socket, callback: Callback) {
    let takeData = { tsName: this.tupleSpaceName, payload: tuple };
    socket.on("_take_response", (resData: ResponseTuple) => {
      callback(resData);
    });
    socket.emit("_take_operation", takeData);
  }
  watch(tuple: Tuple, socket: SocketIOClient.Socket, callback: Callback) {
    let watchData = { tsName: this.tupleSpaceName, payload: tuple };
    socket.on("_watch_response", (resData: ResponseTuple) => {
      callback(resData);
    });
    socket.emit("_watch_operation", watchData);
  }
  onDisconnected(socket: SocketIOClient.Socket, callback: ConnectCallback) {
    socket.on("disconnect", callback);
  }
  // private validateURL(url: string): boolean {
  //   const regex = /^(http|https):\/\/([\w-]+\.)+([\w-]|:)+\/[\w-]+/;
  //   const regex2 = /^(http|https):\/\/localhost:[0-9]+\/[\w-]+/;
  //   return regex.test(url) || regex2.test(url);
  // }
}
