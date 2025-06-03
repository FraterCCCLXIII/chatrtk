
import React from 'react';

interface GameControlsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  canPlay: boolean;
}

const GameControls = ({ onFeed, onPlay, onSleep, canPlay }: GameControlsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      <button
        onClick={onFeed}
        className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-4 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition-transform active:scale-95 flex flex-col items-center gap-2"
      >
        <span className="text-2xl">🍎</span>
        Feed
      </button>
      
      <button
        onClick={onPlay}
        disabled={!canPlay}
        className={`p-4 rounded-2xl font-bold text-sm shadow-lg transition-transform flex flex-col items-center gap-2 ${
          canPlay 
            ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:scale-105 active:scale-95' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <span className="text-2xl">🎮</span>
        Play
      </button>
      
      <button
        onClick={onSleep}
        className="bg-gradient-to-r from-purple-400 to-purple-500 text-white p-4 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition-transform active:scale-95 flex flex-col items-center gap-2"
      >
        <span className="text-2xl">💤</span>
        Sleep
      </button>
    </div>
  );
};

export default GameControls;
