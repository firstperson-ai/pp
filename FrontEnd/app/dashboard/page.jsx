'use client';

import { useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

const DashboardHomePage = (props, ref) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side hydration
    }
  }, []);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.15 },
    },
  };

  // Child animations for h1, p, and grid
  const childVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  // Card hover animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, type: 'spring', stiffness: 250 } },
    hover: { scale: 1.02, boxShadow: '0 5px 15px rgba(74, 144, 226, 0.5)', y: -5, transition: { duration: 0.3 } },
  };

  // Button animation (no rotation)
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 0 20px rgba(74, 144, 226, 0.8)', transition: { duration: 0.3 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  // Particle animation for background flair
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 0.7, 0],
      scale: [0, 1.5, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 1 },
    },
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-300">Loading...</div>}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-8"
      >
        {/* Particle Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              variants={particleVariants}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-[0_0_10px_rgba(74,144,226,0.6)]"
              style={{ top: `${Math.random() * 90}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(74,144,226,0.1)_0%,_transparent_70%)]"
            animate={{ opacity: [0.1, 0.3, 0.1], transition: { duration: 4, repeat: Infinity } }}
          />
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto space-y-12 z-10">
          <motion.h1
            variants={childVariants}
            transition={{ duration: 0.5, delay: 0 }}
            className="text-4xl font-bold mb-8 gradient-text text-center"
            aria-label="Welcome to Your Dashboard"
            whileHover={{ scale: 1.03, textShadow: '0 0 20px rgba(74, 144, 226, 0.9)' }}
          >
            Welcome to Your Dashboard
          </motion.h1>
          <motion.p
            variants={childVariants}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-700 dark:text-gray-300 text-center"
            whileHover={{ scale: 1.02, color: '#FFD700' }}
          >
            Manage your resumes, track ATS scores, and optimize your job applications with AI. Start by creating a new resume or exploring your profile!
          </motion.p>
          <motion.div
            variants={childVariants}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1: Create New Resume */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Create New Resume</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Build and optimize your resume with AI for ATS compatibility.
              </p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-xl shadow-[0_0_10px_rgba(74,144,226,0.4)] transition-all duration-200"
                onClick={() => window.location.href = '/dashboard/resume-builder'}
                aria-label="Create New Resume"
              >
                Get Started
              </motion.button>
            </motion.div>

            {/* Card 2: View Profile */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-4 gradient-text">View Profile</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Check your subscriptions and resume history.
              </p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-xl shadow-[0_0_10px_rgba(74,144,226,0.4)] transition-all duration-200"
                onClick={() => window.location.href = '/dashboard/profile'}
                aria-label="View Profile"
              >
                View Now
              </motion.button>
            </motion.div>

            {/* Card 3: Resume History */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Resume History</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Track and manage your past resumes.
              </p>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-xl shadow-[0_0_10px_rgba(74,144,226,0.4)] transition-all duration-200"
                onClick={() => window.location.href = '/dashboard/resume-history'}
                aria-label="View Resume History"
              >
                View History
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </Suspense>
  );
};

const ForwardedDashboardHomePage = forwardRef(DashboardHomePage);

ForwardedDashboardHomePage.displayName = 'DashboardHomePage';

export default ForwardedDashboardHomePage;