'use client';

import { useEffect, forwardRef, Suspense } from 'react';
import { motion } from 'framer-motion';



const ResumeHistoryPage = forwardRef((props, ref) => {
  const mockResumes = [
    { name: 'Sample Resume 1', atsScore: 85, created_at: new Date().toISOString(), downloaded: true },
    { name: 'Sample Resume 2', atsScore: 92, created_at: new Date().toISOString(), downloaded: false },
    { name: 'Sample Resume 3', atsScore: 78, created_at: new Date().toISOString(), downloaded: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3, delay: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure client-side hydration
    }
  }, []);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-8"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-8 gradient-text text-center"
            aria-label="Resume History"
          >
            Resume History
          </motion.h1>
          {mockResumes.length > 0 ? (
            <div className="space-y-4">
              {mockResumes.map((resume, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(74, 144, 226, 0.3)' }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-lg text-gray-800 dark:text-white"><strong>Resume:</strong> {resume.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>ATS Score:</strong> {resume.atsScore}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Created:</strong> {new Date(resume.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400"><strong>Downloaded:</strong> {resume.downloaded ? 'Yes' : 'No'}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.p
              variants={itemVariants}
              className="text-gray-700 dark:text-gray-300 text-center"
            >
              No resumes in history.
            </motion.p>
          )}
        </div>
      </motion.div>
    </Suspense>
  );
});

ResumeHistoryPage.displayName = 'ResumeHistoryPage';

export default ResumeHistoryPage;
