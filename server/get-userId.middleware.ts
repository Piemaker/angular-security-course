import { Request, Response, NextFunction } from "express";
import { decodeJwt } from "./security.utils";

export function getUserId(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies["SESSIONID"];

  if (token) {
    handleSessionCookie(token, req)
      .then(() => {
        next();
      })
      .catch((err) => {
        console.log("🚀 ~ handleSessionCookie ~ err:", err.message);
        next();
      });
  } else {
    next();
  }
  // will block the request if there is no token
}

async function handleSessionCookie(jwt: string, req: Request) {
  try {
    const payload = await decodeJwt(jwt);
    req["userId"] = payload.sub;
  } catch (err) {
    console.log("🚀 ~ handleSessionCookie ~ err:", err.message);
  }
}
