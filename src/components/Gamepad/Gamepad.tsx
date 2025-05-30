import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { useGamepad } from '@/contexts/GamepadContext';
import { GAMEPAD_CONFIGS } from '@/types/gamepad';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/lib/translations';
import './Gamepad.css';

interface GamepadProps {
  onButtonPress: (buttonId: string) => void;
}

const Gamepad: React.FC<GamepadProps> = ({ onButtonPress }) => {
  const { currentLanguage } = useLanguage();
  const {
    activeLayout,
    setActiveLayout,
    isGamepadActive,
    toggleGamepadActive,
    getCurrentConfig
  } = useGamepad();

  const config = getCurrentConfig();

  const handleButtonClick = (buttonId: string) => {
    if (!isGamepadActive) return;
    onButtonPress(buttonId);
  };

  const renderDPad = () => (
    <div className="gamepad-dpad">
      {config.buttons.dPad.map(button => (
        <button
          key={button.id}
          className={`gamepad-button dpad-button ${button.id}`}
          onClick={() => handleButtonClick(button.id)}
          title={`${button.description} (${button.hotkey})`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );

  const renderActionButtons = () => (
    <div className="gamepad-action-buttons">
      {config.buttons.actionButtons.map(button => (
        <button
          key={button.id}
          className={`gamepad-button action-button ${button.id}`}
          onClick={() => handleButtonClick(button.id)}
          title={`${button.description} (${button.hotkey})`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );

  const renderSystemButtons = () => (
    <div className="gamepad-system-buttons">
      {config.buttons.systemButtons.map(button => (
        <button
          key={button.id}
          className={`gamepad-button system-button ${button.id}`}
          onClick={() => handleButtonClick(button.id)}
          title={`${button.description} (${button.hotkey})`}
        >
          {button.label}
        </button>
      ))}
    </div>
  );

  const renderAnalogSticks = () => {
    if (!config.buttons.analogSticks) return null;
    return (
      <div className="gamepad-analog-sticks">
        {config.buttons.analogSticks.map(button => (
          <button
            key={button.id}
            className={`gamepad-button analog-stick ${button.id}`}
            onClick={() => handleButtonClick(button.id)}
            title={`${button.description} (${button.hotkey})`}
          >
            {button.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="gamepad-container">
      <div className="gamepad-sidebar">
        <div className="gamepad-layout-selector">
          {GAMEPAD_CONFIGS.map(layout => (
            <button
              key={layout.id}
              className={`gamepad-layout-button ${activeLayout === layout.id ? 'active' : ''}`}
              onClick={() => setActiveLayout(layout.id)}
              title={layout.description}
            >
              {layout.name}
            </button>
          ))}
        </div>
        <button
          className={`gamepad-toggle ${isGamepadActive ? 'active' : ''}`}
          onClick={toggleGamepadActive}
          title={getTranslation('toggleGamepad', currentLanguage)}
        >
          <Gamepad2 size={20} />
          {isGamepadActive ? getTranslation('disableGamepad', currentLanguage) : getTranslation('enableGamepad', currentLanguage)}
        </button>
      </div>
      <div className={`gamepad-interface ${activeLayout} ${isGamepadActive ? 'active' : ''}`}>
        <div className="gamepad-layout">
          {renderDPad()}
          {renderActionButtons()}
          {renderSystemButtons()}
          {renderAnalogSticks()}
        </div>
        <div className="gamepad-hotkey-info">
          {getTranslation('gamepadHotkeysActive', currentLanguage)}
        </div>
      </div>
    </div>
  );
};

export default Gamepad; 