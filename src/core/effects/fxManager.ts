import { createScanlinesEffect } from './scanlines';
import { createPixelateEffect } from './pixelate';
import { createPencilJitterEffect } from './pencilJitter';

export interface Effect {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface EffectsManager {
  effects: Record<string, Effect>;
  enableEffect: (id: string) => void;
  disableEffect: (id: string) => void;
  updateEffectConfig: (id: string, config: Partial<Effect['config']>) => void;
  getEffectStyles: () => Record<string, string>;
}

export const createEffectsManager = (): EffectsManager => {
  const effects: Record<string, Effect> = {
    scanlines: createScanlinesEffect(),
    pixelate: createPixelateEffect(),
    pencilJitter: createPencilJitterEffect()
  };

  return {
    get effects() {
      return effects;
    },
    enableEffect(id: string) {
      if (effects[id]) {
        effects[id].enabled = true;
      }
    },
    disableEffect(id: string) {
      if (effects[id]) {
        effects[id].enabled = false;
      }
    },
    updateEffectConfig(id: string, config: Partial<Effect['config']>) {
      if (effects[id]) {
        effects[id].config = { ...effects[id].config, ...config };
      }
    },
    getEffectStyles() {
      const styles: Record<string, string> = {};
      Object.values(effects).forEach(effect => {
        if (effect.enabled) {
          Object.assign(styles, effect.config);
        }
      });
      return styles;
    }
  };
}; 