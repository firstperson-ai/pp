'use client';

import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  { question: 'How does AI optimize my resume?', answer: 'Our AI analyzes your resume and job description to enhance keywords and structure for ATS compatibility.' },
  { question: 'Is there a free trial?', answer: 'Yes, create your first ATS-optimized resume for free!' },
  { question: 'Can I download my resume as a PDF?', answer: 'Yes, after optimization, you can download your resume as a premium PDF.' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3, delay: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FAQSection = forwardRef((props, ref) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-16 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold mb-12 gradient-text text-center"
          aria-label="Frequently Asked Questions"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(74, 144, 226, 0.3)' }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left text-xl font-semibold text-gray-800 dark:text-white flex justify-between items-center"
                aria-expanded={openIndex === index}
                aria-label={`Expand ${faq.question}`}
              >
                {faq.question}
                <motion.span
                  initial={false}
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  ▼
                </motion.span>
              </motion.button>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: openIndex === index ? 'auto' : 0, opacity: openIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="mt-2 text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

FAQSection.displayName = 'FAQSection';

export default FAQSection;
