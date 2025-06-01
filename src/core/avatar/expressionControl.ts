import { FaceTheme, HeadShape } from '@/types/avatar';

export interface ExpressionState {
  expression: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
  intensity: number;
  duration: number;
}

export interface ExpressionControl {
  currentExpression: ExpressionState;
  setExpression: (expression: ExpressionState) => void;
  resetExpression: () => void;
}

export const createExpressionControl = (): ExpressionControl => {
  let currentExpression: ExpressionState = {
    expression: 'neutral',
    intensity: 1,
    duration: 0
  };

  return {
    get currentExpression() {
      return currentExpression;
    },
    setExpression(expression: ExpressionState) {
      currentExpression = expression;
    },
    resetExpression() {
      currentExpression = {
        expression: 'neutral',
        intensity: 1,
        duration: 0
      };
    }
  };
}; 