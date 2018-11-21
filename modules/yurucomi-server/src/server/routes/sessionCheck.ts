import express from "express";
const router: express.Router = express.Router();
import _debug from "debug";
import axios from "axios";

const debug = _debug("server:router/sessionCheck");

router.get("/", async (req: express.Request, res: express.Response) => {
  if (req.session) {
    if (req.session.userName) {
      debug(`session name:${req.session.userName}`);
      const response = await axios.get(
        "https://scrapbox.io/api/pages/yurucomi"
      );
      const userList: Array<string> = response.data.pages.map(
        (ele: { [key: string]: any }) => {
          return ele.title.toLowerCase();
        }
      );
      const index = userList.findIndex(ele => {
        if (req.session) {
          return ele === req.session.userName;
        }
        return false;
      });
      if (index >= 0) {
        res.json({
          result: true,
          name: req.session.userName,
          icon: response.data.pages[index].image,
        });
      } else {
        debug("no such user");
        res.json({ result: false, name: null });
      }
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
