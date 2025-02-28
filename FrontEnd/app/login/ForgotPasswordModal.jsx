'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const ForgotPasswordModal = ({ supabase, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    if (!supabase) {
      setError('Supabase client not initialized.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setMessage('Password reset email sent. Check your inbox.');
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Failed to send reset email. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      onClick={onClose}
    >
      <motion.div
        className="max-w-sm w-full p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-indigo-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Reset Password</h3>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="text-gray-700 dark:text-gray-200 font-medium">Email</label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          {message && (
            <p className="text-green-600 dark:text-green-400 text-center">{message}</p>
          )}
          {error && (
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          )}
          <div className="flex justify-between">
            <motion.button
              type="button"
              onClick={onClose}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-300 disabled:opacity-60"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordModal;