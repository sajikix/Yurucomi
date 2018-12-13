import express from "express";
const router: express.Router = express.Router();
import { Tuple } from "yurucomi-interfaces";
import { ResponseTuple, LindaOperation } from "../../linda/interfaces";
import _debug from "debug";
import app from "../index";

//debug用
import memoryDB from "../../linda/db/memoryDB";
import userSettings from "../userSettings";
import Yurucomi from "../yurucomi";

const debug = _debug("server:router");

router.get(
  "/:tupleSpaceName/:operation",
  async (req: express.Request, res: express.Response) => {
    const yurucomi: Yurucomi = app.get("yurucomi");
    switch (req.params.operation) {
      case "read":
        yurucomi.read(
          { tsName: req.params.tupleSpaceName, payload: req.query },
          (data: ResponseTuple) => {
            res.send(data);
          }
        );
        break;
      case "write":
        let from = null;
        if (req.session && req.session.userName) {
          from = req.session.userName;
        }
        if (req.query._from) {
          from = req.query._from;
          delete req.query._from;
        }
        if (from) {
          yurucomi.write(
            {
              payload: req.query,
              tsName: req.params.tupleSpaceName,
              from: from,
            },
            Data => {
              res.send(Data);
            }
          );
        } else {
          res.send("error: no _from info");
        }

        break;
      case "db":
        res.send(memoryDB[req.params.tupleSpaceName]);
        break;
      case "settings":
        res.send(userSettings[req.params.tupleSpaceName]);
        break;
      default:
        res.send('There is no operation like "' + req.params.operation + '"');
        break;
    }
  }
);

router.post(
  "/:tupleSpaceName",
  async (req: express.Request, res: express.Response) => {
    // FIXME:本来_fromをここで計算
    const writeTuple: Tuple = {
      ...req.query,
      _time: Date.now(),
      _from: "hoge",
    };
    await debug(`write tuple:${writeTuple}`);
  }
);

export default router;
