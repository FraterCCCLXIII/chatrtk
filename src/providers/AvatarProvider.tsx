import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AvatarState, AvatarContextType, FaceTheme, HeadShape } from '@/types/avatar';

// Default theme
const defaultTheme: FaceTheme = {
  id: 'default',
  name: 'Minty',
  description: 'The classic mint green face',
  previewColor: '#5ddbaf',
  screenColor: '#e2ffe5',
  faceColor: '#5daa77',
  tongueColor: '#ff7d9d',
  eyeColor: '#000000',
  strokeColor: '#333333',
  showStroke: true
};

// Initial state
const initialState: AvatarState = {
  theme: defaultTheme,
  shape: 'circle',
  expression: 'neutral',
  speaking: false,
  text: ''
};

// Action types
type AvatarAction =
  | { type: 'SET_THEME'; payload: FaceTheme }
  | { type: 'SET_SHAPE'; payload: HeadShape }
  | { type: 'SET_EXPRESSION'; payload: AvatarState['expression'] }
  | { type: 'SET_SPEAKING'; payload: boolean }
  | { type: 'SET_TEXT'; payload: string };

// Reducer
function avatarReducer(state: AvatarState, action: AvatarAction): AvatarState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SHAPE':
      return { ...state, shape: action.payload };
    case 'SET_EXPRESSION':
      return { ...state, expression: action.payload };
    case 'SET_SPEAKING':
      return { ...state, speaking: action.payload };
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    default:
      return state;
  }
}

// Create context
const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// Provider component
export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(avatarReducer, initialState);

  const setTheme = useCallback((theme: FaceTheme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const setShape = useCallback((shape: HeadShape) => {
    dispatch({ type: 'SET_SHAPE', payload: shape });
  }, []);

  const setExpression = useCallback((expression: AvatarState['expression']) => {
    dispatch({ type: 'SET_EXPRESSION', payload: expression });
  }, []);

  const setSpeaking = useCallback((speaking: boolean) => {
    dispatch({ type: 'SET_SPEAKING', payload: speaking });
  }, []);

  const setText = useCallback((text: string) => {
    dispatch({ type: 'SET_TEXT', payload: text });
  }, []);

  const value = {
    state,
    setTheme,
    setShape,
    setExpression,
    setSpeaking,
    setText
  };

  return (
    <AvatarContext.Provider value={value}>
      {children}
    </AvatarContext.Provider>
  );
};

// Custom hook to use the avatar context
export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
}; 