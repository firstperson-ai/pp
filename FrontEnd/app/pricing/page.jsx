'use client';

import MotionButton from '../../components/common/MotionButton';
import { motion } from 'framer-motion';
import { Suspense, forwardRef } from 'react';

const PricingPage = forwardRef((props, ref) => {
  const plans = [
    { 
      name: 'Basic', 
      originalPrice: 239, 
      finalPrice: 99, 
      savings: 140, 
      features: ['1 ATS-Optimized Resume', 'PDF Download', 'ATS Score Tracking'], 
      popular: false 
    },
    { 
      name: 'Pro', 
      originalPrice: 558, 
      finalPrice: 369, 
      savings: 189, 
      features: ['5 ATS-Optimized Resume', 'PDF Download', 'Priority Support', 'ATS Score Tracking'], 
      popular: true 
    },
    { 
      name: 'Premium', 
      originalPrice: 999, 
      finalPrice: 699, 
      savings: 300, 
      features: ['10 ATS-Optimized Resumes', 'PDF Downloads', 'Priority Support', 'ATS Score Tracking'], 
      popular: false 
    },
    { 
      name: 'Ultimate', 
      originalPrice: 1400, 
      finalPrice: 999, 
      savings: 401, 
      features: ['18 ATS-Optimized Resumes', 'PDF Downloads', '24/7 Priority Support', 'ATS Score Tracking'], 
      popular: false,
      hot: true 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 70 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        staggerChildren: 0.2, 
        delay: 0.3, 
        ease: 'easeOut' 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0, 
      transition: { 
        duration: 0.8, 
        type: 'spring', 
        stiffness: 300, 
        damping: 20 
      } 
    },
  };

  const flameVariants = {
    burn: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#FFD700] text-2xl animate-pulse">Loading...</div>}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen py-16 bg-[radial-gradient(at_top_center,_#0A001F_0%,_#1A0033_50%,_#2D004D_100%)] relative overflow-hidden"
      >
        {/* Cosmic Particle Background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-[#FF00AA] via-[#00DDEB] to-[#FFD700] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"
              initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
              animate={{
                y: ['-50%', '150%'],
                scale: [0.2, 1.3, 0.2],
                opacity: [0.7, 0.4, 0.7],
                rotate: [0, 720],
                transition: {
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                },
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-[conic-gradient(at_bottom_right,_rgba(255,0,170,0.2)_0deg,_rgba(0,221,235,0.2)_120deg,_transparent_240deg)]"
            animate={{ rotate: 360, transition: { duration: 15, repeat: Infinity, ease: 'linear' } }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-extrabold mb-14 bg-gradient-to-r from-[#FF00AA] via-[#00DDEB] to-[#FFD700] bg-clip-text text-transparent text-center"
            whileHover={{
              scale: 1.03,
              textShadow: '0 0 40px rgba(0, 221, 235, 0.9), 0 0 15px rgba(255, 0, 170, 0.7)',
            }}
            transition={{ duration: 0.5 }}
            aria-label="Pricing Plans"
          >
            Pricing Plans
          </motion.h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 60px rgba(255, 0, 170, 0.5), inset 0 0 20px rgba(0, 221, 235, 0.3)',
                  transition: { duration: 0.4 } 
                }}
                className={`bg-[rgba(10,0,31,0.9)] p-8 rounded-3xl shadow-[0_0_30px_rgba(0,221,235,0.2)] border border-[#FFD700]/30 backdrop-blur-xl relative overflow-hidden ${plan.popular ? 'ring-4 ring-[#00DDEB]' : ''} ${plan.hot ? 'ring-4 ring-[#FF4500]' : ''}`}
              >
                {/* Plan Glow Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-[rgba(255,215,0,0.1)] to-transparent"
                  animate={{ y: ['-100%', '100%'], transition: { duration: 3, repeat: Infinity, ease: 'linear' } }}
                />
                <div className="flex items-center justify-center mb-6 relative">
                  <motion.span
                    className="text-4xl font-extrabold bg-gradient-to-r from-[#FF00AA] to-[#FFD700] bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05, textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                  >
                    {plan.name}
                  </motion.span>
                  {plan.popular && (
                    <motion.span
                      className="ml-3 bg-[#00DDEB] text-[#0A001F] text-sm font-semibold px-4 py-1 rounded-full shadow-[0_0_15px_rgba(0,221,235,0.7)]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      Most Popular
                    </motion.span>
                  )}
                  {plan.hot && (
                    <motion.span
                      className="ml-3 bg-[#FF4500] text-[#FFF8E1] text-sm font-semibold px-4 py-1 rounded-full shadow-[0_0_20px_rgba(255,69,0,0.9)] relative overflow-hidden"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } }}
                      variants={flameVariants}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,165,0,0.5)_0%,_transparent_70%)]"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5], transition: { duration: 0.6, repeat: Infinity } }}
                      />
                      <span className="relative z-10">Hot Deal</span>
                    </motion.span>
                  )}
                </div>
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-3">
                    <motion.span
                      className="text-5xl font-bold text-[#FFD700]"
                      whileHover={{ scale: 1.1, textShadow: '0 0 20px rgba(255, 215, 0, 0.9)' }}
                    >
                      ₹{plan.finalPrice}
                    </motion.span>
                    <span className="text-2xl text-[#D0D0E5] line-through">
                      ₹{plan.originalPrice}
                    </span>
                  </div>
                  <motion.p
                    className="text-[#00FF7F] font-semibold mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  >
                    You Save ₹{plan.savings} OFF
                  </motion.p>
                </div>
                <ul className="space-y-5 mb-8 text-[#D4D4D8]">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1, transition: { delay: i * 0.1 } }}
                      whileHover={{ x: 5, color: '#FFD700' }}
                    >
                      <motion.svg
                        className="w-6 h-6 mr-3 text-[#00FF7F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ scale: [1, 1.2, 1], transition: { duration: 1, repeat: Infinity } }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </motion.svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  whileHover={{ scale: 1.07, rotate: 3, boxShadow: '0 0 30px rgba(0, 221, 235, 0.8)' }}
                  whileTap={{ scale: 0.93, rotate: -3 }}
                  className="text-center relative"
                >
                  <MotionButton
                    onClick={() => alert(`Purchasing ${plan.name} plan for ₹${plan.finalPrice}`)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#00DDEB] to-[#00FF7F] hover:from-[#00C4B4] hover:to-[#00E676]'
                        : plan.hot
                        ? 'bg-gradient-to-r from-[#FF4500] to-[#FFD700] hover:from-[#FF6347] hover:to-[#FFEA00]'
                        : 'bg-[rgba(170,0,255,0.2)] text-[#FFD700] hover:bg-[rgba(170,0,255,0.4)]'
                    } transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] p-2 px-6 py-3 relative overflow-hidden`}
                    aria-label={`Purchase ${plan.name} Plan`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.2)] to-transparent"
                      animate={{ x: ['-100%', '100%'], transition: { duration: 1.5, repeat: Infinity, ease: 'linear' } }}
                    />
                    <span className="relative z-10 font-bold">Get Started</span>
                  </MotionButton>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Suspense>
  );
});

PricingPage.displayName = 'PricingPage';

export default PricingPage;