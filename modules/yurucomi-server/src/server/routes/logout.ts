import express from "express";
const router: express.Router = express.Router();
import _debug from "debug";
const debug = _debug("server:router/logout");

router.get("/", (req: express.Request, res: express.Response) => {
  if (req.session) {
    if (req.session.userName) {
      debug(`userName-session was deleted`);
      delete req.session.userName;
    }
    if (req.session.groupName) {
      debug(`groupName-session was deleted`);
      delete req.session.groupName;
    }
    res.send({ logouted: true });
  } else {
    res.send({ logouted: true });
  }
});

export default router;
