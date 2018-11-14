import express from "express";
const router: express.Router = express.Router();
import { Tuple } from "yurucomi-interfaces";
import {
  InsertOneWriteOpResult,
  ResponseTuple,
  LindaOperation,
} from "../linda/interfaces";
import _debug from "debug";
import app from "../index";
import Linda from "../../server/linda";

//debug用
import mdb from "../linda/db/memoryDB";
import userSettings from "../userSettings";

const debug = _debug("server:router");

router.get(
  "/:tupleSpaceName/:operation",
  async (req: express.Request, res: express.Response) => {
    const linda: Linda = app.get("linda");
    const ts = linda.tupleSpace(req.params.tupleSpaceName);
    switch (req.params.operation) {
      case "read":
        //   debug("read operation is WIP");
        ts.read(req.query, (Data: ResponseTuple) => {
          res.send(Data);
        });
        break;
      case "write":
        // FIXME:本来_fromをここで計算/sessionから
        // const writeTuple = { ...req.query, _time: Date.now(), _from: "saji" };
        // debug(`write:${JSON.stringify(writeTuple)}`);
        // await iginitionCheck(req.params.tupleSpaceName, writeTuple);
        ts.write(
          { payload: req.query, tsName: req.params.tupleSpaceName },
          Data => {
            res.send(Data);
          }
        );
        break;
      case "db":
        res.send(mdb[req.params.tupleSpaceName]);
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
