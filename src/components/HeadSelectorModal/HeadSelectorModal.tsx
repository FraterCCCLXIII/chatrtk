import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import TalkingHead from '../TalkingHead/TalkingHead';
import { HeadShape } from '../FacialRigEditor/FacialRigEditor';

// Define the head themes
export interface HeadTheme {
  id: string;
  name: string;
  description: string;
  headShape: HeadShape;
  previewColor: string;
  screenColor: string;
  faceColor: string;
  tongueColor: string;
}

const headThemes: HeadTheme[] = [
  {
    id: 'default',
    name: 'Classic',
    description: 'The original talking head',
    headShape: { id: 'circle', shape: 'circle', width: 100, height: 100 },
    previewColor: '#f0f0f0',
    screenColor: '#e0e0e0',
    faceColor: '#ffcc80',
    tongueColor: '#ff6b6b'
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    description: 'A cool blue theme',
    headShape: { id: 'circle', shape: 'circle', width: 100, height: 100 },
    previewColor: '#e6f2ff',
    screenColor: '#f0e6ff',
    faceColor: '#8a2be2',
    tongueColor: '#ff69b4'
  },
  {
    id: 'sunshine',
    name: 'Sunshine',
    description: 'A bright and cheerful yellow theme',
    headShape: { id: 'circle', shape: 'circle', width: 100, height: 100 },
    previewColor: '#fffaeb',
    screenColor: '#fff8e1',
    faceColor: '#ffd54f',
    tongueColor: '#ff7043'
  },
  {
    id: 'mint-chocolate',
    name: 'Mint Chocolate',
    description: 'A refreshing mint with chocolate accents',
    headShape: { id: 'circle', shape: 'circle', width: 100, height: 100 },
    previewColor: '#e8f5e9',
    screenColor: '#c8e6c9',
    faceColor: '#66bb6a',
    tongueColor: '#5d4037'
  }
];

interface HeadSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectHead: (theme: HeadTheme) => void;
}

export function HeadSelectorModal({ 
  open, 
  onOpenChange,
  onSelectHead
}: HeadSelectorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Select Animated Head</DialogTitle>
          <DialogDescription>
            Choose a head style to customize your talking head experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 py-4">
          {headThemes.map((theme) => (
            <div 
              key={theme.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => {
                onSelectHead(theme);
                onOpenChange(false);
              }}
            >
              <h3 className="text-lg font-medium mb-1">{theme.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{theme.description}</p>
              <div 
                className="w-full h-40 flex items-center justify-center rounded-md"
                style={{ backgroundColor: theme.previewColor }}
              >
                <div className="w-32 h-32">
                  <TalkingHead 
                    theme={{
                      id: theme.id,
                      name: theme.name,
                      description: theme.description,
                      previewColor: theme.previewColor,
                      screenColor: theme.screenColor,
                      faceColor: theme.faceColor,
                      tongueColor: theme.tongueColor,
                    }}
                    headShape={theme.headShape}
                    expression="neutral"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}