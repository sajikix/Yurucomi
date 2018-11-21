import express from "express";
const router: express.Router = express.Router();
import _debug from "debug";
const debug = _debug("server:router");

router.get("/", (req: express.Request, res: express.Response) => {
  res.render("index");
});

export default router;
