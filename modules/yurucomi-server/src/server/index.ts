import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createServer, Server } from "http";
import socketIO from "socket.io";
import {
  routeMain,
  routeApi,
  routeLogin,
  routeSessionCheck,
  routeTop,
  routeLogout,
} from "./routes";
import _debug from "debug";
import sessionCheck from "./sessionCheck";
import session from "express-session";
import Yurucomi from "./yurucomi";
//import Linda from "./linda";
// import settingListener from "./settingListener";

const debug = _debug("server:main");
dotenv.load();

const PORT: number = Number(process.env.PORT) || 3000;
const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000,
  },
});
const app = express();

const main = async () => {
  const server = createServer(app);
  const options = {
    cookie: false,
    serveClient: false,
    pingTimeout: 15000,
    pingInterval: 13000,
  };
  app.set("views", "views/");
  app.set("view engine", "pug");
  app.use(express.static("public/"));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(cookieParser());

  app.use(cors());
  app.use(express.static("public"));
  app.use(sessionMiddleware);

  app.use("/_api", routeApi);
  app.use("/", routeTop);
  app.use("/_logout", routeLogout);
  app.use("/_login", routeLogin);
  app.use("/_sessioncheck", routeSessionCheck);
  app.use("/", sessionCheck, routeMain);

  const io = socketIO(server, options);
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });
  const yurucomi = new Yurucomi(io);
  yurucomi.listen();
  // settingListener(io);

  app.set("yurucomi", yurucomi);
  app.set("io", io);

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
