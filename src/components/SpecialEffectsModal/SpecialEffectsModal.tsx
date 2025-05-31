import React from 'react';
import { Sparkles, Pencil, Grid, Scan, Circle, X, Maximize2, Minimize2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffects } from '@/contexts/EffectsContext';
import { getTranslation } from '@/lib/translations';
import { useWindow } from '@/lib/windowManager';
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
  const {
    state,
    handleDragStart,
    handleResizeStart,
    toggleMaximize,
    style
  } = useWindow({
    initialPosition: {
      x: (window.innerWidth - 400) / 2,
      y: (window.innerHeight - 300) / 2
    },
    initialSize: {
      width: 400,
      height: 300
    },
    minSize: {
      width: 300,
      height: 200
    },
    bounds: {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  });

  const {
    activeEffect,
    pencilEffect,
    pixelateEffect,
    scanlineEffect,
    dotEffect,
    togglePencilEffect,
    updatePencilConfig,
    togglePixelateEffect,
    updatePixelateConfig,
    toggleScanlineEffect,
    updateScanlineConfig,
    toggleDotEffect,
    updateDotConfig
  } = useEffects();

  if (!open) return null;

  const handlePencilIntensityChange = (value: number[]) => {
    updatePencilConfig({ intensity: value[0] });
  };

  const handlePencilSpeedChange = (value: number[]) => {
    updatePencilConfig({ animationSpeed: value[0] });
  };

  const handlePixelateGridSizeChange = (value: number[]) => {
    updatePixelateConfig({ gridSize: value[0] });
  };

  const handlePixelateColorChange = (value: string) => {
    updatePixelateConfig({ color: value });
  };

  const handlePixelateNoisyChange = (checked: boolean) => {
    updatePixelateConfig({ noisy: checked });
  };

  const handlePixelateSpeedChange = (value: number[]) => {
    updatePixelateConfig({ animationSpeed: value[0] });
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

  const handleDotGridSizeChange = (value: number[]) => {
    updateDotConfig({ gridSize: value[0] });
  };

  const handleDotElementSizeChange = (value: number[]) => {
    updateDotConfig({ elementSize: value[0] });
  };

  const handleDotThicknessChange = (value: number[]) => {
    updateDotConfig({ thickness: value[0] });
  };

  const handleDotSpeedChange = (value: number[]) => {
    updateDotConfig({ animationSpeed: value[0] });
  };

  const handleDotColorChange = (value: string) => {
    updateDotConfig({ color: value });
  };

  const handleDotBorderColorChange = (value: string) => {
    updateDotConfig({ borderColor: value });
  };

  const handleDotNoisyChange = (checked: boolean) => {
    updateDotConfig({ noisy: checked });
  };

  return (
    <div className="special-effects-modal" style={style}>
      <div className="special-effects-header" onMouseDown={handleDragStart}>
        <div className="special-effects-title">
          <Sparkles className="h-4 w-4 mr-2" />
          {getTranslation('specialEffects', currentLanguage)}
        </div>
        <div className="special-effects-controls">
          <button onClick={toggleMaximize} className="special-effects-control-button">
            {state.isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={() => onOpenChange(false)} className="special-effects-control-button">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="special-effects-content">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{getTranslation('animationIntensity', currentLanguage)}</Label>
            <Slider
              value={[animationIntensity]}
              onValueChange={(value) => onAnimationIntensityChange(value[0])}
              min={0}
              max={3}
              step={1}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              {animationIntensity === 0 && getTranslation('animationsDisabled', currentLanguage)}
              {animationIntensity === 1 && getTranslation('subtleAnimations', currentLanguage)}
              {animationIntensity === 2 && getTranslation('moderateAnimations', currentLanguage)}
              {animationIntensity === 3 && getTranslation('energeticAnimations', currentLanguage)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{getTranslation('zoomIntensity', currentLanguage)}</Label>
            <Slider
              value={[zoomIntensity]}
              onValueChange={(value) => onZoomIntensityChange(value[0])}
              min={0}
              max={3}
              step={1}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              {zoomIntensity === 0 && getTranslation('zoomDisabled', currentLanguage)}
              {zoomIntensity === 1 && getTranslation('subtleZoom', currentLanguage)}
              {zoomIntensity === 2 && getTranslation('mediumZoom', currentLanguage)}
              {zoomIntensity === 3 && getTranslation('maxZoom', currentLanguage)}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{getTranslation('effectIntensity', currentLanguage)}</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => togglePencilEffect()}
                className={`effect-button ${pencilEffect.enabled ? 'active' : ''}`}
              >
                <Pencil className="h-4 w-4 mr-2" />
                {getTranslation('pencilEffect', currentLanguage)}
              </button>
              <button
                onClick={() => togglePixelateEffect()}
                className={`effect-button ${pixelateEffect.enabled ? 'active' : ''}`}
              >
                <Grid className="h-4 w-4 mr-2" />
                {getTranslation('pixelateEffect', currentLanguage)}
              </button>
              <button
                onClick={() => toggleScanlineEffect()}
                className={`effect-button ${scanlineEffect.enabled ? 'active' : ''}`}
              >
                <Scan className="h-4 w-4 mr-2" />
                {getTranslation('scanlineEffect', currentLanguage)}
              </button>
              <button
                onClick={() => toggleDotEffect()}
                className={`effect-button ${dotEffect.enabled ? 'active' : ''}`}
              >
                <Circle className="h-4 w-4 mr-2" />
                {getTranslation('dotEffect', currentLanguage)}
              </button>
            </div>
          </div>

          {pencilEffect.enabled && (
            <div className="space-y-2">
              <Label>{getTranslation('pencilEffect', currentLanguage)}</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm">{getTranslation('effectIntensity', currentLanguage)}</Label>
                  <Slider
                    value={[pencilEffect.intensity]}
                    onValueChange={handlePencilIntensityChange}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm">{getTranslation('animationSpeed', currentLanguage)}</Label>
                  <Slider
                    value={[pencilEffect.animationSpeed]}
                    onValueChange={handlePencilSpeedChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {pixelateEffect.enabled && (
            <div className="space-y-2">
              <Label>{getTranslation('pixelateEffect', currentLanguage)}</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm">{getTranslation('pixelSize', currentLanguage)}</Label>
                  <Slider
                    value={[pixelateEffect.gridSize]}
                    onValueChange={handlePixelateGridSizeChange}
                    min={2}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm">{getTranslation('animationSpeed', currentLanguage)}</Label>
                  <Slider
                    value={[pixelateEffect.animationSpeed]}
                    onValueChange={handlePixelateSpeedChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {scanlineEffect.enabled && (
            <div className="space-y-2">
              <Label>{getTranslation('scanlineEffect', currentLanguage)}</Label>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm">{getTranslation('effectOpacity', currentLanguage)}</Label>
                  <Slider
                    value={[scanlineEffect.opacity * 100]}
                    onValueChange={handleScanlineOpacityChange}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm">{getTranslation('animationSpeed', currentLanguage)}</Label>
                  <Slider
                    value={[scanlineEffect.speed]}
                    onValueChange={handleScanlineSpeedChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="special-effects-resize-handle" onMouseDown={(e) => handleResizeStart(e, 'se')} />
    </div>
  );
};

export default SpecialEffectsModal; 