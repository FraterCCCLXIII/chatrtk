import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Handle space key press to skip loading
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        onLoadingComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Initial black screen
    const blackScreenTimeout = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Simulate loading progress - slower to match the exit timing
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // Slower increment
      });
    }, 25); // Slower interval

    // Show logo after content is visible
    const logoTimeout = setTimeout(() => {
      if (showContent) {
        setShowLogo(true);
      }
    }, 500);

    // Show text after logo appears
    const textTimeout = setTimeout(() => {
      if (showContent && showLogo) {
        setShowText(true);
      }
    }, 800);

    // Start content fade out
    const fadeOutTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // Start exit animation after content fades
    const exitTimeout = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    // Complete loading after exit animation
    const completeTimeout = setTimeout(() => {
      onLoadingComplete();
    }, 4000); // Longer final fade

    return () => {
      clearInterval(interval);
      clearTimeout(blackScreenTimeout);
      clearTimeout(logoTimeout);
      clearTimeout(textTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(exitTimeout);
      clearTimeout(completeTimeout);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onLoadingComplete, showContent, showLogo]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="loading-screen"
        initial={{ backgroundColor: '#000000' }}
        animate={{ backgroundColor: showContent ? '#ffffff' : '#000000' }}
        exit={{ opacity: 0 }}
        transition={{ 
          backgroundColor: { duration: 0.5, ease: "easeInOut" },
          opacity: { duration: 1, ease: "easeInOut" } // Longer final fade
        }}
      >
        <div className="loading-content">
          <AnimatePresence mode="wait">
            {showContent && showLogo && !isFadingOut && (
              <motion.div
                className="logo-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeOut",
                  exit: { duration: 0.3 } // Faster exit for content
                }}
              >
                <svg
                  className="artec-logo"
                  width="120"
                  height="120"
                  viewBox="0 0 173.35 75.11"
                >
                  <path d="M86.67 0 0 37.81l86.68 37.3 86.67-37.8L86.67 0zm76.62 37.33L86.67 70.75 10.06 37.78 86.68 4.36l76.61 32.97z" />
                  <path d="M128.79 31.06v13.47l10-4.36v4.64l-14.25 6.21V24.57l14.25 6.21v4.64l-10-4.36zm-20-8.72v13.34h7.5v4.25h-7.5v13.33l10-4.36v4.63l-14.25 6.21V15.85l14.25 6.21v4.64l-10-4.36zm-10-9.01v4.65l-10-4.37v53.01l-2.12.92-2.13-.92V13.61l-10 4.36v-4.64l12.13-5.29 12.12 5.29zM65.83 35.05l2.96-1.3V15.84l-14.25 6.22v31.47l4.25 1.85V38.11l3.12-1.37 7.7 23.37 2.84 1.23h.29v.14l2.1.91-9.01-27.34zm-1.29-4.09-5.75 2.51v-8.63l5.75-2.51v8.63zm-30-.18v14.03l4.25 1.85v-4.59h5.75v7.1l4.25 1.85V24.57l-14.25 6.21zm10 7.04h-5.75v-4.26l5.75-2.51v6.77z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showContent && showText && !isFadingOut && (
              <motion.div
                className="text-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.5, 
                  ease: "easeOut",
                  exit: { duration: 0.3 } // Faster exit for content
                }}
              >
                <h1 className="title">ChatRTK</h1>
                <h2 className="subtitle">RTK-ALPHA</h2>
              </motion.div>
            )}
          </AnimatePresence>

          {showContent && !isFadingOut && (
            <div className="loading-bar-container">
              <motion.div
                className="loading-bar"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                exit={{ width: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          )}

          {showContent && !isFadingOut && (
            <motion.button
              className="skip-link"
              onClick={onLoadingComplete}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              whileHover={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.15,
                exit: { duration: 0.3 } // Faster exit for content
              }}
            >
              Skip (Space)
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen; 