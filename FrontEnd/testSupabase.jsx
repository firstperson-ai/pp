'use client';

import { useEffect, useState, forwardRef } from 'react';
import { useSupabase } from '../../utils/supabase';
import { motion } from 'framer-motion';
import MotionButton from '../../components/common/MotionButton';
import { Suspense } from 'react';
import { useRouter } from 'next/navigation';

const SignUpPage = forwardRef((props, ref) => {
  const { supabase, user } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!supabase) {
      setError('Supabase client not initialized. Check your configuration.');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting signup with:', { email, name });

      // Step 1: Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      console.log('Auth response:', authData, authError);

      if (authError) {
        throw new Error(authError.message || 'Authentication failed.');
      }

      if (!authData?.user) {
        setError('Please check your email to verify your account.');
        setIsLoading(false);
        return;
      }

      const userId = authData.user.id;
      console.log('New user ID:', userId);

      // Step 2: Upsert into users table
      const userData = {
        id: userId,
        email,
        name,
        subscription_status: 'Not Subscribed',
        resume_downloads_remaining: 0,
        created_at: new Date().toISOString(),
      };
      console.log('Upserting user data:', userData);

      const { data: upsertData, error: userError } = await supabase
        .from('users')
        .upsert(userData, { onConflict: 'id' })
        .select();

      console.log('Upsert response:', upsertData, userError);

      if (userError) {
        console.error('Upsert error:', userError);
        throw new Error('Failed to save user details: ' + userError.message);
      }

      console.log('Signup successful:', authData);
      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-pink-800"
      >
        <div className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6 gradient-text text-center"
          >
            Join Today!
          </motion.h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</label>
              <motion.div whileHover={{ scale: 1.02 }} className="mt-1">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <div>
              <label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</label>
              <motion.div whileHover={{ scale: 1.02 }} className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <div>
              <label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</label>
              <motion.div whileHover={{ scale: 1.02 }} className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <MotionButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </MotionButton>

            <p className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-purple-500 hover:underline">Login</a>
            </p>
          </form>
        </div>
      </motion.div>
    </Suspense>
  );
});

SignUpPage.displayName = 'SignUpPage';

export default SignUpPage;