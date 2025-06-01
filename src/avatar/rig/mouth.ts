// Mouth rig/morph target definitions and logic

export const phonemeMap: Record<string, MouthShape> = {
  'a': 'open',
  'e': 'smile',
  'i': 'smile',
  'o': 'round',
  'u': 'round',
  'm': 'closed',
  'p': 'closed',
  'b': 'closed',
  'f': 'teeth',
  'v': 'teeth',
  'th': 'tongue',
  'l': 'tongue',
  'r': 'round',
  's': 'smile',
  'z': 'smile',
  'sh': 'smile',
  'ch': 'smile',
  'j': 'smile',
  'k': 'open',
  'g': 'open',
  'h': 'open',
  'n': 'neutral',
  't': 'neutral',
  'd': 'neutral',
  'y': 'smile',
  'w': 'round'
};

export const mouthShapes = {
  neutral: {},
  open: {},
  smile: {},
  round: {},
  closed: {},
  teeth: {},
  tongue: {},
};

export type MouthShape = keyof typeof mouthShapes;

export function getMouthShape(phoneme: string | undefined, isSpeaking: boolean): MouthShape {
  if (!isSpeaking) return 'neutral';
  if (phoneme) {
    return phonemeMap[phoneme.toLowerCase()] || 'neutral';
  }
  return 'neutral';
} 