import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { computeStaffFlags } from '@/lib/staffRoles';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  /** false enquanto existir sessão mas ainda não terminou a leitura de st_user_roles (evita redirect errado no /admin). */
  rolesReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rolesReady, setRolesReady] = useState(true);
  const lastResolvedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Sessão inicial já é resolvida em getSession().then (roles + isLoading); evita corrida dupla.
        if (event === 'INITIAL_SESSION') {
          return;
        }

        const uid = session?.user?.id ?? null;

        if (!uid) {
          lastResolvedUserIdRef.current = null;
          setIsAdmin(false);
          setIsEditor(false);
          setRolesReady(true);
          return;
        }

        // Evita deadlock do Supabase: não chamar supabase.* síncrono dentro do callback sem deferir
        if (event === 'TOKEN_REFRESHED' && lastResolvedUserIdRef.current === uid) {
          return;
        }

        lastResolvedUserIdRef.current = uid;
        setRolesReady(false);
        setTimeout(() => {
          void checkUserRoles(uid).finally(() => setRolesReady(true));
        }, 0);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      const uid = session?.user?.id ?? null;
      if (uid) {
        lastResolvedUserIdRef.current = uid;
        setRolesReady(false);
        checkUserRoles(uid)
          .finally(() => {
            setRolesReady(true);
            setIsLoading(false);
          });
      } else {
        lastResolvedUserIdRef.current = null;
        setRolesReady(true);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoles = async (userId: string) => {
    const clearStaff = () => {
      setIsAdmin(false);
      setIsEditor(false);
    };

    try {
      const { data: roles, error: rolesError } = await supabase
        .from('st_user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError || !roles) {
        clearStaff();
        return;
      }

      const { isAdmin: hasAdmin, isEditor: hasEditor } = computeStaffFlags(roles);
      setIsAdmin(hasAdmin);
      setIsEditor(hasEditor);
    } catch (error) {
      console.error('Error checking roles:', error);
      clearStaff();
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/admin`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isAdmin, 
        isEditor, 
        isLoading,
        rolesReady,
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
