import { db } from "./database";
import { sessionStore } from "./session-store";

export function readAllLessons(req, res) {
  const sessionId = req.cookies["SESSIONID"];
  const isSessionValid = sessionStore.isSessionValid(sessionId);

  if (!isSessionValid) {
    res.status(403);
  } else {
    // return an object to avoid JSON hijacking
    res.status(200).json({ lessons: db.readAllLessons() });
  }
}
