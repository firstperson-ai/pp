'use client';

import { useEffect, useState, forwardRef } from 'react';
import { useSupabase } from '../../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import MotionButton from '../../components/common/MotionButton';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = forwardRef((props, ref) => {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Signup failed');

      // Store user ID in local storage
      localStorage.setItem('userId', result.userId);
      console.log('Signup successful, userId stored:', result.userId);
      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: '#f472b6', boxShadow: '0 0 10px rgba(244, 114, 182, 0.5)' },
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-800 via-purple-800 to-indigo-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-15"
              initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
              animate={{
                y: ['-20%', '120%'],
                scale: [0.5, 1, 0.5],
                opacity: [0.1, 0.4, 0.1],
                transition: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ))}
        </div>

        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(244, 114, 182, 0.3)' }}
          className="max-w-md w-full p-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-pink-500/20 relative z-10 transition-all duration-500"
        >
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent text-center tracking-tight"
          >
            Join the Adventure
          </motion.h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 text-red-600 bg-red-100 dark:bg-red-900/50 rounded-xl text-center shadow-md border border-red-300/50"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">Name</label>
              <motion.div variants={inputVariants} whileFocus="focus" className="mt-2">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  placeholder="Your Name"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <div>
              <label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">Email</label>
              <motion.div variants={inputVariants} whileFocus="focus" className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <div>
              <label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">Password</label>
              <motion.div variants={inputVariants} whileFocus="focus" className="mt-2">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <MotionButton
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-xl" />
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing Up...
                </span>
              ) : (
                'Sign Up'
              )}
            </MotionButton>
          </form>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05, color: '#f472b6' }}
              className="text-pink-500 font-medium hover:underline transition-colors duration-200"
            >
              Login
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
    </Suspense>
  );
});

SignUpPage.displayName = 'SignUpPage';

export default SignUpPage;