'use client';

import { motion } from 'framer-motion';
import Link from 'next/link'; // Next.js Link for navigation
import { useRouter } from 'next/navigation';
import { forwardRef } from 'react'; // Corrected forwardRef import

const MotionButton = forwardRef(({ children, href, onClick, 'aria-label': ariaLabel, ...rest }, ref) => {
  const router = useRouter();

  const handleClick = (e) => {
    if (href) {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
      router.push(href); // Navigate programmatically
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 2, boxShadow: '0 5px 15px rgba(74, 144, 226, 0.3)' }}
      whileTap={{ scale: 0.95, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {href ? (
        <Link href={href} passHref legacyBehavior>
          <button
            ref={ref}
            {...rest}
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg p-2 px-6 py-3 font-semibold"
            aria-label={ariaLabel || children?.toString()}
          >
            {children}
          </button>
        </Link>
      ) : (
        <button
          ref={ref}
          {...rest}
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg p-2 px-6 py-3 font-semibold"
          aria-label={ariaLabel || children?.toString()}
        >
          {children}
        </button>
      )}
    </motion.div>
  );
});

MotionButton.displayName = 'MotionButton';

export default MotionButton;
