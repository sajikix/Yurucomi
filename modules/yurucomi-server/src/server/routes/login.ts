import express from "express";
const router: express.Router = express.Router();
import axios from "axios";
import _debug from "debug";
const debug = _debug("server:router/login");

router.post("/", async (req: express.Request, res: express.Response) => {
  if (req.body.userName && req.body.groupName) {
    if (req.session) {
      const response = await axios.get(
        "https://scrapbox.io/api/pages/yurucomi"
      );
      const userList: Array<string> = response.data.pages.map(
        (ele: { [key: string]: any }) => {
          return ele.title.toLowerCase();
        }
      );
      const index = userList.findIndex(ele => {
        return ele === req.body.userName;
      });
      if (index >= 0) {
        req.session.userName = req.body.userName;
        req.session.groupName = req.body.goupNaem;
        debug("login success");
        res.json({ result: true, name: req.body.userName });
      } else {
        res.json({ result: false, name: null });
      }
    } else {
      debug("login failed");
      res.json({ result: false, name: null });
    }
  } else {
    debug("login failed");
    res.json({ result: false, name: null });
  }
});

router.get("/:tsName", (req: express.Request, res: express.Response) => {
  res.render("index");
});
router.get("/", (req: express.Request, res: express.Response) => {
  res.render("index");
});

export default router;
