import express from "express";
const router: express.Router = express.Router();
import iginitionCheck from "../ignitionCheck";
import { Tuple } from "yurucomi-interfaces";
import _debug from "debug";

const debug = _debug("server:router");

router.get(
  "/:tupleSpaceName/:operation",
  async (req: express.Request, res: express.Response) => {
    switch (req.params.operation) {
      case "read":
        debug("read operation is WIP");
        break;
      case "write":
        // FIXME:本来_fromをここで計算
        const writeTuple = { ...req.query, _time: Date.now(), _from: "saji" };
        debug(`write request tuple:${JSON.stringify(writeTuple)}`);
        await iginitionCheck(req.params.tupleSpaceName, writeTuple);
        await res.send("writed!");
        break;
      case "write2":
        // FIXME:本来_fromをここで計算
        const writeTuple2 = { ...req.query, _time: Date.now(), _from: "huga" };
        debug(`write request tuple:${JSON.stringify(writeTuple2)}`);
        await iginitionCheck(req.params.tupleSpaceName, writeTuple2);
        await res.send("writed!");
        break;
      default:
        res.send('There is no operation like "' + req.params.operation + '"');
        break;
    }
  }
);

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("index");
});

router.get(
  "/:tupleSpaceName",
  (req: express.Request, res: express.Response) => {
    res.send(`Here is ${req.params.tupleSpaceName}`);
  }
);

router.post(
  "/:tupleSpaceName",
  async (req: express.Request, res: express.Response) => {
    // FIXME:本来_fromをここで計算
    const writeTuple: Tuple = {
      ...req.query,
      _time: Date.now(),
    };
    await iginitionCheck(req.params.tupleSpaceName, writeTuple);
    await debug(`write tuple:${writeTuple}`);
  }
);

export default router;
