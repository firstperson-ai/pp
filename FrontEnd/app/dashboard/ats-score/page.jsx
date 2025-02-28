// FrontEnd/app/dashboard/ats-score/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '../../../utils/supabase';
import MotionButton from '../../../components/common/MotionButton';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { Suspense } from 'react';
import ATSPopup from './ATSPopup';
import ErrorMessage from '../../../components/ErrorMessage';

const ATSScorePage = () => {
  const { user, supabase } = useSupabase();
  const [resumeContent, setResumeContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAISuggestions] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [particleStyles, setParticleStyles] = useState([]);
  const [hoveredElement, setHoveredElement] = useState(null);

  useEffect(() => {
    console.log('Supabase user in ATS page:', user); // Debug user state
    const generateParticleStyles = () => {
      const styles = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-1.5 h-1.5',
        initialX: `${Math.random() * 100}%`,
        initialY: `${Math.random() * 100}%`,
        rotateEnd: Math.random() * 720,
        duration: Math.random() * 3 + 1.5,
        delay: Math.random() * 1,
      }));
      setParticleStyles(styles);
    };
    generateParticleStyles();
  }, [user]); // Re-run if user changes

  const handleOptimize = async () => {
    if (!resumeContent) {
      setError('Please upload a resume.');
      return;
    }
    if (!jobDescription) {
      setError('Please provide a job description.');
      return;
    }

    console.log('Attempting to optimize with user (before check):', user);
    if (!user) {
      // Attempt to fetch user again to force update
      if (supabase) {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Refetched session in ATS score:', session, 'Error:', error);
        if (error || !session?.user) {
          setError('Please log in to optimize your resume. Refetched user state:', JSON.stringify(session?.user || error));
          return;
        }
        // Note: Directly setting user here might not update React context properly; rely on onAuthStateChange
        console.log('Forcing user update with refetched session:', session.user);
      } else {
        setError('Supabase client not available. Please log in to optimize your resume.');
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setAISuggestions('');
    setShowPopup(false); // Ensure popup doesn’t show on error

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
      console.log('Fetching from:', `${backendUrl}/api/optimize-resume`);
      const response = await fetch(`${backendUrl}/api/optimize-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.session?.access_token || ''}`, // Fallback for safety
        },
        body: JSON.stringify({ resume: resumeContent, jobDescription }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Optimization process failed.');
      }
      const data = await response.json();
      console.log('Backend response:', data);
      setScore(data.atsScore || 0);
      setAISuggestions(data.suggestions || 'No suggestions generated.');
      setShowPopup(true); // Trigger popup with score only
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: 'easeOut', staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.8, type: 'spring', stiffness: 400, damping: 25 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.12, boxShadow: '0 0 50px rgba(0, 200, 255, 1)', rotate: 1.5 },
    tap: { scale: 0.92, rotate: -0.5 },
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="h-screen flex items-center justify-center bg-[#0A1128] relative overflow-hidden p-4"
      >
        {/* Enhanced Particle Nebula */}
        <div className="absolute inset-0 pointer-events-none">
          {particleStyles.map((style) => (
            <motion.div
              key={style.id}
              className={`absolute ${style.size} bg-gradient-to-r from-[#00C8FF] to-[#FFD700] rounded-full shadow-[0_0_10px_rgba(0,200,255,0.8)]`}
              initial={{ x: style.initialX, y: style.initialY }}
              animate={{
                y: ['-60%', '160%'],
                scale: [0.2, 1.3, 0.2],
                opacity: [0.6, 0.8, 0.6],
                rotate: [0, style.rotateEnd],
                transition: {
                  duration: style.duration,
                  repeat: Infinity,
                  ease: 'easeInOutCubic',
                  delay: style.delay,
                },
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,200,255,0.3)_0%,_transparent_70%)]"
            animate={{ opacity: [0.3, 0.5, 0.3], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
          />
        </div>

        {/* Main Container */}
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: '0 0 70px rgba(0, 200, 255, 0.6)' }}
          onMouseEnter={() => setHoveredElement('container')}
          onMouseLeave={() => setHoveredElement(null)}
          className="max-w-4xl w-full mx-auto h-[90vh] space-y-6 z-20 bg-[rgba(10,17,40,0.9)] backdrop-blur-3xl rounded-3xl border border-[#00C8FF]/40 p-8 shadow-[0_0_50px_rgba(0,200,255,0.5)] transition-all duration-400 flex flex-col"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#00C8FF]/15 to-[#FFD700]/15"
            animate={{ opacity: [0.15, 0.25, 0.15], transition: { duration: 4, repeat: Infinity } }}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-3 text-[#FF6B6B] bg-[rgba(255,107,107,0.2)] rounded-xl shadow-[0_0_15px_rgba(255,107,107,0.6)] border border-[#FF6B6B]/50 text-sm"
              >
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.header
            variants={itemVariants}
            className="text-center space-y-2 flex-shrink-0"
          >
            <motion.h1
              className="text-4xl font-extrabold bg-gradient-to-r from-[#00C8FF] to-[#FFD700] bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_15px_rgba(0,200,255,0.5)]"
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 40px rgba(0, 200, 255, 1)',
              }}
              animate={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.7)' }}
              transition={{ duration: 0.4 }}
            >
              ATS Score Optimizer
            </motion.h1>
            <motion.p
              className="text-md text-[#D0DAFF] max-w-lg mx-auto font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              whileHover={{ color: '#FFD700', scale: 1.03 }}
            >
              Maximize your resume’s ATS compatibility with precision.
            </motion.p>
          </motion.header>

          {/* Input Section */}
          <motion.div variants={itemVariants} className="space-y-5 flex-grow">
            {/* Resume Upload */}
            <motion.div
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 40px rgba(0, 200, 255, 0.8)',
                borderColor: '#00C8FF',
              }}
              onMouseEnter={() => setHoveredElement('upload')}
              onMouseLeave={() => setHoveredElement(null)}
              className="relative"
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setResumeContent(event.target?.result?.toString() || '');
                    reader.readAsText(file);
                  }
                }}
                className="w-full bg-[rgba(0,200,255,0.15)] text-[#E0E8FF] hover:bg-[rgba(0,200,255,0.25)] transition-all duration-400 rounded-xl p-3 shadow-[0_0_20px_rgba(0,200,255,0.5)] border border-[#FFD700]/60 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FFD700] file:text-[#0A1128] hover:file:bg-[#FFEA00] file:transition-all file:duration-400 text-md"
                aria-label="Upload Resume"
                disabled={isLoading}
              />
              {hoveredElement === 'upload' && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-[#00C8FF] rounded-full shadow-[0_0_10px_rgba(0,200,255,1)]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7], transition: { duration: 1, repeat: Infinity } }}
                />
              )}
            </motion.div>

            {/* Job Description */}
            <motion.div
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)',
                borderColor: '#FFD700',
              }}
              onMouseEnter={() => setHoveredElement('textarea')}
              onMouseLeave={() => setHoveredElement(null)}
              className="relative"
            >
              <textarea
                value={jobDescription}
                placeholder="Paste your job description here..."
                rows={5}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-4 border border-[#00C8FF]/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] bg-[rgba(255,215,0,0.1)] text-[#E0E8FF] placeholder-[#A0B0FF] transition-all duration-400 shadow-[0_0_20px_rgba(0,200,255,0.4)] resize-none text-md"
                aria-label="Job Description Input"
                style={{ height: '12rem' }}
                disabled={isLoading}
              />
              {hoveredElement === 'textarea' && (
                <motion.div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#FFD700] rounded-full shadow-[0_0_10px_rgba(255,215,0,1)]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7], transition: { duration: 1, repeat: Infinity } }}
                />
              )}
            </motion.div>

            {/* Optimize Button */}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredElement('button')}
                onMouseLeave={() => setHoveredElement(null)}
                className="text-center relative"
              >
                <MotionButton
                  onClick={handleOptimize}
                  className="w-full bg-gradient-to-r from-[#00C8FF] to-[#FFD700] text-[#0A1128] font-bold py-3 rounded-xl shadow-[0_0_25px_rgba(0,200,255,0.8)] hover:shadow-[0_0_50px_rgba(0,200,255,1)] transition-all duration-500 relative overflow-hidden z-10 text-lg"
                  aria-label="Calculate ATS Score"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#FFD700] opacity-0 hover:opacity-25 transition-opacity duration-500 rounded-xl"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        'inset 0 0 15px rgba(255, 255, 255, 0.8)',
                        'inset 0 0 30px rgba(255, 255, 255, 1)',
                        'inset 0 0 15px rgba(255, 255, 255, 0.8)',
                      ],
                      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  />
                  Calculate ATS Score
                </MotionButton>
                {hoveredElement === 'button' && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ rotate: 360, transition: { duration: 2.5, repeat: Infinity, ease: 'linear' } }}
                  >
                    <motion.div
                      className="absolute w-3 h-3 bg-[#00C8FF] rounded-full top-0 left-1/2 -translate-x-1/2"
                      animate={{ scale: [1, 1.4, 1], transition: { duration: 0.8, repeat: Infinity } }}
                    />
                    <motion.div
                      className="absolute w-3 h-3 bg-[#FFD700] rounded-full bottom-0 left-1/2 -translate-x-1/2"
                      animate={{ scale: [1, 1.4, 1], transition: { duration: 0.8, repeat: Infinity, delay: 0.4 } }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* AI Suggestions */}
          {aiSuggestions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 350, damping: 30 }}
              className="w-11/12 mx-auto p-4 bg-[rgba(0,200,255,0.15)] rounded-xl shadow-[0_0_25px_rgba(255,215,0,0.6)] border border-[#FFD700]/50 text-center relative flex-shrink-0"
              style={{ height: '12rem' }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00C8FF]/20 to-transparent"
                animate={{ x: ['-120%', '120%'], transition: { duration: 3, repeat: Infinity, ease: 'linear' } }}
              />
              <motion.h3
                className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FFD700] to-[#00C8FF] bg-clip-text text-transparent relative z-10"
                whileHover={{ scale: 1.06, textShadow: '0 0 15px rgba(0, 200, 255, 1)' }}
              >
                AI-Powered Suggestions
              </motion.h3>
              <p className="text-[#D0DAFF] font-medium text-md relative z-10 leading-snug">
                {aiSuggestions.length > 150 ? `${aiSuggestions.substring(0, 147)}...` : aiSuggestions}
              </p>
            </motion.div>
          )}

          {/* Popup */}
          <AnimatePresence>
            {showPopup && <ATSPopup score={score} onClose={handleClosePopup} />}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Suspense>
  );
};

export default ATSScorePage;