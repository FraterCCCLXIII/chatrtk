
import React from 'react';
import { Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { TimeState } from './TamagotchiGame';

interface DayCycleProps {
  timeState: TimeState;
}

const DayCycle = ({ timeState }: DayCycleProps) => {
  const getSkyGradient = () => {
    switch (timeState.timeOfDay) {
      case 'dawn':
        return 'from-purple-300 via-pink-200 to-orange-200';
      case 'morning':
        return 'from-blue-300 via-blue-200 to-yellow-100';
      case 'midday':
        return 'from-blue-400 via-blue-300 to-blue-200';
      case 'afternoon':
        return 'from-blue-300 via-orange-100 to-yellow-200';
      case 'dusk':
        return 'from-orange-400 via-pink-300 to-purple-300';
      case 'night':
        return 'from-indigo-900 via-purple-800 to-blue-900';
      default:
        return 'from-blue-400 to-blue-200';
    }
  };

  const getCelestialBody = () => {
    const isNightTime = timeState.timeOfDay === 'night';
    const isDawnOrDusk = timeState.timeOfDay === 'dawn' || timeState.timeOfDay === 'dusk';
    
    if (isNightTime) {
      return <Moon className="w-8 h-8 text-yellow-100" />;
    } else if (timeState.timeOfDay === 'dawn') {
      return <Sunrise className="w-8 h-8 text-yellow-400" />;
    } else if (timeState.timeOfDay === 'dusk') {
      return <Sunset className="w-8 h-8 text-orange-400" />;
    } else {
      return <Sun className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getCelestialPosition = () => {
    // Position celestial body based on day progress
    const position = (timeState.dayProgress / 100) * 80 + 10; // 10% to 90% across
    return `${position}%`;
  };

  const getTimeLabel = () => {
    switch (timeState.timeOfDay) {
      case 'dawn': return '🌅 Dawn';
      case 'morning': return '🌤️ Morning';
      case 'midday': return '☀️ Midday';
      case 'afternoon': return '🌞 Afternoon';
      case 'dusk': return '🌇 Dusk';
      case 'night': return '🌙 Night';
      default: return 'Day';
    }
  };

  return (
    <div className={`relative h-20 rounded-2xl bg-gradient-to-r ${getSkyGradient()} mb-4 overflow-hidden`}>
      {/* Stars for night time */}
      {timeState.timeOfDay === 'night' && (
        <div className="absolute inset-0">
          <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-4 right-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-6 left-12 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-3 right-16 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
      
      {/* Celestial body */}
      <div 
        className="absolute top-4 transform -translate-x-1/2 transition-all duration-1000"
        style={{ left: getCelestialPosition() }}
      >
        {getCelestialBody()}
      </div>
      
      {/* Time label */}
      <div className="absolute bottom-2 left-4">
        <span className="text-sm font-bold text-white drop-shadow-lg">
          {getTimeLabel()}
        </span>
      </div>
      
      {/* Day progress bar */}
      <div className="absolute bottom-1 left-4 right-4">
        <div className="w-full bg-white/30 rounded-full h-1">
          <div 
            className="h-1 bg-white/70 rounded-full transition-all duration-1000"
            style={{ width: `${timeState.dayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DayCycle;
