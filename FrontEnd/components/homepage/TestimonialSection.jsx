'use client';

import { forwardRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const TestimonialSection = forwardRef((props, ref) => {
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Software Engineer', text: 'This tool transformed my resume and landed me a job at Google!', rating: 5 },
    { name: 'Mike Chen', role: 'Data Scientist', text: 'ATS optimization is incredible—my score jumped from 60% to 95%!', rating: 5 },
    { name: 'Emma Davis', role: 'Product Manager', text: 'Easy to use, beautiful design, and the AI is spot-on.', rating: 4 },
    { name: 'John Smith', role: 'UX Designer', text: 'I love the animations and how seamless the process is—highly recommend!', rating: 5 },
    { name: 'Lisa Brown', role: 'Marketing Lead', text: 'Got hired faster than ever with this tool’s ATS insights.', rating: 5 },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3, delay: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 300 } },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure client-side hydration
    }
  }, []);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-16 bg-white dark:bg-gray-800 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold mb-12 gradient-text text-center"
          aria-label="What Our Users Say"
        >
          What Our Users Say
        </motion.h2>
        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 5px 15px rgba(74, 144, 226, 0.3)' }}
                className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
              >
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          />
        </div>
      </div>
    </motion.section>
  );
});

TestimonialSection.displayName = 'TestimonialSection';

export default TestimonialSection;
