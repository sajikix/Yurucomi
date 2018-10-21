import express from "express";
import _debug from "debug";
import dotenv from "dotenv";
import cors from "cors";

const debug = _debug("server:main");
dotenv.load();

const main = async () => {
  const PORT: number = Number(process.env.PORT) || 3000;
  const app = express();
  app.use(cors());
  app.use(express.static("public"));

  app.listen(PORT, async () => {
    debug(`Yurucomi http server listen on :${PORT}`);
    debug(`process.env.NODE_ENV=${String(process.env.NODE_ENV)}`);
  });
};

main().catch(e => {
  process.exit(1);
});
