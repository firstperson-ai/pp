'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const ATSScoreMeter = forwardRef(({ score }, ref) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const getColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-2xl font-semibold mb-4 gradient-text" aria-label="ATS Score">ATS Score</h3>

      <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full transition-all ${getColor(score)}`}
          aria-label={`ATS Score: ${score}%`}
        />
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800 dark:text-white" aria-live="polite">
        {score}%
      </p>

      <p className="mt-2 text-gray-700 dark:text-gray-300">
        {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement'} – Optimize further for better results!
      </p>
    </motion.div>
  );
});

ATSScoreMeter.displayName = 'ATSScoreMeter';

export default ATSScoreMeter;
