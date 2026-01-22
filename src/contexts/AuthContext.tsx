import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, DEMO_MODE } from '@/integrations/supabase/client';
import { MOCK_USER, MOCK_PROFILE } from '@/integrations/supabase/mockData';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch profile and role
          setTimeout(async () => {
            await fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserData(userId: string) {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Check if admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      setIsAdmin(!!roleData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(email: string, password: string, name: string, phone: string) {
    try {
      // Demo mode: mock signup
      if (DEMO_MODE) {
        console.log('🔧 [DEMO] Signup:', { email, name, phone });
        localStorage.setItem('auth_user', JSON.stringify({ ...MOCK_USER, email, phone, name }));
        localStorage.setItem('auth_profile', JSON.stringify({ ...MOCK_PROFILE, phone, name }));
        localStorage.setItem('auth_token', 'demo-token');
        toast.success('Demo account created!');
        setUser(MOCK_USER as any);
        setProfile(MOCK_PROFILE as any);
        setIsAdmin(true);
        return { error: null };
      }

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          },
        },
      });

      if (error) return { error: new Error(error.message) };

      // If user created, also create a profile row and default user role
      try {
        const userId = data.user?.id;
        if (userId) {
          // Create profile
          await supabase.from('profiles').insert({ user_id: userId, name, phone });
          // Create user role
          await supabase.from('user_roles').insert({ user_id: userId, role: 'user' });
          
          // Auto-confirm email by directly signing in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInError) {
            setUser(data.user);
            toast.success('Account created and logged in!');
            return { error: null };
          }
        }
      } catch (e) {
        console.error('Failed to create profile or role:', e);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      // Demo mode: mock signin
      if (DEMO_MODE) {
        console.log('🔧 [DEMO] Sign in:', { email });
        localStorage.setItem('auth_user', JSON.stringify(MOCK_USER));
        localStorage.setItem('auth_profile', JSON.stringify(MOCK_PROFILE));
        localStorage.setItem('auth_token', 'demo-token');
        toast.success('Demo login successful!');
        setUser(MOCK_USER as any);
        setProfile(MOCK_PROFILE as any);
        setIsAdmin(true);
        return { error: null };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async function signOut() {
    if (DEMO_MODE) {
      console.log('🔧 [DEMO] Sign out');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_profile');
      localStorage.removeItem('auth_token');
      toast.success('Logged out');
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
