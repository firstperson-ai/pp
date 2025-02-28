'use client';

import { useState, useEffect, forwardRef, Suspense } from 'react';
import { useSupabase } from '../../../utils/supabase';
import ResumeEditor from '../../../components/resume/ResumeEditor';
import ATSScoreMeter from '../../../components/resume/ATSScoreMeter';
import PaymentModal from '../../../components/payment/PaymentModal';
import MotionButton from '../../../components/common/MotionButton';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeBuilderPage = forwardRef((props, ref) => {
  const { user } = useSupabase();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [resumeData, setResumeData] = useState({ content: '' });
  const [jobDescription, setJobDescription] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side hydration
    }
  }, []);

  const handleOptimize = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeData.content, jobDescription }),
      });
      if (!response.ok) throw new Error('Failed to optimize resume');
      const { optimizedResume, atsScore } = await response.json();
      setResumeData({ ...resumeData, content: optimizedResume });
      setScore(atsScore);
    } catch (error) {
      setError('Preview mode: Optimization failed (mock data used).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const hasActive = true;
      if (!hasActive) {
        setShowPaymentModal(true);
        return;
      }
      setScore(85);
      const blob = new Blob(['Your ATS-optimized resume PDF (Preview Mode)'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ats-optimized-resume-preview.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Preview mode: Download failed (mock data used).');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeData({ ...resumeData, content: event.target?.result || '' });
    };
    reader.readAsText(file);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotate: -2 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.7, type: 'spring', stiffness: 500 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: '0 0 40px rgba(34, 197, 94, 0.8)', rotate: 3 },
    tap: { scale: 0.9, rotate: -3 },
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center bg-[radial-gradient(at_center,_#180F2A_0%,_#2A1F47_50%,_#3E2F66_100%)] relative overflow-hidden p-4"
      >
        {/* Cosmic Particle Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 150 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-${Math.random() > 0.7 ? '1' : '1.5'} h-${
                Math.random() > 0.7 ? '1' : '1.5'
              } bg-gradient-to-r from-[#A855F7] via-[#22C55E] to-[#F97316] rounded-full shadow-[0_0_6px_rgba(249,115,22,0.6)]`}
              initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%` }}
              animate={{
                y: ['-50%', '150%'],
                scale: [0.3, 1.3, 0.3],
                opacity: [0.5, 0.7, 0.5],
                rotate: [0, Math.random() * 720],
                transition: {
                  duration: Math.random() * 3 + 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 1,
                },
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-[conic-gradient(at_bottom_left,_rgba(168,85,247,0.2)_0deg,_rgba(34,197,94,0.2)_120deg,_transparent_240deg)]"
            animate={{ rotate: 360, transition: { duration: 18, repeat: Infinity, ease: 'linear' } }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.2) 0%, transparent 60%)',
                'radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.2) 0%, transparent 60%)',
              ],
              transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        {/* Compact Main Content Container */}
        <motion.div
          className="max-w-5xl w-full mx-auto space-y-6 relative z-10 bg-[rgba(24,15,42,0.9)] backdrop-blur-3xl rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.4)] border border-[#22C55E]/40 p-6 transition-all duration-500"
          whileHover={{ scale: 1.02, boxShadow: '0 0 80px rgba(34, 197, 94, 0.6)' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/15 via-[#22C55E]/15 to-[#F97316]/15"
            animate={{ opacity: [0.1, 0.2, 0.1], transition: { duration: 4, repeat: Infinity } }}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-3 text-[#FCA5A5] bg-[rgba(248,113,113,0.15)] rounded-xl shadow-[0_0_15px_rgba(248,113,113,0.5)] border border-[#F87171]/50 text-sm"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.header
            variants={itemVariants}
            className="text-center space-y-2"
          >
            <motion.h1
              className="text-4xl font-extrabold bg-gradient-to-r from-[#A855F7] via-[#22C55E] to-[#F97316] bg-clip-text text-transparent tracking-tight"
              whileHover={{ scale: 1.03, textShadow: '0 0 40px rgba(34, 197, 94, 0.9)' }}
              animate={{ textShadow: '0 0 10px rgba(249, 115, 22, 0.6)' }}
              transition={{ duration: 0.3 }}
            >
              Resume Builder
            </motion.h1>
            <motion.p
              className="text-base text-[#D1D5DB] max-w-md mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              whileHover={{ color: '#F97316', scale: 1.02 }}
            >
              Craft your stellar resume—optimized with elegance.
            </motion.p>
          </motion.header>

          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(168, 85, 247, 0.7)' }}
              onMouseEnter={() => setHoveredElement('upload')}
              onMouseLeave={() => setHoveredElement(null)}
              className="relative"
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="w-full max-w-[40%] bg-[rgba(168,85,247,0.15)] text-[#E5E7EB] hover:bg-[rgba(168,85,247,0.25)] transition-all duration-300 rounded-xl p-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-[#F97316]/60 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-[#22C55E] file:text-white hover:file:bg-[#16A34A] file:transition-all file:duration-300 text-sm"
                aria-label="Upload Resume"
              />
              {hoveredElement === 'upload' && (
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-[#A855F7] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6], transition: { duration: 1, repeat: Infinity } }}
                />
              )}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(34, 197, 94, 0.7)' }}
              onMouseEnter={() => setHoveredElement('textarea')}
              onMouseLeave={() => setHoveredElement(null)}
              className="relative"
            >
              <textarea
                value={jobDescription}
                placeholder="Paste your job description here..."
                rows={4}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 border border-[#22C55E]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F97316] bg-[rgba(34,197,94,0.05)] text-[#E5E7EB] placeholder-[#A1A1AA] transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] resize-none text-sm"
                aria-label="Job Description Input"
              />
              {hoveredElement === 'textarea' && (
                <motion.div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#22C55E] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6], transition: { duration: 1, repeat: Infinity } }}
                />
              )}
            </motion.div>

            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onMouseEnter={() => setHoveredElement('optimize')}
                onMouseLeave={() => setHoveredElement(null)}
                className="relative flex justify-center"
              >
                <MotionButton
                  onClick={handleOptimize}
                  className="w-[50%] bg-gradient-to-r from-[#A855F7] via-[#22C55E] to-[#F97316] text-white font-bold py-2 px-4 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:shadow-[0_0_40px_rgba(249,115,22,0.9)] transition-all duration-300 relative overflow-hidden text-sm"
                  aria-label="Optimize Resume with AI"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#F97316] opacity-0 hover:opacity-15 transition-opacity duration-300 rounded-xl"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        'inset 0 0 15px rgba(255, 255, 255, 0.6)',
                        'inset 0 0 30px rgba(255, 255, 255, 0.9)',
                        'inset 0 0 15px rgba(255, 255, 255, 0.6)',
                      ],
                      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  />
                  Optimize Resume
                </MotionButton>
                {hoveredElement === 'optimize' && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ rotate: 360, transition: { duration: 2.5, repeat: Infinity, ease: 'linear' } }}
                  >
                    <motion.div
                      className="absolute w-3 h-3 bg-[#A855F7] rounded-full top-0 left-1/2 -translate-x-1/2"
                      animate={{ scale: [1, 1.3, 1], transition: { duration: 0.7, repeat: Infinity } }}
                    />
                    <motion.div
                      className="absolute w-3 h-3 bg-[#F97316] rounded-full bottom-0 left-1/2 -translate-x-1/2"
                      animate={{ scale: [1, 1.3, 1], transition: { duration: 0.7, repeat: Infinity, delay: 0.3 } }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-6"
          >
            <motion.div
              className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-2xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-[#A855F7]/40"
              whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(168, 85, 247, 0.6)' }}
            >
              <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} onOptimize={handleOptimize} />
            </motion.div>

            <motion.div
              className="w-full md:w-1/4 space-y-4 bg-[rgba(255,255,255,0.05)] rounded-2xl p-4 shadow-[0_0_20px_rgba(249,115,22,0.3)] border border-[#F97316]/40"
              whileHover={{ scale: 1.02, boxShadow: '0 0 35px rgba(249, 115, 22, 0.6)' }}
            >
              <ATSScoreMeter score={score} />
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                onMouseEnter={() => setHoveredElement('download')}
                onMouseLeave={() => setHoveredElement(null)}
                className="relative"
              >
                <MotionButton
                  onClick={handleDownload}
                  className="w-[80%] bg-gradient-to-r from-[#22C55E] to-[#A855F7] text-white font-bold py-2 px-4 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_40px_rgba(168,85,247,0.9)] transition-all duration-300 relative overflow-hidden text-sm"
                  aria-label="Download ATS-Optimized PDF"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#A855F7] opacity-0 hover:opacity-15 transition-opacity duration-300 rounded-xl"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        'inset 0 0 15px rgba(255, 255, 255, 0.6)',
                        'inset 0 0 30px rgba(255, 255, 255, 0.9)',
                        'inset 0 0 15px rgba(255, 255, 255, 0.6)',
                      ],
                      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                    }}
                  />
                  Download PDF
                </MotionButton>
                {hoveredElement === 'download' && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ rotate: 360, transition: { duration: 2.5, repeat: Infinity, ease: 'linear' } }}
                  >
                    <motion.div
                      className="absolute w-3 h-3 bg-[#22C55E] rounded-full top-0 left-1/2 -translate-x-1/2"
                      animate={{ scale: [1, 1.3, 1], transition: { duration: 0.7, repeat: Infinity } }}
                    />
                    <motion.div
                      className="absolute w-3 h-3 bg-[#F97316] rounded-full bottom-0 left-1/2 -translate-x-1/2"
                      animate={{ scale: [1, 1.3, 1], transition: { duration: 0.7, repeat: Infinity, delay: 0.3 } }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showPaymentModal && (
              <PaymentModal
                onClose={() => setShowPaymentModal(false)}
                onSuccess={() => {
                  setScore(90);
                  handleDownload();
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </Suspense>
  );
});

ResumeBuilderPage.displayName = 'ResumeBuilderPage';

export default ResumeBuilderPage;