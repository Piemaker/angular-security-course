import { Request, Response } from "express";
import { sessionStore } from "./session-store";
import { db } from "./database";
import * as argon2 from "argon2";
import { randomBytes } from "./util";

export function loginUser(req: Request, res: Response) {
  const credentials = req.body;
  const user = db.findUserByEmail(credentials.email);
  if (!user) {
    // send the minimal error response to avoid giving any information to the attacker
    res.status(403);
  } else {
    LoginAndBuildResponse(credentials, user, res);
  }
}

async function LoginAndBuildResponse(credentials, user, res) {
  try {
    const sessionId = await attemptLogin(credentials, user);
    res.cookie("SESSIONID", sessionId, { httpOnly: true, secure: true });
    res.status(200).json({ user });
    console.log("Login successful");
  } catch {
    console.log("Login failed");
    res.status(403);
  }
}

async function attemptLogin(credentials, user) {
  const isPasswordValid = await argon2.verify(
    user.passwordDigest,
    credentials.password
  );
  if (!isPasswordValid) {
    throw new Error("Password is invalid");
  }

  const sessionId = await randomBytes(32).then((bytes) =>
    bytes.toString("hex")
  );
  sessionStore.createSession(sessionId, user);
  console.log("🚀 ~ attemptLogin ~ sessionId:", sessionId);
  return sessionId;
}
