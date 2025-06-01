export interface GameState {
  isPlaying: boolean;
  score?: number;
  currentRound?: number;
  maxRounds?: number;
  playerTurn?: boolean;
  gameData?: any;
}

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  category: 'puzzle' | 'word' | 'ai';
  minPlayers: number;
  maxPlayers: number;
  hasAI: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GameAction {
  type: string;
  payload?: any;
}

export interface GameComponent {
  config: GameConfig;
  state: GameState;
  onAction: (action: GameAction) => void;
  onGameEnd: (result: any) => void;
} 