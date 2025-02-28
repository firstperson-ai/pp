import { useState } from 'react';

export const useHolographicViewer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleView = () => {
    setIsExpanded((prev) => !prev);
  };

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', type: 'spring', stiffness: 200 },
    },
  };

  const expandedVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 100, rotateX: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 5,
      boxShadow: '0 0 100px rgba(74, 144, 226, 1), 0 0 200px rgba(74, 144, 226, 0.7)',
      transition: {
        duration: 0.9,
        ease: [0.68, -0.55, 0.27, 1.55], // Custom cubic-bezier for dramatic bounce
        type: 'spring',
        stiffness: 150,
        damping: 20,
      },
    },
  };

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Inject CSS for holographic effect
  const styles = `
    .holographic-bg {
      background: linear-gradient(135deg, rgba(74, 144, 226, 0.3), rgba(255, 255, 255, 0.15));
      border: 2px solid rgba(74, 144, 226, 0.8);
      backdrop-filter: blur(10px);
    }
    .gradient-text {
      background: linear-gradient(90deg, #4a90e2, #50c878, #d946ef, #f97316);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `;

  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('holographic-styles');
    if (!existingStyle) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'holographic-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
  }

  return { isExpanded, toggleView, previewVariants, expandedVariants, particleVariants };
};