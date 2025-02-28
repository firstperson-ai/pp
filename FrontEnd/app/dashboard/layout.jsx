// FrontEnd/app/dashboard/layout.jsx
'use client';

import { Suspense } from 'react';
import { SupabaseProvider } from '../../utils/supabase'; // Import SupabaseProvider
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { motion } from 'framer-motion'; // Optional for animations
import { useSupabase } from '../../utils/supabase'; // For debugging

export default function DashboardRootLayout({ children }) {
  const { user } = useSupabase() || {}; // Debug user at root layout level

  console.log('DashboardRootLayout user:', user); // Log user state in root layout

  return (
    <SupabaseProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-lg font-semibold">Loading...</div>}>
        <DashboardLayout>{children}</DashboardLayout>
      </Suspense>
    </SupabaseProvider>
  );
}