import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GameEngine } from './gameEngine/GameEngine';
import { DialogueSystem } from './dialogue/DialogueSystem';
import { Character, Direction } from './types';
import TerrainSprite from './components/TerrainSprite';
import KamijiSprite from './components/KamijiSprite';
import SpeechBubble from './components/SpeechBubble';
import StatusBar from './components/StatusBar';
import GameControls from './components/GameControls';
import TimeControls from './components/TimeControls';

// Define PetStats interface here since we're not importing it
interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  age: number;
}

interface KamijiRpgProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KamijiRpg: React.FC<KamijiRpgProps> = ({ open, onOpenChange }) => {
  const [gameEngine] = useState(() => {
    const initialCharacter: Character = {
      id: 'kamiji',
      position: { x: 10, y: 7 },
      type: 'character',
      direction: 'down',
      isMoving: false,
      mood: 'happy'
    };
    return new GameEngine(initialCharacter);
  });

  const [dialogueSystem] = useState(() => new DialogueSystem());
  const [character, setCharacter] = useState(() => gameEngine.getCharacter());
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [terrain] = useState(() => gameEngine['worldMap'].getAllTerrain());
  const [timeSpeed, setTimeSpeed] = useState(1);
  
  // Tamagotchi stats
  const [stats, setStats] = useState<PetStats>({
    hunger: 80,
    happiness: 70,
    energy: 90,
    age: 0
  });

  const updateCharacterState = useCallback(() => {
    setCharacter(gameEngine.getCharacter());
  }, [gameEngine]);

  const handleMove = useCallback((direction: Direction) => {
    const moved = gameEngine.moveCharacter(direction);
    if (moved) {
      updateCharacterState();
      
      // Slightly decrease energy when moving
      setStats(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 0.5)
      }));
      
      // Check for terrain interaction message
      const currentTerrain = gameEngine.getTerrainAt(gameEngine.getCharacterPosition());
      if (currentTerrain && !currentTerrain.passable) {
        const message = dialogueSystem.getRandomMessage({
          interactionType: 'terrain_interaction',
          terrain: currentTerrain.type,
          mood: character.mood
        });
        if (message) {
          setCurrentMessage(message);
        }
      }
    }
  }, [gameEngine, dialogueSystem, character.mood, updateCharacterState]);

  const generateRandomMessage = useCallback(() => {
    const currentTerrain = gameEngine.getTerrainAt(gameEngine.getCharacterPosition());
    const message = dialogueSystem.getRandomMessage({
      mood: character.mood,
      terrain: currentTerrain?.type,
      interactionType: 'wandering'
    });
    
    if (message) {
      setCurrentMessage(message);
    }
  }, [gameEngine, dialogueSystem, character.mood]);

  // Tamagotchi actions
  const handleFeed = () => {
    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 20),
      happiness: Math.min(100, prev.happiness + 5)
    }));
  };

  const handlePlay = () => {
    if (stats.energy > 20) {
      setStats(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 15),
        energy: Math.max(0, prev.energy - 15)
      }));
    }
  };

  const handleSleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30),
      happiness: Math.min(100, prev.happiness + 5)
    }));
  };

  // Handle keyboard input
  useEffect(() => {
    if (!open) return;
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          handleMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, handleMove]);

  // Random dialogue timer
  useEffect(() => {
    if (!open) return;
    const interval = setInterval(generateRandomMessage, 5000 / timeSpeed);
    return () => clearInterval(interval);
  }, [open, generateRandomMessage, timeSpeed]);

  // Mood changes based on stats
  useEffect(() => {
    if (!open) return;
    const moodInterval = setInterval(() => {
      let newMood = 'happy';
      if (stats.hunger < 30 || stats.energy < 20) {
        newMood = 'tired';
      } else if (stats.happiness > 80) {
        newMood = 'happy';
      } else if (stats.happiness < 40) {
        newMood = 'tired';
      } else {
        newMood = 'curious';
      }
      
      gameEngine.updateCharacter({ mood: newMood });
      updateCharacterState();
    }, 2000 / timeSpeed);

    return () => clearInterval(moodInterval);
  }, [open, gameEngine, updateCharacterState, stats, timeSpeed]);

  // Stat decay over time
  useEffect(() => {
    if (!open) return;
    const decayInterval = setInterval(() => {
      setStats(prev => ({
        hunger: Math.max(0, prev.hunger - 0.5 * timeSpeed),
        happiness: Math.max(0, prev.happiness - 0.3 * timeSpeed),
        energy: Math.max(0, prev.energy - 0.4 * timeSpeed),
        age: prev.age
      }));
    }, 1000);

    return () => clearInterval(decayInterval);
  }, [open, timeSpeed]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">Kamiji's Island Adventure</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-6 p-4 bg-gradient-to-b from-sky-200 to-green-200 min-h-screen">
          {/* Left side - Controls and Stats */}
          <div className="lg:w-80 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Kamiji's Island Adventure</h2>
            
            <TimeControls 
              timeSpeed={timeSpeed} 
              onTimeSpeedChange={setTimeSpeed} 
            />
            
            <StatusBar stats={stats} />
            
            <GameControls
              onFeed={handleFeed}
              onPlay={handlePlay}
              onSleep={handleSleep}
              canPlay={stats.energy > 20}
            />
            
            <div className="bg-white/60 rounded-2xl p-3 backdrop-blur-sm">
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Position:</strong> ({character.position.x}, {character.position.y})</p>
                <p><strong>Mood:</strong> {character.mood}</p>
                <p><strong>Facing:</strong> {character.direction}</p>
              </div>
            </div>
          </div>

          {/* Right side - Game World */}
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-white rounded-lg p-4 shadow-lg overflow-auto max-w-full">
              <div 
                className="grid gap-0 relative"
                style={{ gridTemplateColumns: `repeat(20, 32px)` }}
              >
                {terrain.map((row, y) =>
                  row.map((tile, x) => (
                    <div key={`${x}-${y}`} className="relative w-8 h-8">
                      <TerrainSprite type={tile.type} size={32} />
                      
                      {/* Render Kamiji if at this position */}
                      {character.position.x === x && character.position.y === y && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <KamijiSprite
                              direction={character.direction}
                              isMoving={character.isMoving}
                              mood={character.mood}
                              size={32}
                            />
                            <SpeechBubble message={currentMessage} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Use arrow keys or WASD to move Kamiji around the island!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KamijiRpg; 