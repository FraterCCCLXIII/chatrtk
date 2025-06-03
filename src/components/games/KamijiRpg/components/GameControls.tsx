import React from 'react';
import { Utensils, Play, Moon } from 'lucide-react';

interface GameControlsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  canPlay: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onFeed,
  onPlay,
  onSleep,
  canPlay
}) => {
  return (
    <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onFeed}
          className="flex flex-col items-center justify-center p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
          title="Feed Kamiji"
        >
          <Utensils className="h-6 w-6 mb-1" />
          <span className="text-sm">Feed</span>
        </button>
        <button
          onClick={onPlay}
          disabled={!canPlay}
          className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors ${
            canPlay
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title={canPlay ? "Play with Kamiji" : "Kamiji is too tired to play"}
        >
          <Play className="h-6 w-6 mb-1" />
          <span className="text-sm">Play</span>
        </button>
        <button
          onClick={onSleep}
          className="flex flex-col items-center justify-center p-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
          title="Let Kamiji sleep"
        >
          <Moon className="h-6 w-6 mb-1" />
          <span className="text-sm">Sleep</span>
        </button>
      </div>
    </div>
  );
};

export default GameControls; 