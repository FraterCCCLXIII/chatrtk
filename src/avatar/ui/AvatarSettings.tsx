import React from 'react';
import { useAvatar } from '@/core/contexts/AvatarContext';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { FaceTheme, HeadShape } from '@/types/avatar';

// Available themes
const themes: FaceTheme[] = [
  {
    id: 'minty',
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
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and pink tones',
    previewColor: '#ff9f5a',
    screenColor: '#fff5e6',
    faceColor: '#ff7d5a',
    mouthColor: '#ff7d5a',
    borderColor: '#333333',
    textColor: '#333333',
    backgroundColor: '#fff5e6',
    tongueColor: '#ff5a7d',
    eyeColor: '#000000',
    strokeColor: '#333333',
    showStroke: true
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue tones',
    previewColor: '#5a9fff',
    screenColor: '#e6f0ff',
    faceColor: '#5a7dff',
    mouthColor: '#5a7dff',
    borderColor: '#333333',
    textColor: '#333333',
    backgroundColor: '#e6f0ff',
    tongueColor: '#ff5a9f',
    eyeColor: '#000000',
    strokeColor: '#333333',
    showStroke: true
  }
];

// Available head shapes
const headShapes: HeadShape[] = ['circle', 'square', 'triangle'];

export const AvatarSettings: React.FC = () => {
  const { state, setTheme, setShape } = useAvatar();

  return (
    <Card className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(theme => (
            <Button
              key={theme.id}
              variant={state.theme.id === theme.id ? 'default' : 'outline'}
              className="flex flex-col items-center p-2 h-auto"
              onClick={() => setTheme(theme)}
            >
              <div
                className="w-8 h-8 rounded-full mb-1"
                style={{ backgroundColor: theme.previewColor }}
              />
              <span className="text-xs">{theme.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Head Shape</h3>
        <div className="grid grid-cols-3 gap-2">
          {headShapes.map(shape => (
            <Button
              key={shape}
              variant={state.shape === shape ? 'default' : 'outline'}
              className="flex flex-col items-center p-2 h-auto"
              onClick={() => setShape(shape)}
            >
              <div className="w-8 h-8 mb-1 flex items-center justify-center">
                {shape === 'circle' && (
                  <div className="w-6 h-6 rounded-full border-2 border-current" />
                )}
                {shape === 'square' && (
                  <div className="w-6 h-6 border-2 border-current" />
                )}
                {shape === 'triangle' && (
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-transparent border-b-current" />
                )}
              </div>
              <span className="text-xs capitalize">{shape}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AvatarSettings; 