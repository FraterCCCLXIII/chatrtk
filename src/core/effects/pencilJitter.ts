import { Effect } from './fxManager';

export const createPencilJitterEffect = (): Effect => ({
  id: 'pencilJitter',
  name: 'Pencil Jitter',
  enabled: false,
  config: {
    '--jitter-intensity': '0.5',
    '--jitter-speed': '1',
    '--jitter-color': '#000000'
  }
}); 