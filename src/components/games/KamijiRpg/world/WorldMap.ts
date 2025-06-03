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

  findNearestTileOfType(type: string, fromPosition: Position): Position | null {
    let nearestTile: Position | null = null;
    let minDistance = Infinity;

    // Search in expanding squares around the position
    const maxSearchDistance = Math.max(this.width, this.height);
    
    for (let distance = 1; distance < maxSearchDistance; distance++) {
      // Check all positions at this distance
      for (let dx = -distance; dx <= distance; dx++) {
        for (let dy = -distance; dy <= distance; dy++) {
          // Only check positions at the current distance
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== distance) continue;

          const x = fromPosition.x + dx;
          const y = fromPosition.y + dy;

          // Skip if out of bounds
          if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;

          const tile = this.terrain[y][x];
          if (tile.type === type) {
            const currentDistance = Math.abs(dx) + Math.abs(dy);
            if (currentDistance < minDistance) {
              minDistance = currentDistance;
              nearestTile = { x, y };
            }
          }
        }
      }

      // If we found a tile at this distance, return it
      // This ensures we get the nearest tile
      if (nearestTile) {
        return nearestTile;
      }
    }

    return null;
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
