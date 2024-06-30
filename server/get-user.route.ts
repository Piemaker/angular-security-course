import { Request, Response } from "express";
import { db } from "./database";

export function getUser(req: Request, res: Response) {
  const user = db.findUserById(req["userId"]);

  if (user) {
    console.log("🚀 ~ getUser ~ user:", user);
    res.status(200).json({ id: user.id, email: user.email });
  } else {
    res.sendStatus(204);
  }
}
