import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
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

  useEffect(() => {
    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer role checking to avoid blocking
          setTimeout(async () => {
            await checkUserRoles(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserRoles(session.user.id).finally(() => setIsLoading(false));
      } else {
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

      const norm = (r: string) => String(r).trim().toLowerCase();

      // Painel do site: somente admin/editor em st_user_roles (enum app_role).
      // Linhas com role `user` não liberam o admin. `directory_member` existe só em profiles, não aqui.
      const siteStaffRoles = roles.filter((r) => {
        const role = norm(r.role);
        return role === 'admin' || role === 'editor';
      });

      const hasAdmin = siteStaffRoles.some((r) => norm(r.role) === 'admin');
      const hasEditor =
        siteStaffRoles.some((r) => norm(r.role) === 'editor') || hasAdmin;

      // profiles.role = directory_member (drive) não entra aqui: sem linha admin/editor em st_user_roles = sem painel.
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
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
