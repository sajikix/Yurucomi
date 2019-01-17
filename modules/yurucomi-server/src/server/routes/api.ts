import * as express from "express";
const router: express.Router = express.Router();
import { Tuple, LindaResponse } from "yurucomi-interfaces";
import _debug from "debug";
import app from "../index";

//debug用
import userSettings from "../userSettings";
import Yurucomi from "../yurucomi";

const debug = _debug("server:router");

router.get(
  "/:tupleSpaceName/:operation",
  async (req: express.Request, res: express.Response) => {
    const yurucomi: Yurucomi = app.get("yurucomi");
    const ys = yurucomi.yurucomiSpace(req.params.tupleSpaceName);
    switch (req.params.operation) {
      case "write":
        let fromCheck: boolean = false;
        const writeTuple = req.query;
        if (writeTuple._from) {
          fromCheck = true;
        } else if (req.session && req.session.userName) {
          writeTuple._from = req.session.userName;
          fromCheck = true;
        }
        if (fromCheck) {
          ys.write(req.query);
          res.send(req.query);
        } else {
          res.send("error: no _from info");
        }

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
