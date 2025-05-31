import React from 'react';
import { useEffects } from '@/contexts/EffectsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { Pencil } from 'lucide-react';
import './EffectsControl.css';
import { Slider } from '@/components/Slider';

export const EffectsControl: React.FC = () => {
  const { currentLanguage } = useLanguage();
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

  return (
    <div className="effects-controls">
      <div className="effects-header">
        <h3>{getTranslation('specialEffects', currentLanguage)}</h3>
      </div>

      <div className="effects-options">
        <button
          className={`effect-button ${pencilEffect.enabled ? 'active' : ''}`}
          onClick={togglePencilEffect}
          title={getTranslation('pencilEffect', currentLanguage)}
        >
          <Pencil className="effect-icon" />
          {getTranslation('pencilEffect', currentLanguage)}
        </button>

        {pencilEffect.enabled && (
          <div className="effect-settings">
            <div className="settings-group">
              <label>Intensity</label>
              <Slider
                value={[pencilEffect.intensity]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={([value]) => updatePencilConfig({ intensity: value })}
              />
            </div>

            <div className="settings-group">
              <label>Animation Speed</label>
              <Slider
                value={[pencilEffect.animationSpeed]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={([value]) => updatePencilConfig({ animationSpeed: value })}
              />
            </div>
          </div>
        )}

        <button
          className={`effect-button ${pixelateEffect.enabled ? 'active' : ''}`}
          onClick={togglePixelateEffect}
        >
          <svg className="effect-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="6" height="6" />
            <rect x="15" y="3" width="6" height="6" />
            <rect x="3" y="15" width="6" height="6" />
            <rect x="15" y="15" width="6" height="6" />
          </svg>
          Pixelate
        </button>

        {pixelateEffect.enabled && (
          <div className="effect-settings">
            <div className="settings-group">
              <label>Grid Size</label>
              <Slider
                value={[pixelateEffect.gridSize]}
                min={32}
                max={128}
                step={16}
                onValueChange={([value]) => updatePixelateConfig({ gridSize: value })}
              />
            </div>

            <div className="settings-group">
              <label>Element Size</label>
              <Slider
                value={[pixelateEffect.elementSize]}
                min={0.25}
                max={1.5}
                step={0.05}
                onValueChange={([value]) => updatePixelateConfig({ elementSize: value })}
              />
            </div>

            <div className="settings-group">
              <label>Animation Speed</label>
              <Slider
                value={[pixelateEffect.animationSpeed]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={([value]) => updatePixelateConfig({ animationSpeed: value })}
              />
            </div>

            <div className="settings-group">
              <label>Color</label>
              <input
                type="color"
                value={pixelateEffect.color}
                onChange={(e) => updatePixelateConfig({ color: e.target.value })}
              />
            </div>

            <div className="settings-group">
              <label>Border Color</label>
              <input
                type="color"
                value={pixelateEffect.borderColor}
                onChange={(e) => updatePixelateConfig({ borderColor: e.target.value })}
              />
            </div>

            <div className="settings-group">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pixelateEffect.noisy}
                  onChange={(e) => updatePixelateConfig({ noisy: e.target.checked })}
                />
                Noisy Animation
              </label>
            </div>
          </div>
        )}

        <button
          className={`effect-button ${scanlineEffect.enabled ? 'active' : ''}`}
          onClick={toggleScanlineEffect}
        >
          <svg className="effect-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="0" y1="4" x2="24" y2="4" />
            <line x1="0" y1="12" x2="24" y2="12" />
            <line x1="0" y1="20" x2="24" y2="20" />
          </svg>
          Scanline
        </button>

        {scanlineEffect.enabled && (
          <div className="effect-settings">
            <div className="settings-group">
              <label>Speed</label>
              <Slider
                value={[scanlineEffect.speed]}
                min={0.1}
                max={5}
                step={0.1}
                onValueChange={([value]) => updateScanlineConfig({ speed: value })}
              />
            </div>

            <div className="settings-group">
              <label>Opacity</label>
              <Slider
                value={[scanlineEffect.opacity]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={([value]) => updateScanlineConfig({ opacity: value })}
              />
            </div>

            <div className="settings-group">
              <label>Color</label>
              <input
                type="color"
                value={scanlineEffect.color}
                onChange={(e) => updateScanlineConfig({ color: e.target.value })}
              />
            </div>

            <div className="settings-group">
              <label>Blend Mode</label>
              <select
                value={scanlineEffect.blendMode}
                onChange={(e) => updateScanlineConfig({ blendMode: e.target.value as any })}
              >
                <option value="hard-light">Hard Light</option>
                <option value="multiply">Multiply</option>
                <option value="overlay">Overlay</option>
              </select>
            </div>
          </div>
        )}

        <button
          className={`effect-button ${dotEffect.enabled ? 'active' : ''}`}
          onClick={toggleDotEffect}
        >
          <svg className="effect-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="12" cy="4" r="2" />
            <circle cx="12" cy="20" r="2" />
          </svg>
          Dot Effect
        </button>

        {dotEffect.enabled && (
          <div className="effect-settings">
            <div className="settings-group">
              <label>Grid Size</label>
              <Slider
                value={[dotEffect.gridSize]}
                min={32}
                max={128}
                step={16}
                onValueChange={([value]) => updateDotConfig({ gridSize: value })}
              />
            </div>

            <div className="settings-group">
              <label>Element Size</label>
              <Slider
                value={[dotEffect.elementSize]}
                min={0.25}
                max={1.5}
                step={0.05}
                onValueChange={([value]) => updateDotConfig({ elementSize: value })}
              />
            </div>

            <div className="settings-group">
              <label>Thickness</label>
              <Slider
                value={[dotEffect.thickness]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={([value]) => updateDotConfig({ thickness: value })}
              />
            </div>

            <div className="settings-group">
              <label>Animation Speed</label>
              <Slider
                value={[dotEffect.animationSpeed]}
                min={0.1}
                max={2}
                step={0.1}
                onValueChange={([value]) => updateDotConfig({ animationSpeed: value })}
              />
            </div>

            <div className="settings-group">
              <label>Color</label>
              <input
                type="color"
                value={dotEffect.color}
                onChange={(e) => updateDotConfig({ color: e.target.value })}
              />
            </div>

            <div className="settings-group">
              <label>Border Color</label>
              <input
                type="color"
                value={dotEffect.borderColor}
                onChange={(e) => updateDotConfig({ borderColor: e.target.value })}
              />
            </div>

            <div className="settings-group">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dotEffect.noisy}
                  onChange={(e) => updateDotConfig({ noisy: e.target.checked })}
                />
                Noisy Animation
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 