
import React from 'react';

interface TimeControlsProps {
  timeSpeed: number;
  onTimeSpeedChange: (speed: number) => void;
}

const TimeControls = ({ timeSpeed, onTimeSpeedChange }: TimeControlsProps) => {
  const speedOptions = [
    { value: 1, label: '1x', emoji: '🐌' },
    { value: 2, label: '2x', emoji: '⚡' },
    { value: 4, label: '4x', emoji: '🚀' }
  ];

  return (
    <div className="bg-white/60 rounded-2xl p-3 backdrop-blur-sm mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Time Speed:</span>
        <div className="flex gap-2">
          {speedOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeSpeedChange(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${
                timeSpeed === option.value
                  ? 'bg-blue-500 text-white scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <span>{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeControls;
