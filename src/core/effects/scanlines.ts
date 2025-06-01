import { Effect } from './fxManager';

export const createScanlinesEffect = (): Effect => ({
  id: 'scanlines',
  name: 'Scanlines',
  enabled: false,
  config: {
    '--scanline-opacity': '0.1',
    '--scanline-speed': '1',
    '--scanline-color': '#000000'
  }
}); 