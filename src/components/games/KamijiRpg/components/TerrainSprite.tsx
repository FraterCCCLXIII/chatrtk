import React from 'react';

// Import SVG files
import grassSprite from '../assets/sprites/terrain/grass.svg';
import treeSprite from '../assets/sprites/terrain/tree.svg';
import rockSprite from '../assets/sprites/terrain/rock.svg';
import waterSprite from '../assets/sprites/terrain/water.svg';

interface TerrainSpriteProps {
  type: string;
  size: number | string;
}

const TerrainSprite: React.FC<TerrainSpriteProps> = ({ type, size }) => {
  const getSpriteSrc = () => {
    switch (type) {
      case 'grass':
        return grassSprite;
      case 'tree':
        return treeSprite;
      case 'rock':
        return rockSprite;
      case 'water':
        return waterSprite;
      default:
        return grassSprite; // Default to grass if type is unknown
    }
  };

  return (
    <div className="inline-block">
      <img 
        src={getSpriteSrc()} 
        alt={`${type} terrain`}
        style={{ width: size, height: size }}
        className="w-full h-full"
      />
    </div>
  );
};

export default TerrainSprite;
