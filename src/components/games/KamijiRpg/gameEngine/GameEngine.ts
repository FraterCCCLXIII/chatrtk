
import { Position, Character, TerrainTile, Direction } from '../types';
import { IGameEngine } from './IGameEngine';
import { WorldMap } from '../world/WorldMap';

export class GameEngine implements IGameEngine {
  private character: Character;
  private worldMap: WorldMap;

  constructor(initialCharacter: Character) {
    this.worldMap = new WorldMap();
    this.character = initialCharacter;
  }

  moveCharacter(direction: Direction): boolean {
    const newPosition = this.calculateNewPosition(this.character.position, direction);
    
    if (this.isValidMove(newPosition)) {
      this.character.position = newPosition;
      this.character.direction = direction;
      this.character.isMoving = true;
      
      // Stop moving after animation
      setTimeout(() => {
        this.character.isMoving = false;
      }, 300);
      
      return true;
    }
    return false;
  }

  getCharacterPosition(): Position {
    return { ...this.character.position };
  }

  getTerrainAt(position: Position): TerrainTile | null {
    return this.worldMap.getTerrainAt(position);
  }

  isValidMove(position: Position): boolean {
    const terrain = this.worldMap.getTerrainAt(position);
    return terrain !== null && terrain.passable;
  }

  updateCharacter(updates: Partial<Character>): void {
    this.character = { ...this.character, ...updates };
  }

  getCharacter(): Character {
    return { ...this.character };
  }

  private calculateNewPosition(currentPos: Position, direction: Direction): Position {
    const newPos = { ...currentPos };
    
    switch (direction) {
      case 'up':
        newPos.y -= 1;
        break;
      case 'down':
        newPos.y += 1;
        break;
      case 'left':
        newPos.x -= 1;
        break;
      case 'right':
        newPos.x += 1;
        break;
    }
    
    return newPos;
  }
}
