export interface Position {
  x: number;
  y: number;
}

export interface GameEntity {
  id: string;
  position: Position;
  type: string;
}

export interface TerrainTile extends GameEntity {
  type: 'grass' | 'tree' | 'rock' | 'water';
  passable: boolean;
}

export interface Character {
  health: number;
  happiness: number;
  energy: number;
  hunger: number;
  thirst: number;
  position: Position;
  direction: 'left' | 'right' | 'up' | 'down';
  isMoving: boolean;
  isEating: boolean;
  isSleeping: boolean;
  isPlaying: boolean;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'tired';
  lastInteraction: number;
  lastMovement: number;
  lastSpeech: number;
  lastBerryCollection: number;
  berriesCollected: number;
  experience: number;
  level: number;
  inventory: string[];
  quests: string[];
  achievements: string[];
  relationships: Record<string, number>;
  skills: {
    foraging: number;
    social: number;
    exploration: number;
    survival: number;
  };
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    charisma: number;
  };
}

export interface DialogueMessage {
  text: string;
  type: 'thought' | 'speech' | 'action';
  mood?: Character['mood'];
  timestamp: number;
}

export interface DialogueTheme {
  [key: string]: DialogueMessage[];
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}
