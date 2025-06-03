
import { Position, Character, TerrainTile } from '../types';

export interface IGameEngine {
  moveCharacter(direction: string): boolean;
  getCharacterPosition(): Position;
  getTerrainAt(position: Position): TerrainTile | null;
  isValidMove(position: Position): boolean;
  updateCharacter(updates: Partial<Character>): void;
}
