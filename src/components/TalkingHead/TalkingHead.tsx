
import React, { useEffect, useRef, useState } from 'react';
import './TalkingHead.css';
import { FaceTheme } from '../FaceSelectorModal/FaceSelectorModal';

interface TalkingHeadProps {
  text?: string;
  speaking?: boolean;
  expression?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
  theme?: FaceTheme;
}

const TalkingHead: React.FC<TalkingHeadProps> = ({
  text = '',
  speaking = false,
  expression = 'neutral',
  theme
}) => {
  const [currentPhoneme, setCurrentPhoneme] = useState('rest');
  const [currentExpression, setCurrentExpression] = useState(expression);
  const speakingRef = useRef(false);
  const phonemeIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Default theme
  const defaultTheme: FaceTheme = {
    id: 'default',
    name: 'Minty',
    description: 'The classic mint green face',
    previewColor: '#5ddbaf',
    screenColor: '#e2ffe5',
    faceColor: '#5daa77',
    tongueColor: '#ff7d9d',
  };

  const currentTheme = theme || defaultTheme;

  // Phoneme definitions with mouth shapes
  const phonemes = {
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

  // Expressions with emotional states
  const expressions = {
    'neutral': { width: 60, height: 25, borderRadius: '15px', tongueWidth: 30, tongueHeight: 12, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '110%' },
    'happy': { width: 70, height: 35, borderRadius: '15px 15px 40px 40px', tongueWidth: 35, tongueHeight: 16, tongueBottom: -2, teethTopY: -10, teethBottomY: 10, teethWidth: '115%' },
    'sad': { width: 65, height: 30, borderRadius: '40px 40px 15px 15px', tongueWidth: 25, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '115%' },
    'surprised': { width: 45, height: 45, borderRadius: '50%', tongueWidth: 25, tongueHeight: 18, tongueBottom: 0, teethTopY: -14, teethBottomY: 14, teethWidth: '110%' },
    'angry': { width: 60, height: 25, borderRadius: '5px', tongueWidth: 30, tongueHeight: 10, tongueBottom: -6, teethTopY: -8, teethBottomY: 8, teethWidth: '120%' },
    'thinking': { width: 50, height: 20, borderRadius: '15px', tongueWidth: 25, tongueHeight: 8, tongueBottom: -4, teethTopY: -6, teethBottomY: 6, teethWidth: '110%' }
  };

  // Convert text to simple phonemes
  const convertTextToPhonemes = (text: string): string[] => {
    const phonemeArray: string[] = [];
    const upperText = text.toUpperCase();
    
    for (let i = 0; i < upperText.length; i++) {
      const char = upperText[i];
      if ('AEIOU'.includes(char)) {
        phonemeArray.push(char);
      } else if ('BCDFGHJKLMNPQRSTVWXYZ'.includes(char)) {
        phonemeArray.push(char);
      } else if (['.', ',', '!', '?'].includes(char)) {
        phonemeArray.push('rest');
      } else {
        phonemeArray.push('rest');
      }
    }
    
    return phonemeArray;
  };

  // Stop speaking animation
  const stopSpeaking = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    speakingRef.current = false;
    setCurrentPhoneme('rest');
  };

  // Start speaking animation
  const startSpeaking = (textToSpeak: string) => {
    if (speakingRef.current) {
      stopSpeaking();
    }
    
    speakingRef.current = true;
    const phonemeArray = convertTextToPhonemes(textToSpeak);
    phonemeIndexRef.current = 0;
    
    timerRef.current = window.setInterval(() => {
      if (phonemeIndexRef.current >= phonemeArray.length) {
        stopSpeaking();
        return;
      }
      
      setCurrentPhoneme(phonemeArray[phonemeIndexRef.current]);
      phonemeIndexRef.current++;
    }, 100); // Adjust timing as needed
  };

  // Update speaking state when props change
  useEffect(() => {
    setCurrentExpression(expression);
    
    if (speaking && text) {
      startSpeaking(text);
    } else {
      stopSpeaking();
    }
    
    return () => {
      stopSpeaking();
    };
  }, [speaking, text, expression]);

  // Get current mouth shape based on phoneme or expression
  const getCurrentShape = () => {
    if (speakingRef.current && phonemes[currentPhoneme]) {
      return phonemes[currentPhoneme];
    }
    return expressions[currentExpression];
  };
  
  const shape = getCurrentShape();

  return (
    <div className="talking-head">
      <div className="face-container">
        <div 
          className="screen"
          style={{ backgroundColor: currentTheme.screenColor }}
        >
          <div className="face">
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="mouth-container">
              <div 
                className="mouth"
                style={{ 
                  width: `${shape.width}px`, 
                  height: `${shape.height}px`, 
                  borderRadius: shape.borderRadius,
                  backgroundColor: currentTheme.faceColor
                }}
              >
                <div className="mouth-inner">
                  <div 
                    className="teeth-top"
                    style={{ 
                      '--teeth-width': shape.teethWidth,
                      '--teeth-top-y': `${shape.teethTopY}px`
                    } as React.CSSProperties}
                  ></div>
                  <div 
                    className="tongue"
                    style={{
                      '--tongue-width': `${shape.tongueWidth}px`,
                      '--tongue-height': `${shape.tongueHeight}px`,
                      '--tongue-bottom': `${shape.tongueBottom}px`,
                      backgroundColor: currentTheme.tongueColor
                    } as React.CSSProperties}
                  ></div>
                  <div 
                    className="teeth-bottom"
                    style={{ 
                      '--teeth-width': shape.teethWidth,
                      '--teeth-bottom-y': `${shape.teethBottomY}px` 
                    } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {text && (
          <div className="message" style={{ opacity: speaking ? 1 : 0 }}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

export default TalkingHead;
