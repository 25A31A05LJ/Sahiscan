import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from './types';
import { clearSession, loadSession, saveSession } from './store';

interface AuthContextValue {
  session: Session | null;
  login: (session: Session) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  const login = (s: Session) => {
    saveSession(s);
    setSession(s);
  };

  const logout = () => {
    clearSession();
    setSession(null);
  };

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
