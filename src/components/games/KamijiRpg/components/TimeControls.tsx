import React from 'react';
import { Button } from "@/components/ui/button";
import { Pause, Play, FastForward } from 'lucide-react';

interface TimeControlsProps {
  timeSpeed: number;
  onTimeSpeedChange: (speed: number) => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({
  timeSpeed,
  onTimeSpeedChange,
}) => {
  const [isPaused, setIsPaused] = React.useState(timeSpeed === 0);

  const handlePauseToggle = React.useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      onTimeSpeedChange(1);
    } else {
      setIsPaused(true);
      onTimeSpeedChange(0);
    }
  }, [isPaused, onTimeSpeedChange]);

  const handleSpeedChange = React.useCallback((speed: number) => {
    setIsPaused(false);
    onTimeSpeedChange(speed);
  }, [onTimeSpeedChange]);

  return (
    <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg p-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePauseToggle}
        className="flex items-center gap-2"
      >
        {isPaused ? (
          <>
            <Play className="h-4 w-4" />
            <span className="sr-only">Resume</span>
          </>
        ) : (
          <>
            <Pause className="h-4 w-4" />
            <span className="sr-only">Pause</span>
          </>
        )}
      </Button>

      <div className="flex items-center gap-1">
        <Button
          variant={timeSpeed === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => handleSpeedChange(1)}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          <span className="sr-only">Normal Speed</span>
        </Button>

        <Button
          variant={timeSpeed === 2 ? "default" : "outline"}
          size="sm"
          onClick={() => handleSpeedChange(2)}
          className="flex items-center gap-2"
        >
          <FastForward className="h-4 w-4" />
          <span className="sr-only">Fast Forward</span>
        </Button>
      </div>
    </div>
  );
}; 