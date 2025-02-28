'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <motion.div
      role="status"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full"
      aria-label="Loading Spinner"
    />
  );
}
