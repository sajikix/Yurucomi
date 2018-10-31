import emitter from "./eventEmitter";
import _debug from "debug";

const debug = _debug("server:socketIO");

//FIXME:dataの型

type Clients = {
  [id: string]: SocketIO.Socket;
};

let clients: Clients = {};
const socketManager = (io: SocketIO.Server) => {
  emitter.on("event", data => {
    io.to(data.tupleSpace).emit("msg", data);
  });
  io.on("connection", socket => {
    debug("IO connected");
    socket.on("join-tuple-space", data => {
      socket.join(data.tupleSpace);
    });
    socket.on("disconnect", (reason: any) => {
      console.log(reason);
    });
  });
};

export default socketManager;
