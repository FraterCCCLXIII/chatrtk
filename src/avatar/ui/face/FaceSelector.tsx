import React from 'react';
import { Smile } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ModalWrapper from '@/components/ui/modal-wrapper';
import { FaceTheme } from '@/types/face';

export interface FaceSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFace: (faceTheme: FaceTheme) => void;
  currentFaceTheme: string;
}

const FaceSelector: React.FC<FaceSelectorProps> = ({
  open,
  onOpenChange,
  onSelectFace,
  currentFaceTheme,
}) => {
  const { currentLanguage } = useLanguage();

  const themes: FaceTheme[] = [
    {
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
    },
    // Add more themes here
  ];

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={getTranslation('faceSelector', currentLanguage)}
      icon={<Smile className="h-6 w-6" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              currentFaceTheme === theme.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectFace(theme)}
          >
            <CardHeader>
              <CardTitle>{theme.name}</CardTitle>
              <CardDescription>{theme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="w-full aspect-square rounded-lg"
                style={{ backgroundColor: theme.previewColor }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default FaceSelector; 