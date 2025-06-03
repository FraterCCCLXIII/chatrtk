
import React from 'react';
import { PetStats, PetState, TimeState } from './TamagotchiGame';

interface TamagotchiPetProps {
  petState: PetState;
  stats: PetStats;
  timeState: TimeState;
}

const TamagotchiPet = ({ petState, stats, timeState }: TamagotchiPetProps) => {
  const getMoodColor = () => {
    switch (petState.mood) {
      case 'happy': return '#FFD700';
      case 'sad': return '#6B7280';
      case 'hungry': return '#EF4444';
      case 'tired': return '#8B5CF6';
      case 'sick': return '#10B981';
      case 'playing': return '#F97316';
      default: return '#FFD700';
    }
  };

  const getEyeState = () => {
    if (!petState.isAlive) return 'dead';
    if (petState.mood === 'tired' || timeState.timeOfDay === 'night') return 'sleepy';
    if (petState.mood === 'sad') return 'sad';
    if (petState.mood === 'playing') return 'excited';
    return 'normal';
  };

  const getMouthState = () => {
    if (!petState.isAlive) return 'dead';
    if (petState.mood === 'hungry') return 'hungry';
    if (petState.mood === 'sad') return 'sad';
    if (petState.mood === 'playing') return 'excited';
    return 'happy';
  };

  // Pet becomes sleepier at night
  const isNightTime = timeState.timeOfDay === 'night' || timeState.timeOfDay === 'dusk';

  return (
    <div className="flex justify-center items-center h-64 relative">
      <div className={`transition-all duration-500 ${
        petState.mood === 'playing' ? 'animate-bounce' : 
        petState.mood === 'tired' || isNightTime ? 'animate-pulse' : ''
      }`}>
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="drop-shadow-lg"
        >
          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="40" ry="8" fill="rgba(0,0,0,0.2)" />
          
          {/* Body */}
          <circle 
            cx="100" 
            cy="120" 
            r="60" 
            fill={getMoodColor()}
            className="transition-colors duration-500"
          />
          
          {/* Body highlight */}
          <circle 
            cx="85" 
            cy="105" 
            r="15" 
            fill="rgba(255,255,255,0.3)"
          />
          
          {/* Head */}
          <circle 
            cx="100" 
            cy="80" 
            r="40" 
            fill={getMoodColor()}
            className="transition-colors duration-500"
          />
          
          {/* Head highlight */}
          <circle 
            cx="90" 
            cy="70" 
            r="10" 
            fill="rgba(255,255,255,0.4)"
          />
          
          {/* Eyes */}
          {getEyeState() === 'dead' ? (
            <>
              <text x="85" y="85" fontSize="20" textAnchor="middle">✕</text>
              <text x="115" y="85" fontSize="20" textAnchor="middle">✕</text>
            </>
          ) : getEyeState() === 'sleepy' ? (
            <>
              <path d="M 80 75 Q 90 85 100 75" stroke="#333" strokeWidth="3" fill="none"/>
              <path d="M 100 75 Q 110 85 120 75" stroke="#333" strokeWidth="3" fill="none"/>
            </>
          ) : getEyeState() === 'sad' ? (
            <>
              <circle cx="88" cy="78" r="6" fill="#333"/>
              <circle cx="112" cy="78" r="6" fill="#333"/>
              <circle cx="90" cy="76" r="2" fill="white"/>
              <circle cx="114" cy="76" r="2" fill="white"/>
            </>
          ) : getEyeState() === 'excited' ? (
            <>
              <circle cx="88" cy="75" r="8" fill="#333"/>
              <circle cx="112" cy="75" r="8" fill="#333"/>
              <circle cx="91" cy="72" r="3" fill="white"/>
              <circle cx="115" cy="72" r="3" fill="white"/>
            </>
          ) : (
            <>
              <circle cx="88" cy="77" r="7" fill="#333"/>
              <circle cx="112" cy="77" r="7" fill="#333"/>
              <circle cx="91" cy="74" r="2" fill="white"/>
              <circle cx="115" cy="74" r="2" fill="white"/>
            </>
          )}
          
          {/* Mouth */}
          {getMouthState() === 'dead' ? (
            <rect x="95" y="90" width="10" height="3" fill="#333"/>
          ) : getMouthState() === 'hungry' ? (
            <circle cx="100" cy="92" r="8" fill="#333"/>
          ) : getMouthState() === 'sad' ? (
            <path d="M 90 95 Q 100 85 110 95" stroke="#333" strokeWidth="3" fill="none"/>
          ) : getMouthState() === 'excited' ? (
            <path d="M 85 88 Q 100 105 115 88" stroke="#333" strokeWidth="4" fill="none"/>
          ) : (
            <path d="M 90 88 Q 100 98 110 88" stroke="#333" strokeWidth="3" fill="none"/>
          )}
          
          {/* Cheeks (when happy or playing) */}
          {(petState.mood === 'happy' || petState.mood === 'playing') && (
            <>
              <circle cx="65" cy="85" r="8" fill="rgba(255,182,193,0.6)"/>
              <circle cx="135" cy="85" r="8" fill="rgba(255,182,193,0.6)"/>
            </>
          )}
          
          {/* Arms */}
          <circle cx="55" cy="110" r="12" fill={getMoodColor()} className="transition-colors duration-500"/>
          <circle cx="145" cy="110" r="12" fill={getMoodColor()} className="transition-colors duration-500"/>
          
          {/* Feet */}
          <ellipse cx="80" cy="170" rx="15" ry="10" fill={getMoodColor()} className="transition-colors duration-500"/>
          <ellipse cx="120" cy="170" rx="15" ry="10" fill={getMoodColor()} className="transition-colors duration-500"/>
          
          {/* Special effects */}
          {petState.mood === 'sick' && (
            <>
              <text x="70" y="60" fontSize="16">😵</text>
              <text x="120" y="50" fontSize="16">💫</text>
            </>
          )}
          
          {petState.mood === 'hungry' && (
            <text x="100" y="40" fontSize="20" textAnchor="middle">🍽️</text>
          )}
          
          {petState.mood === 'playing' && (
            <>
              <text x="60" y="50" fontSize="16">⭐</text>
              <text x="130" y="45" fontSize="16">✨</text>
              <text x="70" y="30" fontSize="16">🎵</text>
            </>
          )}
          
          {/* Sleep indicator at night */}
          {isNightTime && petState.mood !== 'playing' && (
            <text x="120" y="40" fontSize="16">💤</text>
          )}
        </svg>
      </div>
      
      {/* Status indicator */}
      <div className="absolute top-4 right-4 bg-white/80 rounded-full px-3 py-1 text-sm font-semibold">
        Age: {Math.floor(stats.age)}
      </div>
    </div>
  );
};

export default TamagotchiPet;
