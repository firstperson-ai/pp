'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSpring, animated } from '@react-spring/web';
import gsap from 'gsap';

const ResumeAnimationLoop = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { triggerOnce: false, threshold: 0.1 });
  const controls = useAnimation();
  const [currentStep, setCurrentStep] = useState('initial');
  const [isMounted, setIsMounted] = useState(false);

  const transitionConfig = {
    type: 'spring',
    stiffness: 160,
    damping: 18,
    mass: 0.6,
    restDelta: 0.001
  };

  const resumeVariants = {
    initial: {
      opacity: 0,
      scale: 0.45,
      rotate: -12,
      borderRadius: '24px',
      background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
      transition: { ...transitionConfig, duration: 4 }
    },
    low: {
      opacity: 1,
      scale: 0.62,
      rotate: -2,
      background: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)',
      borderRadius: '16px',
      transition: { ...transitionConfig, duration: 5 }
    },
    high: {
      opacity: 1,
      scale: 0.72,
      rotate: 4,
      background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
      borderRadius: '8px',
      transition: { ...transitionConfig, duration: 6 }
    },
    job: {
      opacity: 1,
      scale: 0.78,
      rotate: 8,
      background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
      borderRadius: '4px',
      transition: { ...transitionConfig, duration: 9 }
    },
    reset: {
      opacity: 0,
      scale: 0.45,
      rotate: -12,
      transition: { ...transitionConfig, duration: 2 }
    },
  };

  const springProps = useSpring({
    from: { x: 0, y: 0, rotate: 0 },
    to: async (next) => {
      while (1) {
        await next({ 
          x: 24, 
          y: -12, 
          rotate: 3, 
          config: { tension: 140, friction: 12 } 
        });
        await next({ 
          x: 0, 
          y: 0, 
          rotate: 0, 
          config: { tension: 140, friction: 12 } 
        });
      }
    },
    pause: !isInView || currentStep === 'reset',
  });

  const animateState = async (state, duration) => {
    await controls.start(state);
    setCurrentStep(state);
    await new Promise(resolve => setTimeout(resolve, duration));
  };

  useEffect(() => {
    if (!isInView) return;
    setIsMounted(true);
    
    const animationSequence = async () => {
      await animateState('initial', 2000);
      while (isMounted) {
        await animateState('low', 3800);
        await animateState('high', 3800);
        await animateState('job', 3800);
        await handleJobConfetti();
        await animateState('reset', 1800);
        await animateState('initial', 1800);
      }
    };

    animationSequence();

    return () => { setIsMounted(false) };
  }, [isInView, isMounted]);

  const handleJobConfetti = async () => {
    confetti({
      particleCount: 500,
      spread: 120,
      origin: { y: 0.55 },
      colors: ['#FF6B6B', '#4A90E2', '#FFD700'],
      gravity: 0.65,
      scalar: 1.4,
      drift: 0.15,
      ticks: 200,
    });

    gsap.fromTo('.confetti-particle', 
      { opacity: 1, y: -100 },
      {
        duration: 2.5,
        y: 500,
        opacity: 0,
        stagger: 0.02,
        ease: 'power4.out',
        onComplete: () => {
          document.querySelectorAll('.confetti-particle').forEach(el => el.remove());
        }
      }
    );
  };

  return (
    <motion.div
      ref={ref}
      className="relative w-full max-w-4xl mx-auto px-4"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ...transitionConfig }}
    >
      <animated.div
        style={{
          transform: springProps.x.to(x => 
            `perspective(1000px) rotateX(${x/8}deg) rotateY(${springProps.y.to(y => y/8)}deg) 
             translate3d(${x}px, ${springProps.y}px, 0)`
          ),
        }}
        className="relative"
      >
        <motion.div
          variants={resumeVariants}
          animate={controls}
          className="relative p-8 bg-cover bg-center shadow-2xl transform-gpu overflow-hidden"
          style={{
            backgroundImage: 'url(/bg-pattern.svg)',
            minHeight: 'clamp(300px, 40vh, 500px)',
            backgroundSize: 'cover',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/40 backdrop-blur-lg"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
              key={currentStep}
              initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {currentStep === 'initial' && (
                <motion.span className="inline-block">
                    ⏳ Scanning ATS Score… <span className="text-red-600">Your resume is in DANGER.</span>  
                </motion.span>
                )}
                {currentStep === 'low' && (
                <motion.span className="inline-block">
                    🚨 ATS REJECTED. <span className="text-red-600">Bots delete your resume in 0.6 sec.</span>  
                </motion.span>
                )}
                {currentStep === 'high' && (
                <motion.span className="inline-block">
                    ⚠️ YOU’RE LOSING JOBS. <span className="text-yellow-500">Better resumes are winning.</span>  
                </motion.span>
                )}
                {currentStep === 'job' && (
                <motion.span className="inline-block">
                    🎯 RESUME FIXED! <span className="text-green-500">Now ATS-approved & recruiter-ready.</span>  
                </motion.span>
                )}

            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide"
              key={`desc-${currentStep}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
                {currentStep === 'initial' && (
                <motion.span className="inline-block">
                    ⛔ AUTO-REJECTED. <span className="text-red-600">HR never saw your resume.</span>  
                </motion.span>
                )}
                {currentStep === 'low' && (
                <motion.span className="inline-block">
                    📉 BLACKLISTED. <span className="text-lime-300">Your name is ignored forever.</span>  
                </motion.span>
                )}
                {currentStep === 'high' && (
                <motion.span className="inline-block">
                    💀 ATS FAILURE. <span className="text-yellow-500">You are invisible to recruiters.</span>  
                </motion.span>
                )}
                {currentStep === 'job' && (
                <motion.span className="inline-block">
                    🚀 JOB SECURED! <span className="text-green-500">Your resume is now UNSTOPPABLE.</span>  
                </motion.span>
                )}

            </motion.p>

            {currentStep === 'job' && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ 
                  duration: 1.5,
                  times: [0, 0.8, 1],
                  ease: 'anticipate'
                }}
              >
                <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full mix-blend-screen opacity-20 blur-3xl animate-pulse" />
              </motion.div>
            )}
          </div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ 
              scale: currentStep === 'job' ? 1.05 : 1,
              rotate: currentStep === 'job' ? [0, 1, -1, 0] : 0,
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      </animated.div>
    </motion.div>
  );
};

export default ResumeAnimationLoop;