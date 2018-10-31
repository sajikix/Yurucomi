import io from "socket.io-client";

const options = {
  reconnectionDelay: 5000,
  transports: ["websocket"],
};
const socket = io(location.origin, options);

socket.on("disconnect", (reason: any) => {
  console.log(`disconnected:${JSON.stringify(reason)}`);
});

socket.on("connect_error", (error: any) => {
  console.log(`error:${JSON.stringify(error)}`);
});

export default socket;
