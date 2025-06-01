import React, { useEffect, useRef, useState } from 'react';
import './TalkingHead.css';
import { FaceTheme } from '@/types/face';
import { HeadShape, FaceRigConfig } from '../FacialRigEditor';
import { useFloatingAnimation, AnimatedDiv } from '../animations';

interface TalkingHeadProps {
  text?: string;
  speaking?: boolean;
  expression?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
  theme?: FaceTheme;
  headShape?: HeadShape;
  config?: FaceRigConfig;
  animatedTheme?: string;
}

const TalkingHead: React.FC<TalkingHeadProps> = ({
  text = '',
  speaking = false,
  expression = 'neutral',
  theme,
  headShape,
  config,
  animatedTheme = 'rtk-100'
}) => {
  const [currentPhoneme, setCurrentPhoneme] = useState('rest');
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [isBlinking, setIsBlinking] = useState(false);
  const speakingRef = useRef(false);
  const phonemeIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const blinkTimerRef = useRef<number | null>(null);

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
  
  // Default head shape
  const defaultHeadShape: HeadShape = {
    id: 'rectangle',
    name: 'Rectangle',
    shape: 'rectangle',
  };

  const currentTheme = theme || defaultTheme;
  const currentHeadShape = headShape || defaultHeadShape;

  // Ensure theme properties are properly set
  const effectiveTheme = {
    ...currentTheme,
    eyeColor: currentTheme.eyeColor || '#000000',
    strokeColor: currentTheme.strokeColor || '#333333',
    showStroke: currentTheme.showStroke !== false
  };

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
  const floatingAnimation = useFloatingAnimation();

  // Function to trigger a blink
  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 300); // Match the animation duration
  };

  // Set up periodic blinking
  useEffect(() => {
    const startBlinking = () => {
      // Clear any existing blink timer
      if (blinkTimerRef.current) {
        window.clearTimeout(blinkTimerRef.current);
      }

      // Function to schedule next blink
      const scheduleNextBlink = () => {
        // Random time between 2 and 4 seconds
        const nextBlinkTime = Math.random() * 2000 + 2000;
        blinkTimerRef.current = window.setTimeout(() => {
          triggerBlink();
          scheduleNextBlink();
        }, nextBlinkTime);
      };

      // Start the blinking cycle
      scheduleNextBlink();
    };

    startBlinking();

    // Cleanup
    return () => {
      if (blinkTimerRef.current) {
        window.clearTimeout(blinkTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={`talking-head ${isBlinking ? 'blinking' : ''}`}>
      <AnimatedDiv 
        className="face-container"
        style={{
          ...floatingAnimation
        }}>
        {currentHeadShape.shape !== 'none' ? (
        <div 
          className={`screen ${currentHeadShape.shape}`}
          style={{ 
              backgroundColor: config?.head?.fillColor || effectiveTheme.screenColor,
            borderRadius: config?.head?.borderRadius || 
                         (currentHeadShape.shape === 'circle' ? '50%' : 
                           currentHeadShape.shape === 'square' ? '20px' :
                           currentHeadShape.shape === 'rectangle' ? '30px' : '0'),
              border: effectiveTheme.showStroke ? 
                     `${config?.head?.strokeWidth || 8}px solid ${config?.head?.strokeColor || effectiveTheme.strokeColor}` : 
                     'none',
              boxShadow: effectiveTheme.showStroke ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          <div 
            className="face"
            style={{
                backgroundColor: config?.head?.fillColor || effectiveTheme.screenColor,
                border: effectiveTheme.showStroke && config?.head?.strokeWidth ? 
                       `${config.head.strokeWidth}px solid ${config.head.strokeColor || effectiveTheme.strokeColor}` : 
                       'none',
                borderRadius: config?.head?.borderRadius || 'inherit'
              }}>
              <div className="eye-container left">
                <div 
                  className="eye left"
                  style={{
                    width: `${config?.leftEye?.width || 12}px`,
                    height: `${config?.leftEye?.height || 12}px`,
                    backgroundColor: config?.leftEye?.fillColor || effectiveTheme.eyeColor,
                    border: config?.leftEye?.strokeWidth ? `${config.leftEye.strokeWidth}px solid ${config.leftEye.strokeColor}` : 'none',
                    borderRadius: config?.leftEye?.borderRadius || '50%',
                    transform: config?.leftEye?.rotation ? `rotate(${config.leftEye.rotation}deg)` : 'none',
                    opacity: config?.leftEye?.opacity !== undefined ? config.leftEye.opacity : 1
                  }}
                ></div>
                <div 
                  className="eyelid top left"
                  style={{
                    width: `${config?.leftTopEyelid?.width || 14}px`,
                    height: `${config?.leftTopEyelid?.height || 6}px`,
                    backgroundColor: config?.leftTopEyelid?.fillColor || '#333333',
                    border: config?.leftTopEyelid?.strokeWidth ? `${config.leftTopEyelid.strokeWidth}px solid ${config.leftTopEyelid.strokeColor}` : 'none',
                    borderRadius: config?.leftTopEyelid?.borderRadius || '50% 50% 0 0',
                    transform: config?.leftTopEyelid?.rotation ? `rotate(${config.leftTopEyelid.rotation}deg)` : 'none',
                    opacity: config?.leftTopEyelid?.opacity !== undefined ? config.leftTopEyelid.opacity : 0
                  }}
                ></div>
                <div 
                  className="eyelid bottom left"
                  style={{
                    width: `${config?.leftBottomEyelid?.width || 14}px`,
                    height: `${config?.leftBottomEyelid?.height || 6}px`,
                    backgroundColor: config?.leftBottomEyelid?.fillColor || '#333333',
                    border: config?.leftBottomEyelid?.strokeWidth ? `${config.leftBottomEyelid.strokeWidth}px solid ${config.leftBottomEyelid.strokeColor}` : 'none',
                    borderRadius: config?.leftBottomEyelid?.borderRadius || '0 0 50% 50%',
                    transform: config?.leftBottomEyelid?.rotation ? `rotate(${config.leftBottomEyelid.rotation}deg)` : 'none',
                    opacity: config?.leftBottomEyelid?.opacity !== undefined ? config.leftBottomEyelid.opacity : 0
                  }}
                ></div>
              </div>
              <div className="eye-container right">
                <div 
                  className="eye right"
                  style={{
                    width: `${config?.rightEye?.width || 12}px`,
                    height: `${config?.rightEye?.height || 12}px`,
                    backgroundColor: config?.rightEye?.fillColor || effectiveTheme.eyeColor,
                    border: config?.rightEye?.strokeWidth ? `${config.rightEye.strokeWidth}px solid ${config.rightEye.strokeColor}` : 'none',
                    borderRadius: config?.rightEye?.borderRadius || '50%',
                    transform: config?.rightEye?.rotation ? `rotate(${config.rightEye.rotation}deg)` : 'none',
                    opacity: config?.rightEye?.opacity !== undefined ? config.rightEye.opacity : 1
                  }}
                ></div>
                <div 
                  className="eyelid top right"
                  style={{
                    width: `${config?.rightTopEyelid?.width || 14}px`,
                    height: `${config?.rightTopEyelid?.height || 6}px`,
                    backgroundColor: config?.rightTopEyelid?.fillColor || '#333333',
                    border: config?.rightTopEyelid?.strokeWidth ? `${config.rightTopEyelid.strokeWidth}px solid ${config.rightTopEyelid.strokeColor}` : 'none',
                    borderRadius: config?.rightTopEyelid?.borderRadius || '50% 50% 0 0',
                    transform: config?.rightTopEyelid?.rotation ? `rotate(${config.rightTopEyelid.rotation}deg)` : 'none',
                    opacity: config?.rightTopEyelid?.opacity !== undefined ? config.rightTopEyelid.opacity : 0
                  }}
                ></div>
                <div 
                  className="eyelid bottom right"
                  style={{
                    width: `${config?.rightBottomEyelid?.width || 14}px`,
                    height: `${config?.rightBottomEyelid?.height || 6}px`,
                    backgroundColor: config?.rightBottomEyelid?.fillColor || '#333333',
                    border: config?.rightBottomEyelid?.strokeWidth ? `${config.rightBottomEyelid.strokeWidth}px solid ${config.rightBottomEyelid.strokeColor}` : 'none',
                    borderRadius: config?.rightBottomEyelid?.borderRadius || '0 0 50% 50%',
                    transform: config?.rightBottomEyelid?.rotation ? `rotate(${config.rightBottomEyelid.rotation}deg)` : 'none',
                    opacity: config?.rightBottomEyelid?.opacity !== undefined ? config.rightBottomEyelid.opacity : 0
                  }}
                ></div>
              </div>
              <div className="mouth-container">
                <div 
                  className="mouth"
                  style={{ 
                    width: `${shape.width}px`, 
                    height: `${shape.height}px`, 
                    borderRadius: config?.mouth?.borderRadius || shape.borderRadius,
                    backgroundColor: config?.mouth?.fillColor || effectiveTheme.faceColor,
                    border: config?.mouth?.strokeWidth ? `${config.mouth.strokeWidth}px solid ${config.mouth.strokeColor}` : 'none'
                  }}
                >
                  <div className="mouth-inner">
                    <div 
                      className="teeth-top"
                      style={{ 
                        '--teeth-width': shape.teethWidth,
                        '--teeth-top-y': `${shape.teethTopY}px`,
                        backgroundColor: config?.topTeeth?.fillColor || 'white',
                        border: config?.topTeeth?.strokeWidth ? `${config.topTeeth.strokeWidth}px solid ${config.topTeeth.strokeColor}` : '1px solid #ddd'
                      } as React.CSSProperties}
                    ></div>
                    <div 
                      className="tongue"
                      style={{
                        '--tongue-width': `${shape.tongueWidth}px`,
                        '--tongue-height': `${shape.tongueHeight}px`,
                        '--tongue-bottom': `${shape.tongueBottom}px`,
                        backgroundColor: config?.tongue?.fillColor || effectiveTheme.tongueColor,
                        border: config?.tongue?.strokeWidth ? `${config.tongue.strokeWidth}px solid ${config.tongue.strokeColor}` : 'none',
                        borderRadius: config?.tongue?.borderRadius || '15px 15px 5px 5px'
                      } as React.CSSProperties}
                    ></div>
                    <div 
                      className="teeth-bottom"
                      style={{ 
                        '--teeth-width': shape.teethWidth,
                        '--teeth-bottom-y': `${shape.teethBottomY}px`,
                        backgroundColor: config?.bottomTeeth?.fillColor || 'white',
                        border: config?.bottomTeeth?.strokeWidth ? `${config.bottomTeeth.strokeWidth}px solid ${config.bottomTeeth.strokeColor}` : '1px solid #ddd'
                      } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="face" style={{ backgroundColor: 'transparent' }}>
            <div className="eye-container left">
              <div 
                className="eye left"
                style={{
                  width: `${config?.leftEye?.width || 12}px`,
                  height: `${config?.leftEye?.height || 12}px`,
                  backgroundColor: config?.leftEye?.fillColor || effectiveTheme.eyeColor,
                  border: config?.leftEye?.strokeWidth ? `${config.leftEye.strokeWidth}px solid ${config.leftEye.strokeColor}` : 'none',
                  borderRadius: config?.leftEye?.borderRadius || '50%',
                  transform: config?.leftEye?.rotation ? `rotate(${config.leftEye.rotation}deg)` : 'none',
                  opacity: config?.leftEye?.opacity !== undefined ? config.leftEye.opacity : 1
                }}
              ></div>
              <div 
                className="eyelid top left"
                style={{
                  width: `${config?.leftTopEyelid?.width || 14}px`,
                  height: `${config?.leftTopEyelid?.height || 6}px`,
                  backgroundColor: config?.leftTopEyelid?.fillColor || '#333333',
                  border: config?.leftTopEyelid?.strokeWidth ? `${config.leftTopEyelid.strokeWidth}px solid ${config.leftTopEyelid.strokeColor}` : 'none',
                  borderRadius: config?.leftTopEyelid?.borderRadius || '50% 50% 0 0',
                  transform: config?.leftTopEyelid?.rotation ? `rotate(${config.leftTopEyelid.rotation}deg)` : 'none',
                  opacity: config?.leftTopEyelid?.opacity !== undefined ? config.leftTopEyelid.opacity : 0
                }}
              ></div>
              <div 
                className="eyelid bottom left"
                style={{
                  width: `${config?.leftBottomEyelid?.width || 14}px`,
                  height: `${config?.leftBottomEyelid?.height || 6}px`,
                  backgroundColor: config?.leftBottomEyelid?.fillColor || '#333333',
                  border: config?.leftBottomEyelid?.strokeWidth ? `${config.leftBottomEyelid.strokeWidth}px solid ${config.leftBottomEyelid.strokeColor}` : 'none',
                  borderRadius: config?.leftBottomEyelid?.borderRadius || '0 0 50% 50%',
                  transform: config?.leftBottomEyelid?.rotation ? `rotate(${config.leftBottomEyelid.rotation}deg)` : 'none',
                  opacity: config?.leftBottomEyelid?.opacity !== undefined ? config.leftBottomEyelid.opacity : 0
                }}
              ></div>
            </div>
            <div className="eye-container right">
              <div 
                className="eye right"
                style={{
                  width: `${config?.rightEye?.width || 12}px`,
                  height: `${config?.rightEye?.height || 12}px`,
                  backgroundColor: config?.rightEye?.fillColor || effectiveTheme.eyeColor,
                  border: config?.rightEye?.strokeWidth ? `${config.rightEye.strokeWidth}px solid ${config.rightEye.strokeColor}` : 'none',
                  borderRadius: config?.rightEye?.borderRadius || '50%',
                  transform: config?.rightEye?.rotation ? `rotate(${config.rightEye.rotation}deg)` : 'none',
                  opacity: config?.rightEye?.opacity !== undefined ? config.rightEye.opacity : 1
                }}
              ></div>
              <div 
                className="eyelid top right"
                style={{
                  width: `${config?.rightTopEyelid?.width || 14}px`,
                  height: `${config?.rightTopEyelid?.height || 6}px`,
                  backgroundColor: config?.rightTopEyelid?.fillColor || '#333333',
                  border: config?.rightTopEyelid?.strokeWidth ? `${config.rightTopEyelid.strokeWidth}px solid ${config.rightTopEyelid.strokeColor}` : 'none',
                  borderRadius: config?.rightTopEyelid?.borderRadius || '50% 50% 0 0',
                  transform: config?.rightTopEyelid?.rotation ? `rotate(${config.rightTopEyelid.rotation}deg)` : 'none',
                  opacity: config?.rightTopEyelid?.opacity !== undefined ? config.rightTopEyelid.opacity : 0
                }}
              ></div>
              <div 
                className="eyelid bottom right"
                style={{
                  width: `${config?.rightBottomEyelid?.width || 14}px`,
                  height: `${config?.rightBottomEyelid?.height || 6}px`,
                  backgroundColor: config?.rightBottomEyelid?.fillColor || '#333333',
                  border: config?.rightBottomEyelid?.strokeWidth ? `${config.rightBottomEyelid.strokeWidth}px solid ${config.rightBottomEyelid.strokeColor}` : 'none',
                  borderRadius: config?.rightBottomEyelid?.borderRadius || '0 0 50% 50%',
                  transform: config?.rightBottomEyelid?.rotation ? `rotate(${config.rightBottomEyelid.rotation}deg)` : 'none',
                  opacity: config?.rightBottomEyelid?.opacity !== undefined ? config.rightBottomEyelid.opacity : 0
                }}
              ></div>
            </div>
            <div className="mouth-container">
              <div 
                className="mouth"
                style={{ 
                  width: `${shape.width}px`, 
                  height: `${shape.height}px`, 
                  borderRadius: config?.mouth?.borderRadius || shape.borderRadius,
                  backgroundColor: config?.mouth?.fillColor || effectiveTheme.faceColor,
                  border: config?.mouth?.strokeWidth ? `${config.mouth.strokeWidth}px solid ${config.mouth.strokeColor}` : 'none'
                }}
              >
                <div className="mouth-inner">
                  <div 
                    className="teeth-top"
                    style={{ 
                      '--teeth-width': shape.teethWidth,
                      '--teeth-top-y': `${shape.teethTopY}px`,
                      backgroundColor: config?.topTeeth?.fillColor || 'white',
                      border: config?.topTeeth?.strokeWidth ? `${config.topTeeth.strokeWidth}px solid ${config.topTeeth.strokeColor}` : '1px solid #ddd'
                    } as React.CSSProperties}
                  ></div>
                  <div 
                    className="tongue"
                    style={{
                      '--tongue-width': `${shape.tongueWidth}px`,
                      '--tongue-height': `${shape.tongueHeight}px`,
                      '--tongue-bottom': `${shape.tongueBottom}px`,
                      backgroundColor: config?.tongue?.fillColor || effectiveTheme.tongueColor,
                      border: config?.tongue?.strokeWidth ? `${config.tongue.strokeWidth}px solid ${config.tongue.strokeColor}` : 'none',
                      borderRadius: config?.tongue?.borderRadius || '15px 15px 5px 5px'
                    } as React.CSSProperties}
                  ></div>
                  <div 
                    className="teeth-bottom"
                    style={{ 
                      '--teeth-width': shape.teethWidth,
                      '--teeth-bottom-y': `${shape.teethBottomY}px`,
                      backgroundColor: config?.bottomTeeth?.fillColor || 'white',
                      border: config?.bottomTeeth?.strokeWidth ? `${config.bottomTeeth.strokeWidth}px solid ${config.bottomTeeth.strokeColor}` : '1px solid #ddd'
                    } as React.CSSProperties}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatedDiv>
    </div>
  );
};

export default TalkingHead;
