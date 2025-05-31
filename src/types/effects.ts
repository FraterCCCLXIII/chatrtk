export type EffectType = 'pencil' | 'none';

export interface EffectConfig {
  type: EffectType;
  intensity: number;
  enabled: boolean;
}

export interface PencilEffectConfig extends EffectConfig {
  type: 'pencil';
  baseFrequency: number;
  numOctaves: number;
  scale: number;
  animationSpeed: number;
}

export const DEFAULT_PENCIL_CONFIG: PencilEffectConfig = {
  type: 'pencil',
  intensity: 1,
  enabled: false,
  baseFrequency: 0.02,
  numOctaves: 3,
  scale: 2,
  animationSpeed: 0.3
};

export interface EffectsState {
  activeEffect: EffectType;
  pencilConfig: PencilEffectConfig;
} 