import express from "express";
const sessionCheck = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const tsName = req.originalUrl.match(/^\/\_.+$/)
    ? ""
    : req.originalUrl.slice(1);
  if (req.session) {
    if (req.session.userName) {
      next();
    } else {
      res.redirect(`/_login?where=${tsName}`);
    }
  } else {
    res.redirect(`/_login?where=${tsName}`);
  }
};

export default sessionCheck;
