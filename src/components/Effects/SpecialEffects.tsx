import React from 'react';
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import ModalWrapper from '@/components/ui/modal-wrapper';

interface SpecialEffectsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animationIntensity: number;
  onAnimationIntensityChange: (value: number) => void;
  zoomIntensity: number;
  onZoomIntensityChange: (value: number) => void;
}

const SpecialEffects: React.FC<SpecialEffectsProps> = ({
  open,
  onOpenChange,
  animationIntensity,
  onAnimationIntensityChange,
  zoomIntensity,
  onZoomIntensityChange,
}) => {
  const { currentLanguage } = useLanguage();

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={getTranslation('specialEffects', currentLanguage)}
      icon={<Sparkles className="h-6 w-6" />}
    >
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{getTranslation('animationIntensity', currentLanguage)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>{getTranslation('animationIntensityDescription', currentLanguage)}</Label>
              <Slider
                value={[animationIntensity]}
                onValueChange={(value) => onAnimationIntensityChange(value[0])}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{getTranslation('zoomIntensity', currentLanguage)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>{getTranslation('zoomIntensityDescription', currentLanguage)}</Label>
              <Slider
                value={[zoomIntensity]}
                onValueChange={(value) => onZoomIntensityChange(value[0])}
                min={0}
                max={2}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ModalWrapper>
  );
};

export default SpecialEffects; 