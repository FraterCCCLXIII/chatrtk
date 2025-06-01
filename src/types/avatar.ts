// Avatar theme types
/**
 * Represents a theme for the avatar's face
 */
export interface FaceTheme {
  /** Unique identifier for the theme */
  id: string;
  /** Display name of the theme */
  name: string;
  /** Description of the theme */
  description: string;
  /** Color used in theme preview */
  previewColor: string;
  /** Background color of the face screen */
  screenColor: string;
  /** Main color of the face */
  faceColor: string;
  /** Color of the mouth */
  mouthColor: string;
  /** Color of the face border */
  borderColor: string;
  /** Color of the text */
  textColor: string;
  /** Background color of the avatar */
  backgroundColor: string;
  /** Color of the tongue */
  tongueColor: string;
  /** Color of the eyes */
  eyeColor: string;
  /** Color of the face outline */
  strokeColor: string;
  /** Whether to show the face outline */
  showStroke: boolean;
}

// Head shape types
export type HeadShape = 'circle' | 'square' | 'triangle';

// Rig configuration types
export interface RigComponent {
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: string;
  rotation?: number;
  opacity?: number;
}

export interface FaceRigConfig {
  head?: RigComponent;
  leftEye?: RigComponent;
  rightEye?: RigComponent;
  leftTopEyelid?: RigComponent;
  leftBottomEyelid?: RigComponent;
  rightTopEyelid?: RigComponent;
  rightBottomEyelid?: RigComponent;
  mouth?: RigComponent;
  tongue?: RigComponent;
  topTeeth?: RigComponent;
  bottomTeeth?: RigComponent;
}

// Expression types
export enum Expression {
  Neutral = 'neutral',
  Happy = 'happy',
  Sad = 'sad',
  Surprised = 'surprised',
  Angry = 'angry',
  Thinking = 'thinking',
}

// Phoneme types
export interface PhonemeShape {
  width: number;
  height: number;
  borderRadius: string;
  tongueWidth: number;
  tongueHeight: number;
  tongueBottom: number;
  teethTopY: number;
  teethBottomY: number;
  teethWidth: string;
}

export type Phoneme = 'a' | 'e' | 'i' | 'o' | 'u' | 'neutral';

// Avatar props
export interface AvatarProps {
  theme: FaceTheme;
  shape: HeadShape;
  expression?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
  speaking?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
  text?: string;
}

// Add a type for the render props
export interface AvatarRenderProps extends AvatarProps {
  phoneme?: string;
  blinking?: boolean;
}

// Animation types
export interface AnimationProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Export phoneme definitions
export const phonemes: Record<string, PhonemeShape> = {
  // Vowels
  'A': { width: 50, height: 35, borderRadius: '40%', tongueWidth: 28, tongueHeight: 14, tongueBottom: -4, teethTopY: -12, teethBottomY: 12, teethWidth: '120%' },
  'E': { width: 65, height: 25, borderRadius: '15px', tongueWidth: 35, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '125%' },
  'I': { width: 40, height: 20, borderRadius: '15px', tongueWidth: 20, tongueHeight: 8, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'O': { width: 40, height: 40, borderRadius: '50%', tongueWidth: 22, tongueHeight: 16, tongueBottom: -2, teethTopY: -14, teethBottomY: 14, teethWidth: '115%' },
  'U': { width: 35, height: 35, borderRadius: '50%', tongueWidth: 18, tongueHeight: 14, tongueBottom: -2, teethTopY: -12, teethBottomY: 12, teethWidth: '110%' },
  // Consonants
  'M': { width: 55, height: 10, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -4, teethBottomY: 4, teethWidth: '110%' },
  'B': { width: 55, height: 10, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -4, teethBottomY: 4, teethWidth: '110%' },
  'P': { width: 55, height: 10, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -4, teethBottomY: 4, teethWidth: '110%' },
  'F': { width: 55, height: 20, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
  'V': { width: 55, height: 20, borderRadius: '5px', tongueWidth: 0, tongueHeight: 0, tongueBottom: 0, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
  'L': { width: 50, height: 25, borderRadius: '15px', tongueWidth: 30, tongueHeight: 20, tongueBottom: -8, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'T': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'D': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'S': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'Z': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'N': { width: 50, height: 15, borderRadius: '10px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -6, teethTopY: -6, teethBottomY: 6, teethWidth: '115%' },
  'R': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'K': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -8, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'G': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -8, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'rest': { width: 30, height: 10, borderRadius: '5px', tongueWidth: 20, tongueHeight: 6, tongueBottom: -4, teethTopY: -4, teethBottomY: 4, teethWidth: '105%' }
};

// Export expression definitions
export const expressions: Record<Expression, PhonemeShape> = {
  'neutral': { width: 60, height: 25, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '110%' },
  'happy': { width: 70, height: 35, borderRadius: '15px 15px 40px 40px', tongueWidth: 35, tongueHeight: 16, tongueBottom: -2, teethTopY: -10, teethBottomY: 10, teethWidth: '115%' },
  'sad': { width: 65, height: 30, borderRadius: '40px 40px 15px 15px', tongueWidth: 25, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
  'surprised': { width: 45, height: 45, borderRadius: '50%', tongueWidth: 25, tongueHeight: 18, tongueBottom: 0, teethTopY: -14, teethBottomY: 14, teethWidth: '110%' },
  'angry': { width: 60, height: 25, borderRadius: '5px', tongueWidth: 30, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
  'thinking': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '110%' }
};

export interface AvatarState {
  theme: FaceTheme;
  shape: HeadShape;
  expression: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
  speaking: boolean;
  text: string;
}

export interface AvatarContextType {
  state: AvatarState;
  setTheme: (theme: FaceTheme) => void;
  setShape: (shape: HeadShape) => void;
  setExpression: (expression: AvatarState['expression']) => void;
  setSpeaking: (speaking: boolean) => void;
  setText: (text: string) => void;
} 