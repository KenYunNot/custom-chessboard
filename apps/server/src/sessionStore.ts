export type Session = {
  me: string;
  opponent: string;
  gameId: string;
};

export class SessionStore {
  sessions;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(session: Session) {
    let id = Math.ceil(Math.random() * 10000000).toString();
    while (this.findSession(id)) id = Math.ceil(Math.random() * 10000000).toString();
    this.sessions.set(id, session);
    return id;
  }

  removeSession(id: string) {
    this.sessions.delete(id);
  }
}
