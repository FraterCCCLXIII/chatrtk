
import { Position, TerrainTile } from '../types';
import mapData from './mapData.json';

export class WorldMap {
  private terrain: TerrainTile[][];
  private width: number;
  private height: number;

  constructor() {
    this.width = mapData.width;
    this.height = mapData.height;
    this.terrain = this.generateTerrainFromJson();
  }

  getTerrainAt(position: Position): TerrainTile | null {
    if (position.x < 0 || position.x >= this.width || 
        position.y < 0 || position.y >= this.height) {
      return null;
    }
    return this.terrain[position.y][position.x];
  }

  getAllTerrain(): TerrainTile[][] {
    return this.terrain;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  private generateTerrainFromJson(): TerrainTile[][] {
    const terrain: TerrainTile[][] = [];
    
    for (let y = 0; y < this.height; y++) {
      terrain[y] = [];
      for (let x = 0; x < this.width; x++) {
        const tileType = mapData.tiles[y][x] as 'grass' | 'tree' | 'rock' | 'water';
        const passable = tileType === 'grass';
        
        terrain[y][x] = {
          id: `${x}-${y}`,
          position: { x, y },
          type: tileType,
          passable
        };
      }
    }
    
    return terrain;
  }
}
