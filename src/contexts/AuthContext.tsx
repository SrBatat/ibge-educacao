'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  auth_id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_banned: boolean;
  avatar_url: string | null;
  last_login: string | null;
  created_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (authUser: any) => {
    if (!authUser) { setProfile(null); return; }
    const { data, error } = await supabase
      .from('tb_users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single();
    if (error) {
      console.error('[Auth] Erro perfil:', error);
      setProfile(null);
    } else if (data) {
      setProfile(data as Profile);
      await supabase.from('tb_users').update({ last_login: new Date().toISOString() }).eq('auth_id', authUser.id);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      await loadProfile(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: prof } = await supabase.from('tb_users').select('id, username').eq('auth_id', session.user.id).single();
        if (prof) await supabase.from('tb_access_logs').insert({ user_id: prof.id, username: prof.username, acao: 'LOGIN' });
      }
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); return { error: authError.message }; }

    // Check if user is banned
    if (authData.user) {
      const { data: userProfile } = await supabase
        .from('tb_users')
        .select('is_banned')
        .eq('auth_id', authData.user.id)
        .single();

      if (userProfile?.is_banned) {
        await supabase.auth.signOut();
        const msg = 'Esta conta foi banida. Entre em contato com um administrador.';
        setError(msg);
        return { error: msg };
      }
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string, username: string) => {
    setError(null);
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    if (authError) { setError(authError.message); return { error: authError.message }; }
    if (authData.user) {
      const { error: profileError } = await supabase.from('tb_users').insert({ auth_id: authData.user.id, username, email, role: 'USER' });
      if (profileError) { setError(profileError.message); return { error: profileError.message }; }
    }
    return { error: null };
  };

  const signOut = async () => {
    if (profile) await supabase.from('tb_access_logs').insert({ user_id: profile.id, username: profile.username, acao: 'LOGOUT' });
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const isAdmin = () => profile?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, signUp, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
};
