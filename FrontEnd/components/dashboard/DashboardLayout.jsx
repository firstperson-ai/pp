'use client';

import MotionButton from '../common/MotionButton';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '../../utils/supabase';
import { useEffect, Suspense } from 'react';

const Navbar = forwardRef((props, ref) => {
  const { children } = props;
  return (
    <nav
      ref={ref}
      className="bg-[linear-gradient(90deg,_#1A001F_0%,_#003333_50%,_#1F2A00_100%)] text-white py-6 px-8 shadow-[0_0_30px_rgba(170,0,255,0.4)] relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(170,0,255,0.2)_0%,_transparent_70%)]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15], transition: { duration: 5, repeat: Infinity } }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 10% 30%, rgba(0, 170, 170, 0.25) 0%, transparent 60%)',
            'radial-gradient(circle at 90% 70%, rgba(170, 255, 0, 0.25) 0%, transparent 60%)',
          ],
          transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      {children}
    </nav>
  );
});

Navbar.displayName = 'Navbar';

const NavItem = forwardRef(({ href, children, onClick }, ref) => {
  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      whileHover={{
        scale: 1.1,
        color: '#AAFF00',
        background: 'rgba(170, 0, 255, 0.25)',
        boxShadow: '0 0 20px rgba(0, 170, 170, 0.6), inset 0 0 10px rgba(170, 255, 0, 0.4)',
        borderRadius: '10px',
      }}
      whileTap={{ scale: 0.92, rotate: 1 }}
      className="block p-3 rounded-lg text-[#D0D0E5] hover:text-[#AAFF00] transition-all duration-250 cursor-pointer relative overflow-hidden"
      aria-label={`Navigate to ${children}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00AAAA]/15 to-transparent"
        animate={{ x: ['-100%', '100%'], transition: { duration: 1.8, repeat: Infinity, ease: 'linear' } }}
      />
      <span className="relative z-10 font-medium">{children}</span>
    </motion.a>
  );
});

NavItem.displayName = 'NavItem';

export default function DashboardLayout({ children }) {
  const { user, supabase } = useSupabase() || {}; // Use with fallback for safety
  const router = useRouter();

  console.log('DashboardLayout user (ATS score context):', user); // Log user state for debugging

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
        router.push('/login');
      } else {
        console.error('Supabase client not available for logout');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -25, rotate: -3 },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: { type: 'spring', stiffness: 450, damping: 18 },
    },
  };

  const logoVariants = {
    float: {
      y: [-8, 8, -8],
      rotate: [0, 3, -3, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[linear-gradient(135deg,_#0A0015_0%,_#001F1F_50%,_#1A3300_100%)] overflow-hidden">
      <header>
        <Navbar>
          <div className="flex items-center justify-between max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 130 }}
              className="flex items-center"
            >
              <motion.svg
                className="h-12 w-12 mr-4 text-[#AAFF00] shadow-[0_0_15px_rgba(170,255,0,0.7)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={logoVariants}
                animate="float"
                whileHover={{
                  scale: 1.15,
                  rotate: 360,
                  boxShadow: '0 0 35px rgba(0, 170, 170, 0.8)',
                  transition: { duration: 0.7, ease: 'easeInOut' },
                }}
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <motion.path
                  d="M12 8A4 4 0 0 1 16 12A4 4 0 0 1 12 16A4 4 0 0 1 8 12A4 4 0 0 1 12 8"
                  fill="none"
                  stroke="#00AAAA"
                  strokeWidth="1"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4], transition: { duration: 2, repeat: Infinity } }}
                />
              </motion.svg>
              <motion.span
                className="text-3xl font-extrabold bg-gradient-to-r from-[#AA00FF] via-[#00AAAA] to-[#AAFF00] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                whileHover={{
                  textShadow: '0 0 25px rgba(0, 170, 170, 0.8), 0 0 10px rgba(170, 255, 0, 0.6)',
                  scale: 1.03,
                }}
              >
                AI Resume Builder
              </motion.span>
            </motion.div>
            <div>
              <MotionButton
                onClick={handleLogout}
                className="bg-[rgba(170,0,255,0.15)] text-[#AAFF00] hover:bg-[rgba(170,0,255,0.3)] hover:text-[#FFFFFF] transition-all duration-300 rounded-xl px-4 py-2 shadow-[0_0_12px_rgba(0,170,170,0.4)] hover:shadow-[0_0_25px_rgba(0,170,170,0.7)] relative overflow-hidden"
                aria-label="Logout"
                whileHover={{ scale: 1.07, rotate: 2 }}
                whileTap={{ scale: 0.93, rotate: -2 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00AAAA]/25 to-transparent"
                  animate={{ x: ['-100%', '100%'], transition: { duration: 1.3, repeat: Infinity, ease: 'linear' } }}
                />
                <span className="relative z-10 font-semibold">Logout</span>
              </MotionButton>
            </div>
          </div>
        </Navbar>
      </header>
      <div className="flex-1 flex relative">
        {/* Particle Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 120 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-gradient-to-r from-[#AA00FF] via-[#00AAAA] to-[#AAFF00] rounded-full shadow-[0_0_8px_rgba(170,255,0,0.5)]"
              initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
              animate={{
                y: ['-40%', '140%'],
                scale: [0.3, 1, 0.3],
                opacity: [0.6, 0.3, 0.6],
                rotate: [0, 540],
                transition: {
                  duration: Math.random() * 2.5 + 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 1.5,
                },
              }}
            />
          ))}
        </div>
        <aside className="w-64 bg-[rgba(10,0,21,0.9)] dark:bg-[rgba(0,0,0,0.95)] p-6 shadow-[0_0_40px_rgba(170,0,255,0.3)] border-r border-[#00AAAA]/25 backdrop-blur-lg">
          <motion.nav
            variants={navVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 relative"
          >
            {[
              'Dashboard',
              'Create New Resume',
              'ATS Score',
              'Subscription',
              'Profile',
              'Resume History',
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="cursor-pointer rounded-lg relative"
                whileHover={{ x: 4 }}
              >
                <NavItem
                  href={
                    item === 'Dashboard' ? '/dashboard' :
                    item === 'Create New Resume' ? '/dashboard/resume-builder' :
                    item === 'ATS Score' ? '/dashboard/ats-score' :
                    item === 'Subscription' ? '/pricing' :
                    item === 'Profile' ? '/dashboard/profile' :
                    '/dashboard/resume-history'
                  }
                  aria-label={`Navigate to ${item}`}
                >
                  {item}
                </NavItem>
              </motion.div>
            ))}
            <motion.div
              className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#AA00FF] to-[#00AAAA] rounded-full"
              animate={{ scaleY: [1, 1.05, 1], transition: { duration: 1.8, repeat: Infinity } }}
            />
          </motion.nav>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto bg-[linear-gradient(to_bottom,_rgba(10,0,21,0.9)_0%,_rgba(31,42,0,0.9)_100%)] relative">
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#AAFF00] text-xl animate-pulse">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}