'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { forwardRef, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';
import aiResumeAnimation from '/public/lottie/ai-resume.json';
import MotionButton from '../../components/common/MotionButton';
import confetti from 'canvas-confetti';
import ResumeAnimationLoop from './ResumeAnimationLoop'; // Import new file for modularity

const HeroSection = forwardRef((props, ref) => {
  const sectionRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const setRefs = (node) => {
    sectionRef.current = node;
    inViewRef(node);
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, staggerChildren: 0.4 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, type: 'spring', stiffness: 300, damping: 20 } },
  };

  return (
    <div
      ref={setRefs}
      className="relative min-h-screen bg-[url('/bg-pattern.svg')] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }} 
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
      >
        <motion.h1
          variants={itemVariants}
          className="text-6xl font-extrabold gradient-text mb-8 drop-shadow-3xl"
          aria-label="AI-Powered Resume Builder"
        >
          🚀 AI-Powered Resume Builder
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-2xl text-gray-700 dark:text-gray-300 mb-16 drop-shadow-2xl"
        >
          Transform your resume with AI to beat ATS and get hired faster—free for your first resume!
        </motion.p>
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.1, rotate: 3, boxShadow: '0 10px 20px rgba(74, 144, 226, 0.5)' }}
          whileTap={{ scale: 0.95, rotate: -3 }}
          className="mb-16"
        >
          <MotionButton
            href="/login"
            aria-label="Create My Resume Now – Free"
          >
            Create My Resume Now – Free!
          </MotionButton>
        </motion.div>
        <ResumeAnimationLoop />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, delay: 0.5, type: 'spring', stiffness: 100 }}
        className="absolute bottom-0 right-0 w-full md:w-1/2 h-1/2 md:h-1/2 z-0"
      >
        <Lottie animationData={aiResumeAnimation} loop autoplay className="w-[400px] h-[400px]" aria-label="AI Resume Animation" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60 z-0 backdrop-blur-sm" />
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
