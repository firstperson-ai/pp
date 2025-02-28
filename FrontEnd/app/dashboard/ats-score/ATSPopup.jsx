// frontend/app/dashboard/ats-score/ATSPopup.jsx
'use client';

import { motion } from 'framer-motion';
import MotionButton from '../../../components/common/MotionButton';

const ATSPopup = ({ score, onClose }) => {
  // Fallback for invalid or missing score
  const displayScore = score ?? 0; // Default to 0 if score is undefined/null
  const isValidScore = typeof displayScore === 'number' && !isNaN(displayScore) && displayScore >= 0;

  if (!isValidScore) {
    console.warn('Invalid ATS score provided, defaulting to 0');
  }

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)', rotate: 2 },
    tap: { scale: 0.95, rotate: -2 },
  };

  // Determine message based on score
  const getScoreMessage = () => {
    if (!isValidScore) return 'Error calculating score. Please try again.';
    if (displayScore >= 90) return 'Exceptional! Optimize further for perfection.';
    if (displayScore >= 70) return 'Great Job! Optimize further for perfection.';
    return 'Room to Shine! Optimize further for perfection.';
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={popupVariants}
      onClick={onClose}
      role="dialog" // Accessibility enhancement
      aria-label={`ATS Score Popup: ${isValidScore ? `${displayScore}%` : 'Error'}`}
      tabIndex={-1} // Focus management
      onKeyDown={(e) => e.key === 'Escape' && onClose()} // Keyboard navigation
    >
      <motion.div
        className="relative max-w-md w-full p-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-teal-500/40 transition-all duration-500 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        aria-modal="true" // Accessibility for modal
      >
        {/* Inner Holographic Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-teal-500/40 to-pink-500/40" />
          <motion.div
            className="absolute inset-0 opacity-0"
            animate={{
              opacity: [0, 0.15, 0],
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
              transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.div>

        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-teal-300 bg-clip-text text-transparent text-center">
          Your ATS Score
        </h3>
        <motion.p
          className="text-6xl font-extrabold bg-gradient-to-r from-indigo-500 via-teal-400 to-pink-500 bg-clip-text text-transparent text-center mb-6"
          animate={{ scale: [1, 1.1, 1], transition: { duration: 1.5, repeat: Infinity } }}
          aria-live="polite" // Accessibility for screen readers
        >
          {isValidScore ? `${displayScore}%` : '0%'}
        </motion.p>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6 font-light">
          {getScoreMessage()}
        </p>
        <div className="flex justify-center">
          <MotionButton
            onClick={onClose}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="relative px-8 py-3 rounded-full font-bold text-lg text-white bg-gradient-to-r from-indigo-600 via-teal-500 to-pink-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            aria-label="Close ATS Score Popup"
          >
            <span className="absolute inset-0 bg-white opacity-0 hover:opacity-30 transition-opacity duration-300 rounded-full" />
            <motion.span
              className="absolute inset-0 rounded-full pointer-events-none"
              animate={{
                boxShadow: [
                  'inset 0 0 20px rgba(255, 255, 255, 0.5)',
                  'inset 0 0 40px rgba(255, 255, 255, 0.8)',
                  'inset 0 0 20px rgba(255, 255, 255, 0.5)',
                ],
                transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
            Done
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ATSPopup;