import express from "express";
const sessionCheck = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session) {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/_login");
    }
  } else {
    res.redirect("/_login");
  }
};

export default sessionCheck;
