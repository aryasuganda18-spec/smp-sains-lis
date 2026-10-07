import { createContext, useContext } from 'react';

export type AuthStatus = 'loading' | 'signed-out' | 'forbidden' | 'admin';

export interface AuthValue {
  status: AuthStatus;
  email: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return value;
}
