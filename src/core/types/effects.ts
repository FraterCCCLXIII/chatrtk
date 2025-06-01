export type EffectType = 'pencil' | 'pixelate' | 'scanline' | 'dot';

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
  gridSize: number;
  color: string;
  noisy: boolean;
  animationSpeed: number;
}

export interface ScanlineEffectConfig {
  enabled: boolean;
  gridSize: number;
  thickness: number;
  color: string;
  borderColor: string;
  noisy: boolean;
  animationSpeed: number;
  opacity: number;
  speed: number;
  blendMode: 'hard-light' | 'multiply' | 'overlay';
}

export interface DotEffectConfig {
  enabled: boolean;
  gridSize: number;
  elementSize: number;
  thickness: number;
  color: string;
  borderColor: string;
  noisy: boolean;
  animationSpeed: number;
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
  gridSize: 10,
  color: '#ffffff',
  noisy: false,
  animationSpeed: 1
};

export const DEFAULT_SCANLINE_CONFIG: ScanlineEffectConfig = {
  enabled: false,
  gridSize: 64,
  thickness: 0.5,
  color: '#8BC34A',
  borderColor: 'teal',
  noisy: true,
  animationSpeed: 1,
  opacity: 0.5,
  speed: 2,
  blendMode: 'hard-light'
};

export const DEFAULT_DOT_CONFIG: DotEffectConfig = {
  enabled: false,
  gridSize: 64,
  elementSize: 0.75,
  thickness: 0.5,
  color: 'aquamarine',
  borderColor: 'teal',
  noisy: true,
  animationSpeed: 1
};

export interface EffectsState {
  activeEffect: EffectType | null;
  pencilEffect: PencilEffectConfig;
  pixelateEffect: PixelateEffectConfig;
  scanlineEffect: ScanlineEffectConfig;
  dotEffect: DotEffectConfig;
} 