import { Request, Response, NextFunction } from "express";

export function checkCsrfToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const csrfToken = req.cookies["XSRF-TOKEN"];
  const csrfHeader = req.headers["x-xsrf-token"];

  if (csrfToken && csrfHeader && csrfToken === csrfHeader) {
    next();
  } else {
    res.sendStatus(403);
  }
}
