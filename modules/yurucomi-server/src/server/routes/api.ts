import * as express from "express";
const router: express.Router = express.Router();
import { Tuple, LindaResponse } from "yurucomi-interfaces";
import { ResponseTuple, LindaOperation } from "../../linda/interfaces";
import _debug from "debug";
import app from "../index";
import LindaClient from "linda-client";

//debug用
import memoryDB from "../../linda/db/memoryDB";
import userSettings from "../userSettings";
import Yurucomi from "../yurucomi";
import tupleSpace from "../../linda/tupleSpace";
import { write } from "fs";

const debug = _debug("server:router");
const lindaClient = new LindaClient();
router.get(
  "/:tupleSpaceName/:operation",
  async (req: express.Request, res: express.Response) => {
    const yurucomi: Yurucomi = app.get("yurucomi");
    await lindaClient.connect(
      // "https://new-linda.herokuapp.com",
      "http://localhost:7777",
      req.params.tupleSpaceName
    );
    switch (req.params.operation) {
      case "read":
        // yurucomi.read(
        //   { tsName: req.params.tupleSpaceName, payload: req.query },
        //   (data: LindaResponse) => {
        //     res.send(data);
        //   }
        // );
        const resData = await lindaClient.read(req.query);
        res.send(resData);
        break;
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
          const resData = await lindaClient.write(writeTuple);
          res.send(resData);
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
