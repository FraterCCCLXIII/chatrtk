
import React, { useState, useEffect } from 'react';
import TamagotchiPet from './TamagotchiPet';
import GameControls from './GameControls';
import StatusBar from './StatusBar';
import TimeControls from './TimeControls';
import DayCycle from './DayCycle';

export interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  age: number;
}

export interface PetState {
  mood: 'happy' | 'sad' | 'hungry' | 'tired' | 'sick' | 'playing';
  isAlive: boolean;
}

export interface TimeState {
  timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night';
  dayProgress: number; // 0-100
}

const TamagotchiGame = () => {
  const [stats, setStats] = useState<PetStats>({
    hunger: 80,
    happiness: 70,
    energy: 90,
    age: 0
  });

  const [petState, setPetState] = useState<PetState>({
    mood: 'happy',
    isAlive: true
  });

  const [timeState, setTimeState] = useState<TimeState>({
    timeOfDay: 'morning',
    dayProgress: 25
  });

  const [timeSpeed, setTimeSpeed] = useState(1); // 1x, 2x, 4x speed multiplier
  const [lastFed, setLastFed] = useState(Date.now());
  const [lastPlayed, setLastPlayed] = useState(Date.now());

  // Day cycle logic
  useEffect(() => {
    const dayInterval = setInterval(() => {
      setTimeState(prev => {
        const newProgress = (prev.dayProgress + (0.5 * timeSpeed)) % 100;
        
        let newTimeOfDay: TimeState['timeOfDay'];
        if (newProgress < 10) newTimeOfDay = 'dawn';
        else if (newProgress < 25) newTimeOfDay = 'morning';
        else if (newProgress < 40) newTimeOfDay = 'midday';
        else if (newProgress < 55) newTimeOfDay = 'afternoon';
        else if (newProgress < 70) newTimeOfDay = 'dusk';
        else newTimeOfDay = 'night';

        return {
          dayProgress: newProgress,
          timeOfDay: newTimeOfDay
        };
      });
    }, 1000);

    return () => clearInterval(dayInterval);
  }, [timeSpeed]);

  // Game logic - stats decrease over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newStats = {
          ...prev,
          hunger: Math.max(0, prev.hunger - (1 * timeSpeed)),
          happiness: Math.max(0, prev.happiness - (0.5 * timeSpeed)),
          energy: Math.max(0, prev.energy - (0.3 * timeSpeed)),
          age: prev.age + (0.01 * timeSpeed)
        };

        // Determine mood based on stats
        let newMood: PetState['mood'] = 'happy';
        if (newStats.hunger < 30) newMood = 'hungry';
        else if (newStats.happiness < 30) newMood = 'sad';
        else if (newStats.energy < 30) newMood = 'tired';
        else if (newStats.hunger < 10 || newStats.happiness < 10) newMood = 'sick';

        setPetState(prev => ({
          ...prev,
          mood: newMood,
          isAlive: newStats.hunger > 0 && newStats.happiness > 0
        }));

        return newStats;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [timeSpeed]);

  const feedPet = () => {
    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 25),
      happiness: Math.min(100, prev.happiness + 5)
    }));
    setLastFed(Date.now());
    setPetState(prev => ({ ...prev, mood: 'happy' }));
    
    // Temporary animation state
    setTimeout(() => {
      setPetState(prev => ({ 
        ...prev, 
        mood: stats.hunger > 50 ? 'happy' : 'hungry' 
      }));
    }, 2000);
  };

  const playWithPet = () => {
    if (stats.energy < 20) return;
    
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 15)
    }));
    setLastPlayed(Date.now());
    setPetState(prev => ({ ...prev, mood: 'playing' }));
    
    // Return to normal state after playing
    setTimeout(() => {
      setPetState(prev => ({ 
        ...prev, 
        mood: 'happy'
      }));
    }, 3000);
  };

  const petToSleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30),
      happiness: Math.min(100, prev.happiness + 5)
    }));
    setPetState(prev => ({ ...prev, mood: 'tired' }));
    
    setTimeout(() => {
      setPetState(prev => ({ 
        ...prev, 
        mood: 'happy'
      }));
    }, 4000);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-white/50">
      <DayCycle timeState={timeState} />
      <StatusBar stats={stats} />
      <TimeControls timeSpeed={timeSpeed} onTimeSpeedChange={setTimeSpeed} />
      <div className="my-8">
        <TamagotchiPet petState={petState} stats={stats} timeState={timeState} />
      </div>
      {petState.isAlive ? (
        <GameControls 
          onFeed={feedPet}
          onPlay={playWithPet}
          onSleep={petToSleep}
          canPlay={stats.energy >= 20}
        />
      ) : (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">💔 Game Over</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Start New Pet
          </button>
        </div>
      )}
    </div>
  );
};

export default TamagotchiGame;
