import { User } from "../src/app/model/user";
import { Session } from "./session";

class SessionStore {
  private sessions: { [key: string]: Session } = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }

  findUserBySessionId(sessionId: string): User | undefined {
    const session = this.sessions[sessionId];

    return this.isSessionValid(sessionId) ? session.user : undefined;
  }

  isSessionValid(sessionId: any) {
    const session = this.sessions[sessionId];
    return session && session.isValid();
  }
  destroySession(sessionId: any) {
    delete this.sessions[sessionId];
  }
}

export const sessionStore = new SessionStore();
