import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface FaceTheme {
  id: string;
  name: string;
  description: string;
  previewColor: string;
  screenColor: string;
  faceColor: string;
  tongueColor: string;
}

export interface FaceSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFace: (faceTheme: FaceTheme) => void;
  currentFaceTheme: string;
}

const FaceSelectorModal: React.FC<FaceSelectorModalProps> = ({
  open,
  onOpenChange,
  onSelectFace,
  currentFaceTheme,
}) => {
  const { toast } = useToast();

  // Face theme options
  const faceThemes: FaceTheme[] = [
    {
      id: 'default',
      name: 'Minty',
      description: 'The classic mint green face',
      previewColor: '#5ddbaf',
      screenColor: '#e2ffe5',
      faceColor: '#5daa77',
      tongueColor: '#ff7d9d',
    },
    {
      id: 'blueberry',
      name: 'Blueberry',
      description: 'A cool blue theme with a sweet personality',
      previewColor: '#5d9ddb',
      screenColor: '#e2f0ff',
      faceColor: '#5d7daa',
      tongueColor: '#ff9d7d',
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'A warm orange theme with a fiery attitude',
      previewColor: '#ff9d5d',
      screenColor: '#fff0e2',
      faceColor: '#e67d45',
      tongueColor: '#ff5d7d',
    },
    {
      id: 'bubblegum',
      name: 'Bubblegum',
      description: 'A playful pink theme with a sweet and bubbly personality',
      previewColor: '#ff7dc7',
      screenColor: '#ffe2f5',
      faceColor: '#e45daa',
      tongueColor: '#5ddbaf',
    },
    {
      id: 'lavender',
      name: 'Lavender',
      description: 'A calming purple theme with a dreamy personality',
      previewColor: '#9d7dff',
      screenColor: '#f0e2ff',
      faceColor: '#7d5daa',
      tongueColor: '#5ddbff',
    },
  ];

  const handleSelectTheme = (theme: FaceTheme) => {
    onSelectFace(theme);
    toast({
      title: "Theme Changed",
      description: `Successfully changed to ${theme.name} theme.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Choose a Theme</DialogTitle>
          <DialogDescription>
            Select a theme to personalize your chatty face.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {faceThemes.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg overflow-hidden ${
                currentFaceTheme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelectTheme(theme)}
            >
              <div className="relative">
                <div 
                  className="h-24 w-full rounded-lg"
                  style={{ backgroundColor: theme.previewColor }}
                />
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-50"
                  style={{ backgroundColor: theme.screenColor }}
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-sm">{theme.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaceSelectorModal;