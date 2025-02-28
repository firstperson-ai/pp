'use client';

import { motion } from 'framer-motion';

const ErrorMessage = ({ message, onDismiss }) => {
  const errorVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={errorVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center justify-between p-4 text-red-600 bg-red-100 dark:bg-red-900/50 rounded-xl shadow-md border border-red-300/50"
    >
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-4 text-red-600 hover:text-red-800 dark:hover:text-red-400 focus:outline-none"
        aria-label="Dismiss error"
      >
        ×
      </button>
    </motion.div>
  );
};

export default ErrorMessage;