
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

export interface Character extends GameEntity {
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  mood: string;
}

export interface DialogueMessage {
  text: string;
  conditions?: {
    mood?: string;
    terrain?: string;
    timeOfDay?: string;
  };
}

export interface DialogueTheme {
  [key: string]: DialogueMessage[];
}

export type Direction = 'up' | 'down' | 'left' | 'right';
