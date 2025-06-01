import { Effect } from './fxManager';

export const createPixelateEffect = (): Effect => ({
  id: 'pixelate',
  name: 'Pixelate',
  enabled: false,
  config: {
    '--pixel-size': '4px',
    '--pixel-blur': '0px'
  }
}); 