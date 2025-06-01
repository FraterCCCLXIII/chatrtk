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
  /** Color of the tongue */
  tongueColor: string;
  /** Color of the eyes */
  eyeColor: string;
  /** Color of the face outline */
  strokeColor: string;
  /** Whether to show the face outline */
  showStroke: boolean;
}

/**
 * Represents the shape of the avatar's head
 */
export type HeadShape = 'circle' | 'square' | 'triangle';

/**
 * Represents the current expression of the avatar's face
 */
export interface FaceExpression {
  /** Mouth openness (0-1) */
  mouthOpen: number;
  /** Mouth width (0-1) */
  mouthWidth: number;
  /** Eye openness (0-1) */
  eyeOpen: number;
  /** Eyebrow height (-1 to 1) */
  eyebrowHeight: number;
  /** Eyebrow angle (-1 to 1) */
  eyebrowAngle: number;
}

/**
 * Represents the default/neutral expression
 */
export const defaultExpression: FaceExpression = {
  mouthOpen: 0,
  mouthWidth: 0.5,
  eyeOpen: 1,
  eyebrowHeight: 0,
  eyebrowAngle: 0,
}; 