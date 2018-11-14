import tupleSpace from "./tupleSpace";
import { Server } from "http";
import {
  LindaOperation,
  ResponseTuple,
  WatchResponseTuple,
  InsertOneWriteOpResult,
  LindaSubscribeOperation,
  InsertData,
} from "./interfaces";
import _debug from "debug";
const debug = _debug("server:linda");

export default class Linda {
  tupleSpaces: { [key: string]: tupleSpace };
  io: SocketIO.Server;
  constructor(io: SocketIO.Server) {
    this.tupleSpaces = {};
    this.io = io;
  }
  tupleSpace(tupleSpaceName: string) {
    if (!this.tupleSpaces[tupleSpaceName]) {
      this.tupleSpaces[tupleSpaceName] = new tupleSpace(tupleSpaceName);
    }
    return this.tupleSpaces[tupleSpaceName];
  }
  listen() {
    this.io.on("connection", (socket: SocketIO.Socket) => {
      debug("linda listenning");
      socket.on("_read_operation", (data: LindaOperation) => {
        this.tupleSpace(data.tsName).read(
          data.payload,
          (resData: ResponseTuple) => {
            socket.emit("_read_response", resData);
          }
        );
      });
      socket.on("_write_operation", (data: LindaOperation) => {
        this.tupleSpace(data.tsName).write(
          data.payload,
          (resData: InsertData) => {
            socket.emit("_write_response", resData);
          }
        );
      });
      socket.on("_take_operation", (data: LindaOperation) => {
        this.tupleSpace(data.tsName).take(
          data.payload,
          (resData: ResponseTuple) => {
            socket.emit("_take_response", resData);
          }
        );
      });
      socket.on("_watch_operation", (data: LindaOperation) => {
        this.tupleSpace(data.tsName).watch(
          data.payload,
          (resData: WatchResponseTuple) => {
            socket.emit("_watch_response", resData);
          }
        );
      });

      socket.on("_subscribed_data", (data: LindaSubscribeOperation) => {
        this.tupleSpace(data.tsName).watch(
          data.payload,
          (resData: WatchResponseTuple) => {
            socket.emit("_watch_response", resData);
          }
        );
      });
    });
  }
}
