// Eye rig/morph target definitions and logic

export const eyeStates = {
  neutral: {},
  closed: {},
  happy: {},
  sad: {},
  surprised: {},
  angry: {},
  thinking: {},
};

export type EyeState = keyof typeof eyeStates;

export function getEyeState(expression: string, blinking: boolean): EyeState {
  if (blinking) return 'closed';
  if (expression === 'happy') return 'happy';
  if (expression === 'sad') return 'sad';
  if (expression === 'surprised') return 'surprised';
  if (expression === 'angry') return 'angry';
  if (expression === 'thinking') return 'thinking';
  return 'neutral';
} 