import React from 'react';
import { Gamepad2, Heart, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GameMode = 'rpg' | 'tamagotchi';

interface GameControlsProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onReset: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentMode,
  onModeChange,
  onReset,
}) => {
  return (
    <div className="flex flex-col gap-2 bg-background/80 backdrop-blur-sm border rounded-lg p-2">
      <Tabs value={currentMode} onValueChange={(value) => onModeChange(value as GameMode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rpg" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            RPG Mode
          </TabsTrigger>
          <TabsTrigger value="tamagotchi" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Virtual Pet
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4" />
        Reset Game
      </Button>
    </div>
  );
}; 