
import React from 'react';

interface TerrainSpriteProps {
  type: 'grass' | 'tree' | 'rock' | 'water';
  size?: number;
}

const TerrainSprite = ({ type, size = 32 }: TerrainSpriteProps) => {
  const renderSprite = () => {
    switch (type) {
      case 'grass':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#90EE90" />
            <path d="M4 28 Q8 24 12 28 Q16 24 20 28 Q24 24 28 28" stroke="#7CB342" strokeWidth="1" fill="none" />
            <path d="M2 26 Q6 22 10 26 Q14 22 18 26 Q22 22 26 26 Q30 22 32 26" stroke="#8BC34A" strokeWidth="1" fill="none" />
          </svg>
        );
      case 'tree':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#90EE90" />
            <rect x="14" y="20" width="4" height="12" fill="#8B4513" />
            <circle cx="16" cy="14" r="10" fill="#228B22" />
            <circle cx="12" cy="10" r="6" fill="#32CD32" />
            <circle cx="20" cy="12" r="5" fill="#32CD32" />
          </svg>
        );
      case 'rock':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#90EE90" />
            <polygon points="6,26 16,8 26,26" fill="#696969" />
            <polygon points="6,26 16,8 20,15 10,26" fill="#808080" />
            <polygon points="20,15 26,26 16,8" fill="#555555" />
          </svg>
        );
      case 'water':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32">
            <rect width="32" height="32" fill="#4169E1" />
            <path d="M0 16 Q8 12 16 16 Q24 20 32 16 L32 32 L0 32 Z" fill="#1E90FF" />
            <path d="M0 20 Q8 16 16 20 Q24 24 32 20 L32 32 L0 32 Z" fill="#87CEEB" opacity="0.7" />
            <circle cx="8" cy="10" r="1" fill="#FFFFFF" opacity="0.6" />
            <circle cx="24" cy="14" r="1" fill="#FFFFFF" opacity="0.6" />
          </svg>
        );
      default:
        return <rect width={size} height={size} fill="#DDD" />;
    }
  };

  return <div className="inline-block">{renderSprite()}</div>;
};

export default TerrainSprite;
