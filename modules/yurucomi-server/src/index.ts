import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from "http";
import socketIO from "socket.io";
import routeIndex from "./routes";
import _debug from "debug";
import socketManager from "./socketManager";

const debug = _debug("server:main");
dotenv.load();

const app = express();

const main = async () => {
  const PORT: number = Number(process.env.PORT) || 3000;
  const server = createServer(app);
  const io = socketIO.listen(server);
  app.set("views", "views/");
  app.set("view engine", "pug");
  app.use(express.static("public/"));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cors());
  app.use(express.static("public"));
  app.use("/", routeIndex);

  //app.set("io", io);
  socketManager(io);

  server.listen(PORT, async () => {
    debug(`Yurucomi server listen on :${PORT}`);
    debug(`process.env.NODE_ENV=${String(process.env.NODE_ENV)}`);
  });
};

main().catch(e => {
  debug(`error:${e}`);
  process.exit(1);
});

export default app;
