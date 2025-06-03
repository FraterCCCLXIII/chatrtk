import React from 'react';
import { Clock, FastForward, Rewind } from 'lucide-react';

interface TimeControlsProps {
  timeSpeed: number;
  onTimeSpeedChange: (speed: number) => void;
}

const TimeControls: React.FC<TimeControlsProps> = ({
  timeSpeed,
  onTimeSpeedChange
}) => {
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Time Speed</h3>
        <Clock className="h-5 w-5 text-gray-600" />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onTimeSpeedChange(Math.max(0.5, timeSpeed / 2))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Slow down time"
        >
          <Rewind className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1 flex justify-center gap-1">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => onTimeSpeedChange(speed)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                timeSpeed === speed
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
        <button
          onClick={() => onTimeSpeedChange(Math.min(4, timeSpeed * 2))}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Speed up time"
        >
          <FastForward className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TimeControls; 