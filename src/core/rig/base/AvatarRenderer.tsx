import React from 'react';
import { AvatarRenderProps } from '@/types/avatar';
import { useAvatar } from '@/core/contexts/AvatarContext';
import { getMouthShape } from '@/avatar/rig/mouth';
import { getEyeState } from '@/avatar/rig/eyes';

export interface AvatarRendererProps extends AvatarRenderProps {
  className?: string;
  style?: React.CSSProperties;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  phoneme,
  blinking,
  className,
  style,
  ...props
}) => {
  const { state } = useAvatar();
  const {
    theme,
    shape,
    expression,
    speaking,
    text
  } = state;

  // Determine the effective theme (use provided theme or fallback to state theme)
  const effectiveTheme = props.theme || theme;
  const effectiveShape = props.shape || shape;
  const effectiveExpression = props.expression || expression;
  const isSpeaking = props.speaking ?? speaking;
  const displayText = props.text || text;

  const mouthShape = getMouthShape(phoneme, isSpeaking);
  const eyeState = getEyeState(effectiveExpression, blinking);

  return (
    <div 
      className={`avatar-container ${effectiveShape} ${className || ''}`}
      style={{
        backgroundColor: effectiveTheme.screenColor,
        borderColor: effectiveTheme.strokeColor,
        borderWidth: effectiveTheme.showStroke ? '2px' : '0',
        borderStyle: 'solid',
        ...style
      }}
    >
      <div className="face">
        {/* Eyes */}
        <div 
          className={`eyes ${eyeState}`}
          style={{
            backgroundColor: effectiveTheme.eyeColor
          }}
        />
        
        {/* Mouth */}
        <div 
          className={`mouth ${mouthShape}`}
          style={{
            backgroundColor: effectiveTheme.faceColor,
            borderColor: effectiveTheme.strokeColor
          }}
        >
          {/* Tongue (only visible for certain mouth shapes) */}
          {['open', 'tongue'].includes(mouthShape) && (
            <div 
              className="tongue"
              style={{
                backgroundColor: effectiveTheme.tongueColor
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarRenderer; 