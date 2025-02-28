'use client';

import React, { forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useHolographicViewer } from './useHolographicViewer';

const ResumeViewer = forwardRef(({ resumeData, setResumeData, onOptimize }, ref) => {
  const { isExpanded, toggleView, previewVariants, expandedVariants, particleVariants } = useHolographicViewer();

  const ExpandedView = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 pointer-events-auto">
      {/* Particle Effects */}
      <motion.div
        variants={particleVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70 shadow-[0_0_8px_rgba(74,144,226,0.8)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ scale: 0 }}
            animate={{
              y: [0, -40, 0],
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
              transition: {
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 1,
              },
            }}
          />
        ))}
      </motion.div>

      {/* Expanded Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={expandedVariants}
        className="relative w-11/12 max-w-6xl p-10 border-2 border-blue-400/70 rounded-3xl text-gray-800 dark:text-gray-200 bg-gradient-to-br from-gray-50/90 to-gray-200/90 dark:from-gray-900/90 dark:to-gray-800/90 holographic-bg overflow-auto max-h-[85vh] shadow-[0_0_100px_rgba(74,144,226,0.9)]"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Expanded Resume Viewer"
      >
        <div className="max-h-[85vh] overflow-y-auto pr-4">
          <p className="text-xl leading-relaxed font-medium">{resumeData?.content || 'Your resume content in full holographic glory...'}</p>
        </div>
      </motion.div>

      {/* Fixed Cross Icon (Outside Scrollable Container) */}
      <motion.button
        onClick={toggleView}
        className="fixed top-[7vh] right-[calc(50%-3rem)] text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-full w-10 h-10 flex items-center justify-center z-60 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
        aria-label="Close Expanded View"
        whileHover={{ scale: 1.15, rotate: 90, boxShadow: '0 0 25px rgba(239,68,68,1)' }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <span className="text-2xl font-bold">×</span>
      </motion.button>
    </div>
  );

  return (
    <>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
        }}
        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
      >
        <h3 className="text-3xl font-bold mb-6 gradient-text" aria-label="View Your Resume">
          View Your Resume
        </h3>

        {/* Small View Area (Preview Window) */}
        <motion.div
          variants={previewVariants}
          animate="visible"
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl min-h-[150px] max-h-[150px] overflow-hidden text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 transition-all duration-300 relative z-10 shadow-inner"
        >
          <p className="text-sm leading-tight">
            {resumeData?.content?.substring(0, 200) + '...' || 'Preview your resume here...'}
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between space-x-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={toggleView}
              className="w-48 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.9)]"
              aria-label="Open Expanded View"
            >
              {isExpanded ? 'Close View' : 'View Resume'}
            </button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={onOptimize}
              className="w-48 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold text-lg rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.9)]"
              aria-label="Optimize Resume with AI"
            >
              Optimize with AI
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Portal for Expanded View */}
      {isExpanded && typeof document !== 'undefined' && createPortal(<ExpandedView />, document.body)}
    </>
  );
});

ResumeViewer.displayName = 'ResumeViewer';

export default ResumeViewer;