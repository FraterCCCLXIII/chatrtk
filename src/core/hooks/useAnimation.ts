import React, { useEffect, useState } from 'react';

interface AnimationProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const useFloatingAnimation = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const animate = () => {
      setPhase(prev => (prev + 0.02) % (2 * Math.PI));
      setOffset({
        x: Math.sin(phase) * 2,
        y: Math.cos(phase) * 2
      });
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [phase]);

  return {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: 'transform 0.1s ease-out'
  };
};

export const AnimatedDiv: React.FC<AnimationProps> = ({ className, style, children }) => (
  <div 
    className={className}
    style={{
      ...style,
      willChange: 'transform'
    }}
  >
    {children}
  </div>
); 