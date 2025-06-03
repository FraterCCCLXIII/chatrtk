import React from 'react';

interface BerrySpriteProps {
  size: number | string;
  isCollected?: boolean;
}

const BerrySprite: React.FC<BerrySpriteProps> = ({ size, isCollected = false }) => {
  return (
    <div className={`inline-block ${isCollected ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        {/* Berry body */}
        <circle cx="16" cy="16" r="8" fill="#FF69B4" />
        <circle cx="16" cy="16" r="6" fill="#FF1493" />
        
        {/* Berry shine */}
        <circle cx="13" cy="13" r="2" fill="#FFB6C1" opacity="0.8" />
        
        {/* Berry stem */}
        <path 
          d="M16 8 Q16 4 20 4" 
          stroke="#228B22" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
        
        {/* Berry leaves */}
        <path 
          d="M20 4 Q24 6 22 8" 
          stroke="#32CD32" 
          strokeWidth="2" 
          fill="#90EE90"
        />
        <path 
          d="M20 4 Q16 6 18 8" 
          stroke="#32CD32" 
          strokeWidth="2" 
          fill="#90EE90"
        />
      </svg>
    </div>
  );
};

export default BerrySprite; 