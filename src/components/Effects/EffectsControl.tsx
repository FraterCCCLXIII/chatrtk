import React from 'react';
import { useEffects } from '@/contexts/EffectsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import { Pencil } from 'lucide-react';
import './EffectsControl.css';

export const EffectsControl: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { state, toggleEffect, updatePencilConfig } = useEffects();

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    updatePencilConfig({
      intensity: value,
      scale: value * 2,
      baseFrequency: 0.02 / value
    });
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePencilConfig({
      animationSpeed: parseFloat(e.target.value)
    });
  };

  return (
    <div className="effects-control">
      <div className="effects-header">
        <h3>{getTranslation('specialEffects', currentLanguage)}</h3>
      </div>
      
      <div className="effects-options">
        <button
          className={`effect-button ${state.activeEffect === 'pencil' ? 'active' : ''}`}
          onClick={() => toggleEffect('pencil')}
          title={getTranslation('pencilEffect', currentLanguage)}
        >
          <Pencil size={16} />
          {getTranslation('pencilEffect', currentLanguage)}
        </button>

        {state.activeEffect === 'pencil' && (
          <div className="effect-settings">
            <div className="setting-group">
              <label>
                {getTranslation('effectIntensity', currentLanguage)}
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={state.pencilConfig.intensity}
                  onChange={handleIntensityChange}
                />
              </label>
            </div>
            
            <div className="setting-group">
              <label>
                {getTranslation('animationSpeed', currentLanguage)}
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={state.pencilConfig.animationSpeed}
                  onChange={handleSpeedChange}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 