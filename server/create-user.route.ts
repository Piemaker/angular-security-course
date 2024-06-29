import { Request, Response } from "express";
import { db } from "./database";
import * as argon2 from "argon2";
import { validatePassword } from "./password-validation";
import moment = require("moment");
import { randomBytes } from "./util";
import { sessionStore } from "./session-store";

export function createUser(req: Request, res: Response) {
  const credentials = req.body;

  const errors = validatePassword(credentials.password);

  if (errors.length > 0) {
    res.status(400).json({ errors });
  } else {
    createUserAndSession(res, credentials);
  }
}

async function createUserAndSession(res: Response, credentials) {
  const passwordDigest = await argon2.hash(credentials.password);

  const user = db.createUser(credentials.email, passwordDigest);
  const sessionId = await randomBytes(32).then((bytes) =>
    bytes.toString("hex")
  );
  // TODO replace with JWT
  // const sessionToken = 1;
  console.log("🚀 ~ createUserAndSession ~ sessionId:", sessionId);
  sessionStore.createSession(sessionId, user);
  // httpOnly Flags the cookie to be accessible only by the web server (means you can't access it on the client side with document.cookie)
  // secure Marks the cookie to be used with HTTPS only.
  res.cookie("SESSIONID", sessionId, { httpOnly: true, secure: true });

  res.status(200).json({ id: user.id, email: user.email });
}
