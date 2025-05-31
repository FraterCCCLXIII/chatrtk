import { useMemo, useEffect } from 'react';
import { useEffects } from '@/contexts/EffectsContext';

export const useEffectStyles = () => {
  const { state } = useEffects();

  // Add keyframes to document when component mounts
  useEffect(() => {
    // Remove any existing style element
    const existingStyle = document.getElementById('effect-keyframes');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and append new style element
    const styleSheet = document.createElement('style');
    styleSheet.id = 'effect-keyframes';
    styleSheet.textContent = `
      @keyframes squiggly-anim {
        0% {
          filter: url("#squiggly-0");
        }
        25% {
          filter: url("#squiggly-1");
        }
        50% {
          filter: url("#squiggly-2");
        }
        75% {
          filter: url("#squiggly-3");
        }
        100% {
          filter: url("#squiggly-4");
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      if (styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, []);

  const styles = useMemo(() => {
    const baseStyles: React.CSSProperties = {};

    if (state.activeEffect === 'pencil' && state.pencilConfig.enabled) {
      baseStyles.animation = `squiggly-anim ${state.pencilConfig.animationSpeed}s infinite`;
      baseStyles.willChange = 'filter';
      baseStyles.transform = 'translateZ(0)'; // Force GPU acceleration
    }

    return baseStyles;
  }, [state.activeEffect, state.pencilConfig]);

  return styles;
}; 