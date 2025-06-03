import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Character } from '../types';

interface StatusBarProps {
  character: Character;
  timeSpeed: number;
  aiMovementEnabled: boolean;
  aiSpeechEnabled: boolean;
  onAiMovementChange: (enabled: boolean) => void;
  onAiSpeechChange: (enabled: boolean) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  character,
  timeSpeed,
  aiMovementEnabled,
  aiSpeechEnabled,
  onAiMovementChange,
  onAiSpeechChange,
}) => {
  return (
    <div className="flex items-center justify-between px-4 h-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Health:</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${character.health}%` }}
            />
          </div>
          <span className="text-sm">{Math.round(character.health)}%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Energy:</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${character.energy}%` }}
            />
          </div>
          <span className="text-sm">{Math.round(character.energy)}%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Happiness:</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${character.happiness}%` }}
            />
          </div>
          <span className="text-sm">{Math.round(character.happiness)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="ai-movement"
            checked={aiMovementEnabled}
            onCheckedChange={onAiMovementChange}
          />
          <Label htmlFor="ai-movement" className="text-sm">AI Movement</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="ai-speech"
            checked={aiSpeechEnabled}
            onCheckedChange={onAiSpeechChange}
          />
          <Label htmlFor="ai-speech" className="text-sm">AI Speech</Label>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Speed:</span>
          <span className="text-sm">{timeSpeed}x</span>
        </div>
      </div>
    </div>
  );
}; 