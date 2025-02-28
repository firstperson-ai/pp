'use client';

import { motion } from 'framer-motion';

const SkeletonLoader = ({ type }) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-teal-700 p-8">
      <div className="max-w-7xl w-full mx-auto space-y-12">
        <motion.div
          variants={skeletonVariants}
          animate="pulse"
          className="h-16 w-3/4 mx-auto bg-gray-300 dark:bg-gray-700 rounded-xl"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            variants={skeletonVariants}
            animate="pulse"
            className="bg-gray-300 dark:bg-gray-700 p-8 rounded-3xl h-64"
          />
          <motion.div
            variants={skeletonVariants}
            animate="pulse"
            className="bg-gray-300 dark:bg-gray-700 p-8 rounded-3xl h-64"
          />
        </div>
        <motion.div
          variants={skeletonVariants}
          animate="pulse"
          className="h-12 w-32 mx-auto bg-gray-300 dark:bg-gray-700 rounded-full"
        />
      </div>
    </div>
  );
};

export default SkeletonLoader;