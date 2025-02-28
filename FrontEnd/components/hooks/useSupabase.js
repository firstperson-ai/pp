'use client';

import { useEffect, useState } from 'react';
import { supabase, useSupabase as useSupabaseUtil } from '../utils/supabase';

export function useSupabase() {
  const [user, setUser] = useState(null);
  const { supabase } = useSupabaseUtil();

  useEffect(() => {
    setUser({ id: 'mock-user-id', email: 'user@example.com' });
  }, []);

  return {
    supabase,
    user,
  };
}
