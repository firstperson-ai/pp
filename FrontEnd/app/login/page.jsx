'use client';

import { useEffect, useState, forwardRef } from 'react';
import { useSupabase } from '../../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import MotionButton from '../../components/common/MotionButton';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from './ForgotPasswordModal';
import bcrypt from 'bcryptjs';

const GitHubIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.545 1.377.201 2.394.1 2.647.64.698 1.03 1.591 1.03 2.682 0 3.84-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.025-3.05-1.864-3.05-1.865 0-2.134 1.454-2.134 2.961v5.693h-3v-10h2.875v1.369h.041c.4-.757 1.391-1.369 2.846-1.369 3.049 0 3.61 2.008 3.61 4.621v5.379z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25h-11.3v4.5h6.53c-.27 1.42-1.09 2.62-2.35 3.42v2.96h3.78c2.2-2.03 3.54-5.02 3.54-8.63z"/>
    <path d="M12.06 19.87c-2.8 0-5.16-1.85-6.01-4.43h-3.77v2.96c1.56 3.12 4.82 5.13 8.78 5.13 2.64 0 4.87-.97 6.64-2.57l-3.64-2.84c-.86.58-1.96 1.02-3.6 1.02z"/>
    <path d="M5.05 12.25c0-.78.13-1.53.38-2.25h-3.77c-.6 1.19-1.03 2.46-1.03 3.75s.43 2.56 1.03 3.75h3.77c-.25-.72-.38-1.47-.38-2.25z"/>
    <path d="M12.06 4.38c1.64 0 3.11.63 4.25 1.67l3.19-3.19c-1.96-1.82-4.56-2.98-7.44-2.98-3.96 0-7.22 2.01-8.78 5.13l3.77 2.96c.85-2.58 3.21-4.45 6.01-4.45z"/>
  </svg>
);

const LoginPage = forwardRef((props, ref) => {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!supabase) {
      setError('Supabase client not initialized.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email });

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, email, password')
        .eq('email', email)
        .single();

      console.log('User fetch result:', { userData, fetchError });

      if (fetchError || !userData) {
        setError('User does not exist. Please create an account.');
        setIsLoading(false);
        return;
      }

      const passwordMatch = await bcrypt.compare(password, userData.password);
      console.log('Password match:', passwordMatch);

      if (!passwordMatch) {
        setError('Password does not match.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('userId', userData.id);
      console.log('Login successful, userId stored:', userData.id);
      router.push('/dashboard'); // Changed to /dashboard
    } catch (err) {
      console.error('Detailed login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setIsLoading(true);
    setError(null);

    if (!supabase) {
      setError('Supabase client not initialized.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`, // Changed to /dashboard
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error(`${provider} OAuth error:`, err);
      setError(`Failed to login with ${provider}. Try again.`);
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
    focus: { scale: 1.02, borderColor: '#6366f1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)' },
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-15"
              initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
              animate={{
                y: ['-20%', '120%'],
                scale: [0.5, 1.2, 0.5],
                opacity: [0.1, 0.5, 0.1],
                transition: { duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent to-indigo-900/30 opacity-50"
            animate={{ opacity: [0.5, 0.8, 0.5], transition: { duration: 8, repeat: Infinity } }}
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(99, 102, 241, 0.4)' }}
          className="max-w-md w-full p-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-500/30 relative z-10 transition-all duration-500 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent text-center tracking-tight"
          >
            Welcome Back
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">Email</label>
              <motion.div variants={inputVariants} whileFocus="focus" className="mt-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400"
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
                  className="w-full p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <div className="flex justify-between items-center">
              <MotionButton
                type="submit"
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Logging In...
                  </span>
                ) : (
                  'Login'
                )}
              </MotionButton>
              <motion.button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                whileHover={{ scale: 1.05, color: '#818cf8' }}
                className="text-indigo-500 font-medium hover:underline"
              >
                Forgot Password?
              </motion.button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Or continue with</p>
            <div className="flex justify-center gap-4">
              <MotionButton
                onClick={() => handleOAuthLogin('github')}
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gray-800 text-white px-6 py-3 rounded-xl shadow-md hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                <GitHubIcon />
                GitHub
              </MotionButton>
              <MotionButton
                onClick={() => handleOAuthLogin('linkedin')}
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-800 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                <LinkedInIcon />
                LinkedIn
              </MotionButton>
              <MotionButton
                onClick={() => handleOAuthLogin('google')}
                disabled={isLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gray-300 opacity-0 hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                <GoogleIcon />
                Google
              </MotionButton>
            </div>
          </div>

          <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{' '}
            <motion.a
              href="/sign-up"
              whileHover={{ scale: 1.05, color: '#818cf8' }}
              className="text-indigo-500 font-medium hover:underline transition-colors duration-200"
            >
              Sign Up
            </motion.a>
          </p>
        </motion.div>

        <AnimatePresence>
          {showForgotPassword && (
            <ForgotPasswordModal
              supabase={supabase}
              onClose={() => setShowForgotPassword(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </Suspense>
  );
});

LoginPage.displayName = 'LoginPage';

export default LoginPage;