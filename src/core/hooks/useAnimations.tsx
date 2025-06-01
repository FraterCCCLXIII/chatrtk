import React from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useFloatingAnimation, AnimatedDiv } from './useAnimation';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
};

// Hooks
export const useFadeIn = (delay = 0) => {
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start({
      opacity: 1,
      transition: { delay, duration: 0.3 }
    });
  }, [controls, delay]);
  return controls;
};

export const useSlideIn = (delay = 0) => {
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start({
      x: 0,
      opacity: 1,
      transition: { delay, duration: 0.3 }
    });
  }, [controls, delay]);
  return controls;
};

export const use3DRotation = (delay = 0) => {
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start({
      rotateY: 0,
      opacity: 1,
      transition: { delay, duration: 0.5 }
    });
  }, [controls, delay]);
  return controls;
};

// Components
export const AnimatedMessage: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const controls = useSlideIn(delay);
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionDiv = motion.div;
export const MotionButton = motion.button;
export const MotionTextarea = motion.textarea;

// Re-export from useAnimation
export { useFloatingAnimation, AnimatedDiv }; 