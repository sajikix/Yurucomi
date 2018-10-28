import express from "express";
const router: express.Router = express.Router();
import _debug from "debug";

const debug = _debug("server:router/sessionCheck");

router.get("/", (req: express.Request, res: express.Response) => {
  if (req.session) {
    if (req.session.userName) {
      debug(`session name:${req.session.userName}`);
      res.json({ result: true, name: req.session.userName });
    } else {
      debug("no session");
      res.json({ result: false, name: null });
    }
  } else {
    debug("no session");
    res.json({ result: false, name: null });
  }
});

export default router;
