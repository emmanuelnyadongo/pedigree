interface Session {
  supplierId: string;
  expiry: number;
}

export interface SessionManager {
  getSession: (token: string) => string | undefined;
  createSession: (token: string, supplierId: string) => Promise<Session>;
}

export async function createLowdbSessions(sessionDuration: number) {
  // Import JSONFilePreset
  const { JSONFilePreset } = await import("lowdb/node");

  // Create database
  const db = await JSONFilePreset("sessionsdb.json", { sessions: {} });

  const sessionManager: SessionManager = {
    getSession: (token: string) => {
      // @ts-ignore
      const session = db.data.sessions[token];
      if (session) {
        if (session.expiry > Date.now()) {
          return session.supplierId;
        } else {
          // Session has expired
          // @ts-ignore
          delete db.data.sessions[token];
          db.write();
          return undefined;
        }
      } else {
        return undefined;
      }
    },
    createSession: async (token: string, supplierId: string) => {
      const session: Session = {
        supplierId,
        expiry: Date.now() + sessionDuration,
      };
      // @ts-ignore
      db.data.sessions[token] = session;
      await db.write();
      return session;
    },
  };

  return sessionManager;
}
