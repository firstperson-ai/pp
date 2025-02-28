'use client';

import HeroSection from '../components/homepage/HeroSection';
import TestimonialSection from '../components/homepage/TestimonialSection';
import FAQSection from '../components/homepage/FAQSection';
import TrustSection from '../components/homepage/TrustSection';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delay: 0.2 } },
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <HeroSection />
        <TrustSection />
        <TestimonialSection />
        <FAQSection />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-gray-800"
        >
          <h2 className="text-4xl font-bold gradient-text mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold gradient-text">1. Upload Resume</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Upload your existing resume and paste text.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold gradient-text">2. AI Optimizes</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Our AI tailors your resume for ATS compatibility.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold gradient-text">3. Download PDF</h3>
              <p className="mt-4 text-gray-700 dark:text-gray-300">Download your ATS-optimized resume as a PDF.</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Suspense>
  );
}
