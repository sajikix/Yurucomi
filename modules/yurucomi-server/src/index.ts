import express from "express";
import _debug from "debug";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from "http";
import socketIO from "socket.io";

const debug = _debug("server:main");
dotenv.load();

const main = async () => {
  const PORT: number = Number(process.env.PORT) || 3000;
  const app = express();
  const server: Server = createServer(app);
  const io: SocketIO.Server = socketIO.listen(server);
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

  server.listen(PORT, async () => {
    debug(`Yurucomi server listen on :${PORT}`);
    debug(`process.env.NODE_ENV=${String(process.env.NODE_ENV)}`);
  });
};

main().catch(e => {
  debug(`error:${e}`);
  process.exit(1);
});
