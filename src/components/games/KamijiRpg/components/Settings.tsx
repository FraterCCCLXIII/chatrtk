import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bot, MessageSquare } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SettingsProps {
  aiMovementEnabled: boolean;
  aiSpeechEnabled: boolean;
  onAiMovementChange: (enabled: boolean) => void;
  onAiSpeechChange: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  aiMovementEnabled,
  aiSpeechEnabled,
  onAiMovementChange,
  onAiSpeechChange,
}) => {
  // Local state to track switch values
  const [localMovementEnabled, setLocalMovementEnabled] = useState(aiMovementEnabled);
  const [localSpeechEnabled, setLocalSpeechEnabled] = useState(aiSpeechEnabled);
  
  // Update local state when props change
  useEffect(() => {
    setLocalMovementEnabled(aiMovementEnabled);
  }, [aiMovementEnabled]);
  
  useEffect(() => {
    setLocalSpeechEnabled(aiSpeechEnabled);
  }, [aiSpeechEnabled]);

  const handleMovementChange = (checked: boolean) => {
    console.log('Movement switch clicked, current state:', localMovementEnabled, 'new state:', checked);
    // Update local state first
    setLocalMovementEnabled(checked);
    // Then call the parent handler with the new value
    // Use setTimeout to ensure the state update happens after the current event loop
    setTimeout(() => onAiMovementChange(checked), 50);
  };

  const handleSpeechChange = (checked: boolean) => {
    console.log('Speech switch clicked, current state:', localSpeechEnabled, 'new state:', checked);
    // Update local state first
    setLocalSpeechEnabled(checked);
    // Then call the parent handler with the new value
    // Use setTimeout to ensure the state update happens after the current event loop
    setTimeout(() => onAiSpeechChange(checked), 50);
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            title="Game Settings"
            aria-label="Game Settings"
          >
            <SettingsIcon className="h-5 w-5 text-gray-600" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 z-[9999]" 
          side="bottom" 
          align="end"
          sideOffset={5}
        >
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Game Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-gray-600" />
                  <Label 
                    htmlFor="ai-movement" 
                    className="text-sm cursor-pointer"
                  >
                    AI Movement Control
                  </Label>
                </div>
                <Switch
                  id="ai-movement"
                  checked={localMovementEnabled}
                  onCheckedChange={handleMovementChange}
                  aria-label="Toggle AI Movement Control"
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                />
              </div>
              <p className="text-xs text-gray-500">
                Let AI control Kamiji's movement in RPG mode based on their needs and environment
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <Label 
                    htmlFor="ai-speech" 
                    className="text-sm cursor-pointer"
                  >
                    AI Speech Control
                  </Label>
                </div>
                <Switch
                  id="ai-speech"
                  checked={localSpeechEnabled}
                  onCheckedChange={handleSpeechChange}
                  aria-label="Toggle AI Speech Control"
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                />
              </div>
              <p className="text-xs text-gray-500">
                Enable AI-generated dialogue for Kamiji in both RPG and Virtual Pet modes
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Settings; 