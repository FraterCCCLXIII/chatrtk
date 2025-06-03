import React from 'react';

interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  age: number;
}

interface StatusBarProps {
  stats: PetStats;
}

const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  const getStatusColor = (value: number) => {
    if (value > 70) return 'bg-green-500';
    if (value > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Status</h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Hunger</span>
            <span>{Math.round(stats.hunger)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStatusColor(stats.hunger)} transition-all duration-300`}
              style={{ width: `${stats.hunger}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Happiness</span>
            <span>{Math.round(stats.happiness)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStatusColor(stats.happiness)} transition-all duration-300`}
              style={{ width: `${stats.happiness}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Energy</span>
            <span>{Math.round(stats.energy)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStatusColor(stats.energy)} transition-all duration-300`}
              style={{ width: `${stats.energy}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Age: {stats.age} days
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 