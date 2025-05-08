export type Session = {
  gameId: number;
  // userId: string;
};

export class SessionStore {
  sessions;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: number) {
    return this.sessions.get(id);
  }

  saveSession(id: number, session: Session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}
