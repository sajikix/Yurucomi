import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer, Server } from "http";
import socketIO from "socket.io";
import { routeMain, routeApi, routeLogin, routeSessionCheck } from "./routes";
import _debug from "debug";
//import sessionCheck from "./sessionCheck";
import socketManager from "./socketManager";
import session from "express-session";

const debug = _debug("server:main");
dotenv.load();

const main = async () => {
  const PORT: number = Number(process.env.PORT) || 3000;
  const app = express();
  const server = createServer(app);
  //const io = socketIO.listen(server);
  const options = {
    cookie: false,
    serveClient: false,
    transports: ["websocket"],
    pingTimeout: 15000,
    pingInterval: 13000,
  }; // default: 60000 // default: 25000
  const io = socketIO(server, options);
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
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 60 * 1000,
      },
    })
  );
  app.use("/_api", routeApi);
  app.use("/_login", routeLogin);
  app.use("/_sessioncheck", routeSessionCheck);
  app.use("/", routeMain);

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
