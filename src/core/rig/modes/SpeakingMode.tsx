import React, { useEffect, useState } from 'react';
import { AvatarProps } from '@/types/avatar';
import { RigRenderer } from '../base/RigRenderer';
import { useAvatar } from '@/core/contexts/AvatarContext';

interface SpeakingModeProps extends Omit<AvatarProps, 'speaking' | 'onSpeakingChange'> {
  onSpeakingChange?: (speaking: boolean) => void;
}

export const SpeakingMode: React.FC<SpeakingModeProps> = ({
  onSpeakingChange,
  ...props
}) => {
  const { state, setSpeaking } = useAvatar();
  const [phoneme, setPhoneme] = useState<string>('');
  const [blinking, setBlinking] = useState(false);

  // Handle speaking state changes
  useEffect(() => {
    if (state.speaking) {
      // Start speaking animation
      const speakInterval = setInterval(() => {
        // Generate random phoneme for demo
        const phonemes = ['a', 'e', 'i', 'o', 'u', 'm', 'p', 'b', 'f', 'v', 'th', 'l', 'r', 's', 'z'];
        const randomPhoneme = phonemes[Math.floor(Math.random() * phonemes.length)];
        setPhoneme(randomPhoneme);
      }, 100);

      // Handle blinking
      const blinkInterval = setInterval(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
      }, 3000);

      return () => {
        clearInterval(speakInterval);
        clearInterval(blinkInterval);
      };
    } else {
      setPhoneme('');
    }
  }, [state.speaking]);

  // Notify parent of speaking state changes
  useEffect(() => {
    onSpeakingChange?.(state.speaking);
  }, [state.speaking, onSpeakingChange]);

  return (
    <RigRenderer
      {...props}
      phoneme={phoneme}
      blinking={blinking}
      speaking={state.speaking}
      onSpeakingChange={setSpeaking}
    />
  );
};

export default SpeakingMode; 