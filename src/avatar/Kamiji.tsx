import React, { useState, useEffect } from 'react';
import { AvatarRenderer } from '@/core/rig/base/AvatarRenderer';
import { getMouthShape, getEyeState } from '@/core/rig/utils/rigUtils';
import { Expression, Phoneme } from '@/types/avatar';
import './Kamiji.css';

const Kamiji: React.FC = () => {
  const [phoneme, setPhoneme] = useState<Phoneme>('neutral');
  const [blinking, setBlinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [expression, setExpression] = useState<Expression>(Expression.Neutral);

  useEffect(() => {
    let phonemeInterval: NodeJS.Timeout;
    let blinkInterval: NodeJS.Timeout;

    if (speaking) {
      const phonemes: Phoneme[] = ['a', 'e', 'i', 'o', 'u', 'neutral'];
      phonemeInterval = setInterval(() => {
        setPhoneme(phonemes[Math.floor(Math.random() * phonemes.length)]);
      }, 200);

      blinkInterval = setInterval(() => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 150);
      }, 3000);
    }

    return () => {
      clearInterval(phonemeInterval);
      clearInterval(blinkInterval);
    };
  }, [speaking]);

  return (
    <div className="kamiji-container">
      <div className="kamiji-avatar">
        <AvatarRenderer
          phoneme={phoneme}
          blinking={blinking}
          expression={expression}
          speaking={speaking}
          text={speaking ? 'Hello, I am Kamiji!' : ''}
          theme={{
            id: 'kamiji',
            name: 'Kamiji',
            description: 'A friendly and expressive avatar',
            faceColor: '#f0f9ff',
            eyeColor: '#1e40af',
            mouthColor: '#1e40af',
            borderColor: '#bfdbfe',
            textColor: '#1e40af',
            backgroundColor: '#ffffff',
            previewColor: '#e0f2fe',
            screenColor: '#dbeafe',
            tongueColor: '#93c5fd',
            strokeColor: '#3b82f6',
            showStroke: true,
          }}
          shape="circle"
        />
      </div>
      <div className="kamiji-controls">
        <button
          className={`kamiji-button ${speaking ? 'active' : ''}`}
          onClick={() => setSpeaking(!speaking)}
        >
          {speaking ? 'Stop Speaking' : 'Start Speaking'}
        </button>
        <div className="kamiji-expressions">
          {Object.values(Expression).map((expr) => (
            <button
              key={expr}
              className={`kamiji-button ${expression === expr ? 'active' : ''}`}
              onClick={() => setExpression(expr as Expression)}
            >
              {expr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Kamiji; 