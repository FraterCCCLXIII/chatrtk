import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GamepadConfig, GamepadLayout, GamepadHotkeyOverride, GAMEPAD_CONFIGS } from '@/types/gamepad';

interface GamepadContextType {
  activeLayout: GamepadLayout;
  setActiveLayout: (layout: GamepadLayout) => void;
  isGamepadActive: boolean;
  toggleGamepadActive: () => void;
  hotkeyOverrides: GamepadHotkeyOverride[];
  getCurrentConfig: () => GamepadConfig;
}

const GamepadContext = createContext<GamepadContextType | undefined>(undefined);

export const useGamepad = () => {
  const context = useContext(GamepadContext);
  if (!context) {
    throw new Error('useGamepad must be used within a GamepadProvider');
  }
  return context;
};

export const GamepadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLayout, setActiveLayout] = useState<GamepadLayout>('classic');
  const [isGamepadActive, setIsGamepadActive] = useState(false);
  const [hotkeyOverrides, setHotkeyOverrides] = useState<GamepadHotkeyOverride[]>([]);

  const getCurrentConfig = useCallback(() => {
    return GAMEPAD_CONFIGS.find(config => config.id === activeLayout) || GAMEPAD_CONFIGS[0];
  }, [activeLayout]);

  const toggleGamepadActive = useCallback(() => {
    setIsGamepadActive(prev => !prev);
  }, []);

  // Handle keyboard events for gamepad hotkeys
  useEffect(() => {
    if (!isGamepadActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const config = getCurrentConfig();
      const allButtons = [
        ...config.buttons.dPad,
        ...config.buttons.actionButtons,
        ...config.buttons.systemButtons,
        ...(config.buttons.analogSticks || [])
      ];

      const button = allButtons.find(btn => btn.hotkey === e.key);
      if (button) {
        e.preventDefault();
        // Here you would trigger the appropriate action for the button
        console.log(`Gamepad button pressed: ${button.id}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGamepadActive, getCurrentConfig]);

  // Update hotkey overrides when layout changes
  useEffect(() => {
    const config = getCurrentConfig();
    const newOverrides: GamepadHotkeyOverride[] = [];

    // Add overrides for all buttons in the current config
    const allButtons = [
      ...config.buttons.dPad,
      ...config.buttons.actionButtons,
      ...config.buttons.systemButtons,
      ...(config.buttons.analogSticks || [])
    ];

    allButtons.forEach(button => {
      newOverrides.push({
        originalHotkey: button.hotkey,
        gamepadHotkey: button.hotkey,
        isActive: isGamepadActive
      });
    });

    setHotkeyOverrides(newOverrides);
  }, [activeLayout, isGamepadActive, getCurrentConfig]);

  return (
    <GamepadContext.Provider
      value={{
        activeLayout,
        setActiveLayout,
        isGamepadActive,
        toggleGamepadActive,
        hotkeyOverrides,
        getCurrentConfig
      }}
    >
      {children}
    </GamepadContext.Provider>
  );
}; 