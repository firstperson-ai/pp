'use client';

import { useEffect, useState, Suspense, useCallback, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, signOut } from '@/lib/auth';
import SkeletonLoader from '@/components/SkeletonLoader';
import ErrorMessage from '@/components/ErrorMessage';
import { useRouter } from 'next/navigation';
import MotionButton from '../../../components/common/MotionButton';

// Profile Field Component (unchanged)
const ProfileField = ({ label, value, fallback = 'N/A', truncate = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    whileHover={{ 
      scale: 1.03, 
      boxShadow: '0 0 20px rgba(0, 255, 221, 0.5)', 
      background: 'linear-gradient(90deg, rgba(79, 70, 229, 0.2) 0%, rgba(45, 212, 191, 0.2) 100%)' 
    }}
    className="flex justify-between items-center p-5 rounded-2xl bg-[rgba(255,255,255,0.1)] dark:bg-[rgba(0,0,0,0.2)] shadow-[0_0_10px_rgba(0,221,235,0.3)] border border-[#00DDEB]/30 backdrop-blur-md transition-all duration-400"
  >
    <span className="font-semibold text-[#D0D0FF] tracking-wider">{label}:</span>
    <span
      className={`text-[#FFD700] font-medium ${truncate ? 'truncate max-w-[220px]' : ''}`}
      whileHover={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255, 215, 0, 0.8)' }}
    >
      {value || fallback}
    </span>
  </motion.div>
);

const ProfilePage = forwardRef((props, ref) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (userId) => {
    try {
      const { data, error: profileError } = await supabase
        .from('users')
        .select('id, email, name, subscription_status, resume_downloads_remaining')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load profile. Please try again.');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkUser = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          setUser({ id: userId });
          await fetchUserProfile(userId);
        } else {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !session) {
            router.push('/login');
            return;
          }
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            router.push('/login');
            return;
          }
          setUser(user);
          await fetchUserProfile(user.id);
        }
      } catch (err) {
        setError(err.message || 'An error occurred. Please log in again.');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userId');
        setUser(null);
        setProfile(null);
        router.push('/login');
      } else if (session) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [fetchUserProfile, router]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        localStorage.removeItem('userId');
      } else {
        await signOut();
      }
      setUser(null);
      setProfile(null);
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Logout failed. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.15 },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -5 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { duration: 0.7, type: 'spring', stiffness: 300 } 
    },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 0 60px rgba(0, 255, 221, 0.6)', 
      transition: { duration: 0.4 } 
    },
  };

  // Button animation (no rotation)
  const buttonVariants = {
    hover: { scale: 1.1, boxShadow: '0 0 40px rgba(255, 0, 170, 0.8)', transition: { duration: 0.3 } },
    tap: { scale: 0.9, transition: { duration: 0.2 } },
  };

  // Particle animation
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 0.8, 0],
      scale: [0, 1.5, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 1.5 },
    },
  };

  if (isLoading) return <SkeletonLoader type="profile" />;

  return (
    <Suspense fallback={<SkeletonLoader type="profile" />}>
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-8 h-[90vh] flex items-center justify-center bg-[radial-gradient(at_center,_#0A001F_0%,_#1A0033_50%,_#2D004D_100%)] relative overflow-hidden"
      >
        {/* Particle Background */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              variants={particleVariants}
              className={`absolute w-${Math.random() > 0.7 ? '1.5' : '2.5'} h-${
                Math.random() > 0.7 ? '1.5' : '2.5'
              } bg-gradient-to-r from-[#FF00AA] via-[#00DDEB] to-[#FFD700] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.6)]`}
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
          <motion.div
            className="absolute inset-0 bg-[conic-gradient(at_top_left,_rgba(255,0,170,0.25)_0deg,_rgba(0,221,235,0.25)_120deg,_transparent_240deg)]"
            animate={{ rotate: 360, transition: { duration: 20, repeat: Infinity, ease: 'linear' } }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.3) 0%, transparent 60%)',
                'radial-gradient(circle at 80% 80%, rgba(0, 255, 221, 0.3) 0%, transparent 60%)',
              ],
              transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        {/* Main Content */}
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: '0 0 100px rgba(0, 221, 235, 0.7)' }}
          className="max-w-7xl w-full mx-auto space-y-8 relative z-10 bg-[rgba(10,0,31,0.9)] backdrop-blur-3xl rounded-4xl shadow-[0_0_50px_rgba(255,0,170,0.4)] border border-[#FFD700]/40 p-10 transition-all duration-500 overflow-hidden"
        >
          {/* Holographic Overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: 'linear-gradient(45deg, rgba(255, 0, 170, 0.1), rgba(0, 221, 235, 0.1), rgba(255, 215, 0, 0.1))',
              opacity: [0.1, 0.2, 0.1],
              transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="mb-6 p-5 text-[#FF6666] bg-[rgba(255,102,102,0.2)] rounded-2xl shadow-[0_0_20px_rgba(255,102,102,0.5)] border border-[#FF6666]/50 backdrop-blur-md"
              >
                <ErrorMessage message={error} onDismiss={() => setError(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.header
            variants={cardVariants}
            className="text-center space-y-4 relative"
          >
            <motion.h1
              className="text-6xl font-extrabold bg-gradient-to-r from-[#FF00AA] via-[#00DDEB] to-[#FFD700] bg-clip-text text-transparent tracking-tight"
              whileHover={{ 
                scale: 1.04, 
                textShadow: '0 0 40px rgba(0, 221, 235, 1), 0 0 15px rgba(255, 0, 170, 0.8)' 
              }}
              animate={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.6)' }}
              transition={{ duration: 0.4 }}
            >
              Your Profile
            </motion.h1>
            <motion.p
              className="text-xl text-[#D0D0FF] max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              whileHover={{ color: '#FFD700', scale: 1.02 }}
            >
              Explore your galactic identity—crafted with elegance and cosmic precision.
            </motion.p>
          </motion.header>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <motion.section
              variants={cardVariants}
              whileHover="hover"
              className="bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(0,0,0,0.9)] p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,221,235,0.3)] border border-[#00DDEB]/40 transition-all duration-400"
            >
              <motion.h2
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FF00AA] to-[#00DDEB] bg-clip-text text-transparent tracking-wide"
                whileHover={{ scale: 1.02, textShadow: '0 0 20px rgba(0, 221, 235, 0.9)' }}
              >
                Personal Information
              </motion.h2>
              <div className="space-y-4">
                <ProfileField label="Name" value={profile?.name} />
                <ProfileField label="Email" value={profile?.email} />
                <ProfileField label="User ID" value={profile?.id} truncate />
              </div>
            </motion.section>

            <motion.section
              variants={cardVariants}
              whileHover="hover"
              className="bg-[rgba(255,255,255,0.05)] dark:bg-[rgba(0,0,0,0.9)] p-8 rounded-3xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,221,235,0.3)] border border-[#FFD700]/40 transition-all duration-400"
            >
              <motion.h2
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#00DDEB] to-[#FFD700] bg-clip-text text-transparent tracking-wide"
                whileHover={{ scale: 1.02, textShadow: '0 0 20px rgba(255, 215, 0, 0.9)' }}
              >
                Subscription Details
              </motion.h2>
              <div className="space-y-4">
                <ProfileField label="Status" value={profile?.subscription_status} fallback="Not Subscribed" />
                <ProfileField label="Resumes Remaining" value={profile?.resume_downloads_remaining} fallback="0" />
              </div>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="flex justify-center mt-8 relative"
          >
            <MotionButton
              onClick={handleSignOut}
              disabled={isSigningOut}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className={`relative px-12 py-5 rounded-full font-bold text-lg text-[#0A001F] shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:shadow-[0_0_40px_rgba(255,215,0,0.9)] transition-all duration-400 overflow-hidden ${
                isSigningOut ? 'bg-[rgba(170,0,255,0.4)] cursor-not-allowed' : 'bg-gradient-to-r from-[#FF00AA] via-[#00DDEB] to-[#FFD700]'
              }`}
            >
              <motion.div
                className="absolute inset-0 bg-[#FFD700] opacity-0 hover:opacity-20 transition-opacity duration-400 rounded-full"
              />
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                animate={{
                  boxShadow: [
                    'inset 0 0 25px rgba(255, 255, 255, 0.6)',
                    'inset 0 0 50px rgba(255, 255, 255, 0.9)',
                    'inset 0 0 25px rgba(255, 255, 255, 0.6)',
                  ],
                  transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
              {isSigningOut ? (
                <span className="flex items-center">
                  <motion.svg
                    className="animate-spin w-6 h-6 mr-3 text-[#FFFFFF]"
                    fill="none"
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360, transition: { duration: 1, repeat: Infinity, ease: 'linear' } }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </motion.svg>
                  Signing Out...
                </span>
              ) : (
                'Sign Out'
              )}
            </MotionButton>
          </motion.div>
        </motion.div>
      </motion.div>
    </Suspense>
  );
});

const ForwardedProfilePage = motion(ProfilePage);
ForwardedProfilePage.displayName = 'ProfilePage';

export default ForwardedProfilePage;