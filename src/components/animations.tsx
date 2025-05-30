import { motion } from 'framer-motion';
import { animated, useSpring } from 'react-spring';
import React from 'react';

// Framer Motion animations
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  }
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// React Spring animations
export const useFadeIn = () => useSpring({
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: { tension: 280, friction: 20 }
});

export const useSlideIn = (direction = 'up') => {
  const directions = {
    up: { from: { y: 20, opacity: 0 }, to: { y: 0, opacity: 1 } },
    down: { from: { y: -20, opacity: 0 }, to: { y: 0, opacity: 1 } },
    left: { from: { x: 20, opacity: 0 }, to: { x: 0, opacity: 1 } },
    right: { from: { x: -20, opacity: 0 }, to: { x: 0, opacity: 1 } }
  };
  
  return useSpring({
    ...directions[direction as keyof typeof directions],
    config: { tension: 280, friction: 20 }
  });
};

export const use3DRotation = () => useSpring({
  from: { transform: 'perspective(1000px) rotateX(10deg)' },
  to: { transform: 'perspective(1000px) rotateX(0deg)' },
  config: { tension: 200, friction: 20 }
});

// Animated components
export const AnimatedDiv = animated.div;
export const AnimatedButton = animated.button;
export const AnimatedInput = animated.input;
export const AnimatedTextarea = animated.textarea;

// Motion components
export const MotionDiv = motion.div;
export const MotionButton = motion.button;
export const MotionInput = motion.input;
export const MotionTextarea = motion.textarea;

// Animated message component
export const AnimatedMessage: React.FC<{
  children: React.ReactNode;
  isUser: boolean;
  delay?: number;
}> = ({ children, isUser, delay = 0 }) => {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = React.useState(true);
  const [scale, setScale] = React.useState(1);
  const [opacity, setOpacity] = React.useState(1);

  React.useEffect(() => {
    if (!ref) return;

    const checkPosition = () => {
      const messageRect = ref.getBoundingClientRect();
      const inputContainer = document.querySelector('.input-container');
      
      if (inputContainer) {
        const inputRect = inputContainer.getBoundingClientRect();
        const distanceToInput = inputRect.top - messageRect.bottom;
        
        // Start fading when message is within 150px of the input container
        if (distanceToInput < 150 && distanceToInput > -100) {
          // Calculate scale and opacity based on distance
          const newScale = Math.max(0.8, 1 - (0.2 * (1 - distanceToInput / 150)));
          const newOpacity = Math.max(0.4, distanceToInput / 150);
          
          setScale(newScale);
          setOpacity(newOpacity);
        } else if (distanceToInput <= -100) {
          // Hide completely when too far into the input container
          setIsVisible(false);
        } else {
          // Reset when far enough away
          setScale(1);
          setOpacity(1);
          setIsVisible(true);
        }
      }
    };

    // Check position on scroll and resize
    const scrollArea = document.querySelector('.chat-messages');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', checkPosition);
      window.addEventListener('resize', checkPosition);
    }

    // Initial check
    checkPosition();

    // Auto-scroll to bottom when new message is added
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', checkPosition);
        window.removeEventListener('resize', checkPosition);
      }
    };
  }, [ref]);

  return (
    <MotionDiv
      ref={setRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { 
          opacity: 0,
          scale: 0.8,
          y: 20,
          x: isUser ? 20 : -20
        },
        visible: { 
          opacity: 1,
          scale: 1,
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: delay
          }
        }
      }}
      style={{
        scale,
        opacity,
        transition: "scale 0.2s ease-out, opacity 0.2s ease-out",
        position: 'relative',
        zIndex: 1
      }}
    >
      {children}
    </MotionDiv>
  );
};

// 3D Card component with hover effect
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay,
      }}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 0,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </MotionDiv>
  );
};

// Floating animation for the talking head
export const useFloatingAnimation = () => useSpring({
  from: { y: 0 },
  to: async (next) => {
    while (true) {
      await next({ y: -5, rotateZ: 0 }); // Removed rotation for head shake
      await next({ y: 0, rotateZ: 0 });
      await next({ y: 5, rotateZ: 0 }); // Removed rotation for head shake
      await next({ y: 0, rotateZ: 0 });
    }
  },
  config: { tension: 100, friction: 10 },
  loop: true
});