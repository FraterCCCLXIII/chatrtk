import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogPortal
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameEngine } from './gameEngine/GameEngine';
import { DialogueSystem } from './dialogue/DialogueSystem';
import { Character, Direction } from './types';
import TerrainSprite from './components/TerrainSprite';
import KamijiSprite from './components/KamijiSprite';
import SpeechBubble from './components/SpeechBubble';
import StatusBar from './components/StatusBar';
import GameControls from './components/GameControls';
import TimeControls from './components/TimeControls';
import Settings from './components/Settings';
import { Gamepad2, Heart } from 'lucide-react';
import BerrySprite from './components/BerrySprite';

// Define PetStats interface here since we're not importing it
interface PetStats {
  hunger: number;
  happiness: number;
  energy: number;
  age: number;
}

interface Berry {
  id: string;
  position: { x: number; y: number };
  collected: boolean;
}

interface KamijiRpgProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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

  const [aiMovementEnabled, setAiMovementEnabled] = useState(true);
  const [aiSpeechEnabled, setAiSpeechEnabled] = useState(true);

  const [berries, setBerries] = useState<Berry[]>([]);
  const [berriesCollected, setBerriesCollected] = useState(0);

  const handleAiMovementChange = useCallback((enabled: boolean) => {
    console.log('AI Movement change requested:', enabled);
    // Store the setting in localStorage for persistence
    localStorage.setItem('kamijiRpg_aiMovementEnabled', JSON.stringify(enabled));
    setAiMovementEnabled(enabled);
    
    // If AI movement is disabled, stop any current movement
    if (!enabled) {
      gameEngine.updateCharacter({ isMoving: false });
      updateCharacterState();
    }
  }, [gameEngine, updateCharacterState]);

  const handleAiSpeechChange = useCallback((enabled: boolean) => {
    console.log('AI Speech change requested:', enabled);
    // Store the setting in localStorage for persistence
    localStorage.setItem('kamijiRpg_aiSpeechEnabled', JSON.stringify(enabled));
    setAiSpeechEnabled(enabled);
    
    // If AI speech is disabled, clear any current message
    if (!enabled) {
      setCurrentMessage(null);
    }
  }, [setCurrentMessage]);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedMovementSetting = localStorage.getItem('kamijiRpg_aiMovementEnabled');
    if (savedMovementSetting !== null) {
      setAiMovementEnabled(JSON.parse(savedMovementSetting));
    }
    
    const savedSpeechSetting = localStorage.getItem('kamijiRpg_aiSpeechEnabled');
    if (savedSpeechSetting !== null) {
      setAiSpeechEnabled(JSON.parse(savedSpeechSetting));
    }
  }, []);

  useEffect(() => {
    console.log('AI Movement state updated:', aiMovementEnabled);
  }, [aiMovementEnabled]);

  useEffect(() => {
    console.log('AI Speech state updated:', aiSpeechEnabled);
  }, [aiSpeechEnabled]);

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

  // AI Movement Logic
  const getAiMovementDirection = useCallback((): Direction | null => {
    if (!aiMovementEnabled) return null;

    const possibleDirections: Direction[] = ['up', 'down', 'left', 'right'];
    
    // If hungry, prioritize finding berries
    if (stats.hunger < 70) {
      // Get all active berries
      const activeBerries = berries.filter(b => !b.collected);
      
      if (activeBerries.length > 0) {
        // Find the closest berry
        const closestBerry = activeBerries.reduce((closest, berry) => {
          const currentDist = Math.abs(berry.position.x - character.position.x) + 
                            Math.abs(berry.position.y - character.position.y);
          const closestDist = Math.abs(closest.position.x - character.position.x) + 
                            Math.abs(closest.position.y - character.position.y);
          return currentDist < closestDist ? berry : closest;
        });

        // Calculate direction to closest berry
        const dx = closestBerry.position.x - character.position.x;
        const dy = closestBerry.position.y - character.position.y;

        // If very hungry (below 30), move directly towards berry
        if (stats.hunger < 30) {
          if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
          } else {
            return dy > 0 ? 'down' : 'up';
          }
        }
        
        // If moderately hungry, sometimes move towards berry, sometimes randomly
        // The lower the hunger, the higher the chance to move towards berry
        const hungerUrgency = (70 - stats.hunger) / 70; // 0 to 1 scale
        if (Math.random() < hungerUrgency) {
          if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
          } else {
            return dy > 0 ? 'down' : 'up';
          }
        }
      }
    }
    
    // If tired, look for a safe spot (grass tiles)
    if (stats.energy < 30) {
      const grassTiles = gameEngine['worldMap'].findNearestTileOfType('grass', character.position);
      if (grassTiles) {
        const dx = grassTiles.x - character.position.x;
        const dy = grassTiles.y - character.position.y;
        if (Math.abs(dx) > Math.abs(dy)) {
          return dx > 0 ? 'right' : 'left';
        } else {
          return dy > 0 ? 'down' : 'up';
        }
      }
    }

    // Random movement if no specific needs or if random movement was chosen
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  }, [aiMovementEnabled, gameEngine, character.position, stats.hunger, stats.energy, berries]);

  // AI Movement Timer
  useEffect(() => {
    // If AI movement is disabled, stop any current movement and return early
    if (!aiMovementEnabled) {
      gameEngine.updateCharacter({ isMoving: false });
      updateCharacterState();
      return () => {
        // Ensure character stops moving when effect is cleaned up
        gameEngine.updateCharacter({ isMoving: false });
        updateCharacterState();
      };
    }

    const baseInterval = 1000; // Base interval of 1 second
    const interval = setInterval(() => {
      const direction = getAiMovementDirection();
      if (direction) {
        handleMove(direction);
      }
    }, baseInterval / timeSpeed);

    return () => {
      clearInterval(interval);
      // Ensure character stops moving when effect is cleaned up
      gameEngine.updateCharacter({ isMoving: false });
      updateCharacterState();
    };
  }, [aiMovementEnabled, getAiMovementDirection, handleMove, timeSpeed, gameEngine, updateCharacterState]);

  // AI Speech Logic
  const generateAiMessage = useCallback(() => {
    if (!aiSpeechEnabled) {
      // Clear any existing message when AI speech is toggled off
      if (currentMessage) {
        setCurrentMessage(null);
      }
      return;
    }

    const currentTerrain = gameEngine.getTerrainAt(gameEngine.getCharacterPosition());
    let messageType = 'wandering';
    let context = {};

    // Generate context-aware messages based on stats and environment
    if (stats.hunger < 30) {
      messageType = 'needs';
      context = { need: 'berries' }; // Changed from 'food' to 'berries'
    } else if (stats.energy < 20) {
      messageType = 'needs';
      context = { need: 'rest' };
    } else if (stats.happiness < 40) {
      messageType = 'needs';
      context = { need: 'play' };
    } else if (currentTerrain) {
      messageType = 'terrain_interaction';
      context = { terrain: currentTerrain.type };
    }

    const message = dialogueSystem.getRandomMessage({
      mood: character.mood,
      interactionType: messageType,
      ...context
    });

    if (message) {
      setCurrentMessage(message);
    }
  }, [aiSpeechEnabled, gameEngine, stats, character.mood, dialogueSystem]);

  // Update AI speech timer
  useEffect(() => {
    // If AI speech is disabled, clear any existing message
    if (!aiSpeechEnabled) {
      setCurrentMessage(null);
      return () => {};
    }
    
    // Set up interval for AI speech generation
    const interval = setInterval(generateAiMessage, 5000 / timeSpeed);
    
    // Clean up function
    return () => {
      clearInterval(interval);
      // If the component is unmounting or AI speech is being disabled,
      // make sure to clear any existing messages
      if (!aiSpeechEnabled) {
        setCurrentMessage(null);
      }
    };
  }, [aiSpeechEnabled, generateAiMessage, timeSpeed]);

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

  // Handle keyboard input - make movement independent of timeSpeed
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let direction: Direction | null = null;
      
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          direction = 'down';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          direction = 'left';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          direction = 'right';
          break;
      }

      if (direction) {
        // Add a small delay between movements to prevent too rapid movement
        const now = Date.now();
        if (now - lastMoveTime.current >= 100) { // 100ms minimum between moves
          handleMove(direction);
          lastMoveTime.current = now;
        }
      }
    };

    const lastMoveTime = { current: 0 };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  // Random dialogue timer
  useEffect(() => {
    const interval = setInterval(generateRandomMessage, 5000 / timeSpeed);
    return () => clearInterval(interval);
  }, [generateRandomMessage, timeSpeed]);

  // Mood changes based on stats
  useEffect(() => {
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
  }, [gameEngine, updateCharacterState, stats, timeSpeed]);

  // Stat decay over time
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setStats(prev => ({
        hunger: Math.max(0, prev.hunger - 0.5 * timeSpeed),
        happiness: Math.max(0, prev.happiness - 0.3 * timeSpeed),
        energy: Math.max(0, prev.energy - 0.4 * timeSpeed),
        age: prev.age
      }));
    }, 1000);

    return () => clearInterval(decayInterval);
  }, [timeSpeed]);

  // Function to spawn a new berry
  const spawnBerry = useCallback(() => {
    const walkableTiles = terrain.flatMap((row, y) =>
      row.map((tile, x) => ({ x, y, type: tile.type }))
    ).filter(tile => tile.type === 'grass');

    if (walkableTiles.length === 0) return;

    const randomTile = walkableTiles[Math.floor(Math.random() * walkableTiles.length)];
    const newBerry: Berry = {
      id: `berry-${Date.now()}-${Math.random()}`,
      position: { x: randomTile.x, y: randomTile.y },
      collected: false
    };

    setBerries(prev => [...prev, newBerry]);
  }, [terrain]);

  // Spawn berries periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (berries.length < 5) { // Maximum 5 berries at a time
        spawnBerry();
      }
    }, 10000); // Spawn every 10 seconds

    return () => clearInterval(spawnInterval);
  }, [berries.length, spawnBerry]);

  // Check for berry collection
  const checkBerryCollection = useCallback(() => {
    setBerries(prev => {
      const updatedBerries = prev.map(berry => {
        if (!berry.collected && 
            berry.position.x === character.position.x && 
            berry.position.y === character.position.y) {
          // Update stats when berry is collected
          setStats(current => ({
            ...current,
            hunger: Math.min(100, current.hunger + 15),
            happiness: Math.min(100, current.happiness + 10)
          }));
          setBerriesCollected(c => c + 1);
          return { ...berry, collected: true };
        }
        return berry;
      });

      // Remove collected berries after animation
      setTimeout(() => {
        setBerries(current => current.filter(b => !b.collected));
      }, 300);

      return updatedBerries;
    });
  }, [character.position]);

  // Check for berry collection on movement
  useEffect(() => {
    checkBerryCollection();
  }, [character.position, checkBerryCollection]);

  const renderRpgMode = () => (
    <div className="grid grid-rows-[auto_1fr] gap-4 p-4 bg-gradient-to-b from-sky-200 to-green-200 h-full min-h-0">
      {/* Left side - Controls and Stats */}
      <div className="grid grid-cols-[minmax(200px,1fr)_minmax(300px,2fr)] gap-4 h-full min-h-0">
        <div className="flex flex-col gap-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center">Kamiji's Island Adventure</h2>
          
          <div className="bg-white/60 rounded-2xl p-3 backdrop-blur-sm">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Berries Collected:</strong> {berriesCollected}</p>
              <p><strong>Active Berries:</strong> {berries.filter(b => !b.collected).length}</p>
            </div>
          </div>
          
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
        <div className="flex flex-col items-center min-h-0">
          <div className="bg-white rounded-lg p-4 shadow-lg w-full h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <div 
                className="grid relative mx-auto"
                style={{ 
                  gridTemplateColumns: `repeat(20, 1fr)`,
                  width: 'min(100%, 640px)',
                  aspectRatio: '1',
                  gap: 0 // Remove grid gap
                }}
              >
                {terrain.map((row, y) =>
                  row.map((tile, x) => (
                    <div 
                      key={`${x}-${y}`} 
                      className="relative w-full h-full"
                      style={{
                        aspectRatio: '1',
                        overflow: 'hidden' // Ensure sprites don't overflow
                      }}
                    >
                      <div className="absolute inset-0">
                        <TerrainSprite type={tile.type} size="100%" />
                      </div>
                      
                      {/* Render berry if present */}
                      {berries.map(berry => 
                        berry.position.x === x && berry.position.y === y && (
                          <div key={berry.id} className="absolute inset-0 flex items-center justify-center">
                            <BerrySprite size="100%" isCollected={berry.collected} />
                          </div>
                        )
                      )}
                      
                      {/* Render Kamiji if at this position */}
                      {character.position.x === x && character.position.y === y && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            <KamijiSprite
                              direction={character.direction}
                              isMoving={character.isMoving}
                              mood={character.mood}
                              size="100%"
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
                Use arrow keys or WASD to move Kamiji around the island! Collect berries to stay healthy!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTamagotchiMode = () => (
    <div className="flex flex-col items-center justify-center gap-6 p-4 bg-gradient-to-b from-pink-200 to-purple-200 h-full min-h-0">
      <div className="bg-white/80 rounded-3xl p-8 shadow-xl backdrop-blur-sm w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          {/* Kamiji Display */}
          <div className="relative w-48 h-48 bg-gradient-to-b from-blue-100 to-blue-200 rounded-full p-4 shadow-inner">
            <div className="w-full h-full flex items-center justify-center">
              <KamijiSprite
                direction={character.direction}
                isMoving={false}
                mood={character.mood}
                size={120}
              />
              <SpeechBubble message={currentMessage} />
            </div>
          </div>

          {/* Stats and Controls */}
          <div className="w-full space-y-4">
            <StatusBar stats={stats} />
            
            <TimeControls 
              timeSpeed={timeSpeed} 
              onTimeSpeedChange={setTimeSpeed} 
            />
            
            <GameControls
              onFeed={handleFeed}
              onPlay={handlePlay}
              onSleep={handleSleep}
              canPlay={stats.energy > 20}
            />
          </div>

          {/* Status Info */}
          <div className="bg-white/60 rounded-2xl p-4 backdrop-blur-sm w-full">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Mood:</strong> {character.mood}</p>
              <p><strong>Age:</strong> {stats.age} days</p>
              <p className="text-xs text-gray-500 mt-2">
                Kamiji's mood changes based on their needs. Keep them happy by feeding, playing, and letting them rest!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const dialogContent = (
    <div className="flex flex-col h-full overflow-hidden resize">
      <DialogHeader className="flex-none">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">Game Controls</DialogTitle>
          <Settings
            aiMovementEnabled={aiMovementEnabled}
            aiSpeechEnabled={aiSpeechEnabled}
            onAiMovementChange={handleAiMovementChange}
            onAiSpeechChange={handleAiSpeechChange}
          />
        </div>
      </DialogHeader>
      <Tabs defaultValue="rpg" className="flex-1 overflow-hidden">
        <TabsList className="w-full justify-start px-4 pt-2 flex-none">
          <TabsTrigger value="rpg" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            RPG Mode
          </TabsTrigger>
          <TabsTrigger value="tamagotchi" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Virtual Pet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rpg" className="mt-0 h-[calc(100%-3rem)] overflow-hidden">
          {renderRpgMode()}
        </TabsContent>
        
        <TabsContent value="tamagotchi" className="mt-0 h-[calc(100%-3rem)] overflow-hidden">
          {renderTamagotchiMode()}
        </TabsContent>
      </Tabs>
    </div>
  );

  // If open and onOpenChange are provided, use controlled mode
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="max-w-4xl min-w-[600px] min-h-[400px] h-[90vh] p-0 gap-0"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            resize: 'both'
          }}
        >
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise use standalone mode with trigger
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open Kamiji RPG Game"
          type="button"
        >
          <Gamepad2 className="h-5 w-5 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl min-w-[600px] min-h-[400px] h-[90vh] p-0 gap-0"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          resize: 'both'
        }}
      >
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
};

export default KamijiRpg; 