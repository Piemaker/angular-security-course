import { Request, Response } from "express";
import { db } from "./database";

export function userInfo(req: Request, res: Response) {
  const uerInfo = req?.user;
  console.log("🚀 ~ userInfo ~ uerInfo:", uerInfo);

  let user = db.findUserByEmail(uerInfo.email);

  if (!user) {
    user = db.createUser(uerInfo.email, userInfo?.sub);
  }
  res.status(200).json({ email: user.email });
}
