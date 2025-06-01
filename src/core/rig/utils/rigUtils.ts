import { Phoneme, Expression } from '@/types/avatar';

export const getMouthShape = (phoneme: Phoneme, expression: Expression): string => {
  const mouthShapes: Record<Phoneme, string> = {
    a: 'M 20, 50 Q 40, 60 60, 50',
    e: 'M 20, 50 Q 40, 40 60, 50',
    i: 'M 20, 50 Q 40, 30 60, 50',
    o: 'M 20, 50 Q 40, 70 60, 50',
    u: 'M 20, 50 Q 40, 45 60, 50',
    neutral: 'M 20, 50 Q 40, 50 60, 50',
  };

  const expressionModifiers: Record<Expression, (shape: string) => string> = {
    neutral: (shape) => shape,
    happy: (shape) => shape.replace('50', '40'),
    sad: (shape) => shape.replace('50', '60'),
    surprised: (shape) => shape.replace('50', '30'),
    angry: (shape) => shape.replace('50', '45'),
    thinking: (shape) => shape.replace('50', '55'),
  };

  const baseShape = mouthShapes[phoneme] || mouthShapes.neutral;
  return expressionModifiers[expression](baseShape);
};

export const getEyeState = (blinking: boolean, expression: Expression): string => {
  if (blinking) {
    return 'M 25, 30 Q 30, 35 35, 30';
  }

  const eyeShapes: Record<Expression, string> = {
    neutral: 'M 25, 30 Q 30, 25 35, 30',
    happy: 'M 25, 30 Q 30, 20 35, 30',
    sad: 'M 25, 30 Q 30, 35 35, 30',
    surprised: 'M 25, 25 Q 30, 15 35, 25',
    angry: 'M 25, 35 Q 30, 30 35, 35',
    thinking: 'M 25, 30 Q 30, 28 35, 30',
  };

  return eyeShapes[expression] || eyeShapes.neutral;
}; 