import type { Session } from '@supabase/supabase-js';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { type AuthStatus, type AuthValue, AuthContext } from './authContext';
import { adminDb } from './supabase';

interface AdminCheck {
  userId: string;
  isAdmin: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [adminCheck, setAdminCheck] = useState<AdminCheck | null>(null);

  useEffect(() => {
    void adminDb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = adminDb.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void adminDb
      .from('admin_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setAdminCheck({ userId, isAdmin: data !== null });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await adminDb.auth.signInWithPassword({ email, password });
    return error === null;
  }, []);

  const signOut = useCallback(async () => {
    await adminDb.auth.signOut();
  }, []);

  const value = useMemo<AuthValue>(() => {
    const checked = adminCheck !== null && adminCheck.userId === userId;
    let status: AuthStatus;
    if (session === undefined) status = 'loading';
    else if (session === null) status = 'signed-out';
    else if (!checked) status = 'loading';
    else status = adminCheck.isAdmin ? 'admin' : 'forbidden';
    return { status, email: session?.user.email ?? null, signIn, signOut };
  }, [session, userId, adminCheck, signIn, signOut]);

  return <AuthContext value={value}>{children}</AuthContext>;
}
