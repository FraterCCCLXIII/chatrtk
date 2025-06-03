
import React from 'react';
import { Heart, Egg } from 'lucide-react';
import { PetStats } from './TamagotchiGame';

interface StatusBarProps {
  stats: PetStats;
}

const StatusBar = ({ stats }: StatusBarProps) => {
  const getBarColor = (value: number) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    if (value > 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const StatBar = ({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) => (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-600">{Math.round(value)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getBarColor(value)}`}
          style={{ width: `${Math.max(0, value)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm">
      <StatBar 
        label="Hunger" 
        value={stats.hunger} 
        icon={<Egg className="w-4 h-4 text-orange-500" />}
      />
      <StatBar 
        label="Happiness" 
        value={stats.happiness} 
        icon={<Heart className="w-4 h-4 text-pink-500" />}
      />
      <StatBar 
        label="Energy" 
        value={stats.energy} 
        icon={<span className="text-blue-500">⚡</span>}
      />
    </div>
  );
};

export default StatusBar;
