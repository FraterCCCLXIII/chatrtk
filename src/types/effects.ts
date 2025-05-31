export type EffectType = 'pencil' | 'pixelate' | 'scanline' | 'none';

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

export interface PixelateEffectConfig {
  enabled: boolean;
  pixelSize: number; // Controls the size of the pixels
  intensity: number; // Controls the overall intensity of the effect
}

export interface ScanlineEffectConfig {
  enabled: boolean;
  opacity: number;
  speed: number;
  color: string;
  blendMode: 'hard-light' | 'multiply' | 'overlay';
}

export const DEFAULT_PENCIL_CONFIG: PencilEffectConfig = {
  type: 'pencil',
  intensity: 50,
  enabled: false,
  baseFrequency: 0.02,
  numOctaves: 3,
  scale: 2,
  animationSpeed: 1
};

export const DEFAULT_PIXELATE_CONFIG: PixelateEffectConfig = {
  enabled: false,
  pixelSize: 10,
  intensity: 50
};

export const DEFAULT_SCANLINE_CONFIG: ScanlineEffectConfig = {
  enabled: false,
  opacity: 0.4,
  speed: 2,
  color: '#8BC34A',
  blendMode: 'hard-light'
};

export interface EffectsState {
  activeEffect: EffectType | null;
  pencilEffect: PencilEffectConfig;
  pixelateEffect: PixelateEffectConfig;
  scanlineEffect: ScanlineEffectConfig;
} 