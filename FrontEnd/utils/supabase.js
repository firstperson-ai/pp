// FrontEnd/utils/supabase.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Ensure environment variables exist
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

// Initialize Supabase client (client-side only)
let supabaseClient = null;

if (typeof window !== 'undefined') {
  supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Create context
const SupabaseContext = createContext({ supabase: null, user: null });

// Provider component
export function SupabaseProvider({ children }) {
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log('Initializing Supabase client in SupabaseProvider (localhost:3000, backend on 3001)');
    // Set Supabase client on mount (client-side only)
    setSupabase(supabaseClient);

    const fetchUser = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) {
        console.error('Error fetching session in SupabaseProvider (localhost:3000, backend on 3001):', error);
        setUser(null);
      } else {
        setUser(session?.user || null);
        console.log('Initial user state in SupabaseProvider (localhost:3000, backend on 3001):', session?.user);
      }
    };

    fetchUser();

    // Subscribe to auth state changes with detailed logging
    const { data: listener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in SupabaseProvider (localhost:3000, backend on 3001):', event, session?.user, 'Current user:', user);
      setUser(session?.user || null);
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, navigating to /dashboard (localhost:3000, backend on 3001):', session.user);
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log('User signed out, navigating to /login (localhost:3000, backend on 3001)');
        router.push('/login');
      }
    });

    return () => {
      console.log('Cleaning up SupabaseProvider subscription (localhost:3000, backend on 3001)');
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const value = { supabase, user };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to use Supabase with consistent Hooks order and port debugging
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    console.error('useSupabase() called outside <SupabaseProvider> (localhost:3000, backend on 3001) - returning null values');
    return { supabase: null, user: null };
  }

  // Always call useState and useEffect in the same order
  const [isClient, setIsClient] = useState(false);
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    console.log('Setting isClient to true in useSupabase (localhost:3000, backend on 3001)');
    setIsClient(true);
  }, []);

  // Handle auth state changes only on client-side
  useEffect(() => {
    if (!isClient || !context.supabase) {
      console.log('Skipping auth subscription in useSupabase (localhost:3000, backend on 3001) - not client-side or supabase is null:', { isClient, supabase: context.supabase });
      return;
    }

    console.log('Setting up auth subscription in useSupabase (localhost:3000 ATS score, backend on 3001), user:', context.user);
    const subscription = context.supabase.auth.onAuthStateChange((_, session) => {
      console.log('User updated in useSupabase (localhost:3000 ATS score, backend on 3001):', session?.user, 'Current context:', context);
      setForceUpdate((prev) => prev + 1);
    });

    return () => {
      console.log('Cleaning up auth subscription in useSupabase (localhost:3000, backend on 3001)');
      subscription.data.subscription.unsubscribe();
    };
  }, [isClient, context.supabase]);

  // Return null during SSR to prevent errors
  if (!isClient) {
    console.log('Returning null during SSR in useSupabase (localhost:3000, backend on 3001)');
    return { supabase: null, user: null };
  }

  console.log('useSupabase returning in ATS score (localhost:3000, backend on 3001):', context);
  return context;
}

export { supabaseClient as supabase };