import { Request, Response, NextFunction } from "express";

export function checkIfAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req["userId"];

  if (userId) {
    next();
  } else {
    res.sendStatus(403);
  }
}
