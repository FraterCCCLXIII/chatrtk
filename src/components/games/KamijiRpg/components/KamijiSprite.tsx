import React from 'react';
import { Direction } from '../types';

interface KamijiSpriteProps {
  direction: Direction;
  isMoving: boolean;
  mood: string;
  size: number | string;
}

const KamijiSprite: React.FC<KamijiSpriteProps> = ({ direction, isMoving, mood, size }) => {
  const getEyeExpression = () => {
    switch (mood) {
      case 'happy':
        return { leftEye: "M8 12 Q10 14 12 12", rightEye: "M20 12 Q22 14 24 12" };
      case 'tired':
        return { leftEye: "M8 12 L12 12", rightEye: "M20 12 L24 12" };
      case 'curious':
        return { leftEye: "M10 12 A2 2 0 1 1 10 12.1", rightEye: "M22 12 A2 2 0 1 1 22 12.1" };
      default:
        return { leftEye: "M10 12 A1 1 0 1 1 10 12.1", rightEye: "M22 12 A1 1 0 1 1 22 12.1" };
    }
  };

  const eyes = getEyeExpression();
  const animationClass = isMoving ? 'animate-bounce' : '';

  return (
    <div className={`inline-block ${animationClass}`}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        {/* Body */}
        <ellipse cx="16" cy="20" rx="8" ry="6" fill="#FF69B4" />
        
        {/* Head */}
        <circle cx="16" cy="12" r="8" fill="#FFB6C1" />
        
        {/* Eyes */}
        <path d={eyes.leftEye} stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={eyes.rightEye} stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Mouth */}
        <path d="M14 16 Q16 18 18 16" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round" />
        
        {/* Direction indicator */}
        {direction === 'left' && (
          <polygon points="4,16 8,14 8,18" fill="#333" />
        )}
        {direction === 'right' && (
          <polygon points="28,16 24,14 24,18" fill="#333" />
        )}
        {direction === 'up' && (
          <polygon points="16,4 14,8 18,8" fill="#333" />
        )}
        {direction === 'down' && (
          <polygon points="16,28 14,24 18,24" fill="#333" />
        )}
        
        {/* Mood indicator */}
        {mood === 'happy' && (
          <circle cx="26" cy="6" r="3" fill="#FFD700" />
        )}
        {mood === 'tired' && (
          <circle cx="26" cy="6" r="3" fill="#808080" />
        )}
      </svg>
    </div>
  );
};

export default KamijiSprite;
