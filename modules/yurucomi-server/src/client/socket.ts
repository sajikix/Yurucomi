import io from "socket.io-client";

const socket = io(location.origin, { forceNew: true });

export default socket;
