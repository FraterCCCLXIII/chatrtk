import React from 'react';
import type { AvatarProps, FaceTheme, HeadShape } from '@/types/avatar';
import { AvatarRenderer } from '../base/AvatarRenderer';
import '@/ui/styles/avatar.css';

// Default theme
const defaultTheme: FaceTheme = {
  id: 'default',
  name: 'Minty',
  description: 'The classic mint green face',
  previewColor: '#5ddbaf',
  screenColor: '#e2ffe5',
  faceColor: '#5daa77',
  mouthColor: '#5daa77',
  borderColor: '#333333',
  textColor: '#333333',
  backgroundColor: '#e2ffe5',
  tongueColor: '#ff7d9d',
  eyeColor: '#000000',
  strokeColor: '#333333',
  showStroke: true
};

export interface AvatarSpeakingProps extends Omit<AvatarProps, 'theme' | 'shape'> {
  text?: string;
  speaking?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
  theme?: FaceTheme;
  shape?: HeadShape;
}

export const AvatarSpeaking: React.FC<AvatarSpeakingProps> = ({
  text = '',
  speaking = false,
  onSpeakingChange,
  expression = 'neutral',
  theme = defaultTheme,
  shape = 'circle',
  ...props
}) => {
  return (
    <div className="avatar-speaking">
      <div className="face-container">
        <AvatarRenderer
          text={text}
          speaking={speaking}
          onSpeakingChange={onSpeakingChange}
          expression={expression}
          theme={theme}
          shape={shape}
          {...props}
        />
      </div>
      {text && <div className="message">{text}</div>}
    </div>
  );
};

export default AvatarSpeaking; 