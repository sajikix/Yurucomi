// import emitter from "./eventEmitter";
// import { getUserProps } from "./userSettings";
// const settinListner = (io: SocketIO.Server) => {
//   io.on("connection", socket => {
//     socket.on("_get_my_props_settings", async data => {
//       const resData = await getUserProps(
//         data.tsName,
//         socket.request.session.userName
//       );
//       socket.emit("_res_props_settings", resData);
//     });
//     emitter.on("_settings_update", async data => {
//       if (data.userName === socket.request.session.userName) {
//         const resData = await getUserProps(data.tsName, data.userName);
//         socket.emit("_settings_update", resData);
//       }
//     });
//   });
// };
// export default settinListner;
"use strict";
//# sourceMappingURL=settingListener.js.map