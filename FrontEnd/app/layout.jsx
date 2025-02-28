'use client';

import { ThemeProvider } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Suspense } from 'react';
import '../styles/globals.css';
import { SupabaseProvider } from '../utils/supabase'; // Ensure this import exists

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-gray-800">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{error.message}</p>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95, rotate: -2 }}
          onClick={resetErrorBoundary}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label="Retry"
        >
          Retry
        </motion.button>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SupabaseProvider> {/* Ensure SupabaseProvider wraps the app */}
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                try {
                  window.location.reload();
                } catch (error) {
                  console.error('Error resetting boundary:', error);
                }
              }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <AnimatePresence
                  mode="wait"
                  initial={false}
                  onExitComplete={() => {
                    if (typeof window !== 'undefined') {
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  <motion.div
                    key={JSON.stringify(children)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </ErrorBoundary>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}