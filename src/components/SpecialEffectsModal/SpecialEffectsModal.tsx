import React, { useRef, useEffect } from 'react';
import { Sparkles, Pencil, Grid, Scan } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffects } from '@/contexts/EffectsContext';
import { getTranslation } from '@/lib/translations';
import './SpecialEffectsModal.css';

interface SpecialEffectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animationIntensity: number;
  onAnimationIntensityChange: (value: number) => void;
  zoomIntensity: number;
  onZoomIntensityChange: (value: number) => void;
}

const SpecialEffectsModal: React.FC<SpecialEffectsModalProps> = ({
  open,
  onOpenChange,
  animationIntensity,
  onAnimationIntensityChange,
  zoomIntensity,
  onZoomIntensityChange
}) => {
  const { currentLanguage } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    activeEffect,
    pencilEffect,
    pixelateEffect,
    scanlineEffect,
    togglePencilEffect,
    updatePencilConfig,
    togglePixelateEffect,
    updatePixelateConfig,
    toggleScanlineEffect,
    updateScanlineConfig
  } = useEffects();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  if (!open) return null;

  const handlePencilIntensityChange = (value: number[]) => {
    updatePencilConfig({ intensity: value[0] });
  };

  const handlePencilSpeedChange = (value: number[]) => {
    updatePencilConfig({ animationSpeed: value[0] });
  };

  const handlePixelateSizeChange = (value: number[]) => {
    updatePixelateConfig({ pixelSize: value[0] });
  };

  const handlePixelateIntensityChange = (value: number[]) => {
    updatePixelateConfig({ intensity: value[0] });
  };

  const handleScanlineOpacityChange = (value: number[]) => {
    updateScanlineConfig({ opacity: value[0] / 100 });
  };

  const handleScanlineSpeedChange = (value: number[]) => {
    updateScanlineConfig({ speed: value[0] });
  };

  const handleScanlineColorChange = (value: string) => {
    updateScanlineConfig({ color: value });
  };

  const handleScanlineBlendModeChange = (value: string) => {
    updateScanlineConfig({ blendMode: value as 'hard-light' | 'multiply' | 'overlay' });
  };

  return (
    <div className="special-effects-modal-overlay">
      <div ref={modalRef} className="special-effects-modal">
        <div className="effects-header">
          <h3>{getTranslation('specialEffects', currentLanguage)}</h3>
        </div>
        
        <div className="effects-controls">
          <div className="settings-group">
            <Label>{getTranslation('animationIntensity', currentLanguage)}</Label>
            <Slider
              value={[animationIntensity]}
              onValueChange={(value) => onAnimationIntensityChange(value[0])}
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="settings-group">
            <Label>{getTranslation('zoomIntensity', currentLanguage)}</Label>
            <Slider
              value={[zoomIntensity]}
              onValueChange={(value) => onZoomIntensityChange(value[0])}
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <button
            className={`effect-button ${pencilEffect.enabled ? 'active' : ''}`}
            onClick={togglePencilEffect}
          >
            <Pencil className="effect-icon" />
            {getTranslation('pencilEffect', currentLanguage)}
          </button>

          {pencilEffect.enabled && (
            <div className="effect-settings">
              <div className="settings-group">
                <Label>{getTranslation('effectIntensity', currentLanguage)}</Label>
                <Slider
                  value={[pencilEffect.intensity]}
                  onValueChange={handlePencilIntensityChange}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              <div className="settings-group">
                <Label>{getTranslation('animationSpeed', currentLanguage)}</Label>
                <Slider
                  value={[pencilEffect.animationSpeed]}
                  onValueChange={handlePencilSpeedChange}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
              </div>
            </div>
          )}

          <button
            className={`effect-button ${pixelateEffect.enabled ? 'active' : ''}`}
            onClick={togglePixelateEffect}
          >
            <Grid className="effect-icon" />
            {getTranslation('pixelateEffect', currentLanguage)}
          </button>

          {pixelateEffect.enabled && (
            <div className="effect-settings">
              <div className="settings-group">
                <Label>{getTranslation('pixelSize', currentLanguage)}</Label>
                <Slider
                  value={[pixelateEffect.pixelSize]}
                  onValueChange={handlePixelateSizeChange}
                  min={2}
                  max={20}
                  step={1}
                />
              </div>
              <div className="settings-group">
                <Label>{getTranslation('effectIntensity', currentLanguage)}</Label>
                <Slider
                  value={[pixelateEffect.intensity]}
                  onValueChange={handlePixelateIntensityChange}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          )}

          <button
            className={`effect-button ${scanlineEffect.enabled ? 'active' : ''}`}
            onClick={toggleScanlineEffect}
          >
            <Scan className="effect-icon" />
            {getTranslation('scanlineEffect', currentLanguage)}
          </button>

          {scanlineEffect.enabled && (
            <div className="effect-settings">
              <div className="settings-group">
                <Label>{getTranslation('effectOpacity', currentLanguage)}</Label>
                <Slider
                  value={[scanlineEffect.opacity * 100]}
                  onValueChange={handleScanlineOpacityChange}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              <div className="settings-group">
                <Label>{getTranslation('animationSpeed', currentLanguage)}</Label>
                <Slider
                  value={[scanlineEffect.speed]}
                  onValueChange={handleScanlineSpeedChange}
                  min={0.5}
                  max={5}
                  step={0.1}
                />
              </div>
              <div className="settings-group">
                <Label>{getTranslation('scanlineColor', currentLanguage)}</Label>
                <Select
                  value={scanlineEffect.color}
                  onValueChange={handleScanlineColorChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#8BC34A">Green</SelectItem>
                    <SelectItem value="#FFEB3B">Yellow</SelectItem>
                    <SelectItem value="#2196F3">Blue</SelectItem>
                    <SelectItem value="#F44336">Red</SelectItem>
                    <SelectItem value="#9C27B0">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="settings-group">
                <Label>{getTranslation('blendMode', currentLanguage)}</Label>
                <Select
                  value={scanlineEffect.blendMode}
                  onValueChange={handleScanlineBlendModeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hard-light">Hard Light</SelectItem>
                    <SelectItem value="multiply">Multiply</SelectItem>
                    <SelectItem value="overlay">Overlay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialEffectsModal; 