import React, { useRef, useEffect } from 'react';
import { Sparkles, Pencil } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getTranslation } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffects } from '@/contexts/EffectsContext';
import './SpecialEffectsModal.css';

interface SpecialEffectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animationIntensity: number;
  onAnimationIntensityChange: (value: number) => void;
  zoomIntensity?: number;
  onZoomIntensityChange?: (value: number) => void;
}

const SpecialEffectsModal: React.FC<SpecialEffectsModalProps> = ({
  open,
  onOpenChange,
  animationIntensity,
  onAnimationIntensityChange,
  zoomIntensity = 1,
  onZoomIntensityChange = () => {},
}) => {
  const { currentLanguage } = useLanguage();
  const { state, toggleEffect, updatePencilConfig } = useEffects();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onOpenChange]);

  const handlePencilIntensityChange = (value: number) => {
    updatePencilConfig({
      intensity: value,
      scale: value * 2,
      baseFrequency: 0.02 / value
    });
  };

  const handlePencilSpeedChange = (value: number) => {
    updatePencilConfig({
      animationSpeed: value
    });
  };

  if (!open) return null;

  return (
    <div className="special-effects-dropdown" ref={dropdownRef}>
      <div className="dropdown-content">
        <div className="dropdown-header">
          <Sparkles className="h-5 w-5" />
          <h2>{getTranslation('specialEffects', currentLanguage)}</h2>
        </div>
        <div className="dropdown-body">
          <div className="slider-group">
            <div className="slider-header">
              <Label htmlFor="animation-intensity">
                {getTranslation('animationIntensity', currentLanguage)}
              </Label>
              <span className="intensity-label">
                {animationIntensity === 0 
                  ? getTranslation('off', currentLanguage)
                  : animationIntensity === 1 
                  ? getTranslation('max', currentLanguage)
                  : `${Math.round(animationIntensity * 100)}%`}
              </span>
            </div>
            <Slider
              id="animation-intensity"
              min={0}
              max={1}
              step={0.01}
              value={[animationIntensity]}
              onValueChange={([value]) => onAnimationIntensityChange(value)}
              className="slider-track"
            />
            <p className="intensity-description">
              {animationIntensity === 0 
                ? getTranslation('animationsDisabled', currentLanguage)
                : animationIntensity < 0.3 
                ? getTranslation('subtleAnimations', currentLanguage)
                : animationIntensity < 0.7 
                ? getTranslation('moderateAnimations', currentLanguage)
                : getTranslation('energeticAnimations', currentLanguage)}
            </p>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <Label htmlFor="zoom-intensity">
                {getTranslation('zoomIntensity', currentLanguage)}
              </Label>
              <span className="intensity-label">
                {zoomIntensity === 0 
                  ? getTranslation('off', currentLanguage)
                  : zoomIntensity === 1 
                  ? getTranslation('max', currentLanguage)
                  : `${Math.round(zoomIntensity * 100)}%`}
              </span>
            </div>
            <Slider
              id="zoom-intensity"
              min={0}
              max={1}
              step={0.01}
              value={[zoomIntensity]}
              onValueChange={([value]) => onZoomIntensityChange(value)}
              className="slider-track"
            />
            <p className="intensity-description">
              {zoomIntensity === 0 
                ? getTranslation('zoomDisabled', currentLanguage)
                : zoomIntensity < 0.3 
                ? getTranslation('subtleZoom', currentLanguage)
                : zoomIntensity < 0.7 
                ? getTranslation('mediumZoom', currentLanguage)
                : getTranslation('maxZoom', currentLanguage)}
            </p>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <button
                className={`effect-button ${state.activeEffect === 'pencil' ? 'active' : ''}`}
                onClick={() => toggleEffect('pencil')}
                title={getTranslation('pencilEffect', currentLanguage)}
              >
                <Pencil size={16} />
                {getTranslation('pencilEffect', currentLanguage)}
              </button>
            </div>

            {state.activeEffect === 'pencil' && (
              <>
                <div className="slider-header">
                  <Label htmlFor="pencil-intensity">
                    {getTranslation('effectIntensity', currentLanguage)}
                  </Label>
                  <span className="intensity-label">
                    {state.pencilConfig.intensity === 0.1 
                      ? getTranslation('off', currentLanguage)
                      : state.pencilConfig.intensity === 2 
                      ? getTranslation('max', currentLanguage)
                      : `${Math.round(state.pencilConfig.intensity * 50)}%`}
                  </span>
                </div>
                <Slider
                  id="pencil-intensity"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[state.pencilConfig.intensity]}
                  onValueChange={([value]) => handlePencilIntensityChange(value)}
                  className="slider-track"
                />

                <div className="slider-header">
                  <Label htmlFor="pencil-speed">
                    {getTranslation('animationSpeed', currentLanguage)}
                  </Label>
                  <span className="intensity-label">
                    {state.pencilConfig.animationSpeed === 0.1 
                      ? getTranslation('off', currentLanguage)
                      : state.pencilConfig.animationSpeed === 1 
                      ? getTranslation('max', currentLanguage)
                      : `${Math.round(state.pencilConfig.animationSpeed * 100)}%`}
                  </span>
                </div>
                <Slider
                  id="pencil-speed"
                  min={0.1}
                  max={1}
                  step={0.1}
                  value={[state.pencilConfig.animationSpeed]}
                  onValueChange={([value]) => handlePencilSpeedChange(value)}
                  className="slider-track"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialEffectsModal; 