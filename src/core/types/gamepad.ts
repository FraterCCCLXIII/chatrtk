export type GamepadLayout = 'classic' | 'modern';

export interface GamepadButton {
  id: string;
  label: string;
  hotkey: string;
  description: string;
  isActive?: boolean;
}

export interface GamepadConfig {
  id: GamepadLayout;
  name: string;
  description: string;
  buttons: {
    dPad: GamepadButton[];
    actionButtons: GamepadButton[];
    systemButtons: GamepadButton[];
    analogSticks?: GamepadButton[];
  };
}

export interface GamepadHotkeyOverride {
  originalHotkey: string;
  gamepadHotkey: string;
  isActive: boolean;
}

// Classic NES-style layout
export const CLASSIC_LAYOUT: GamepadConfig = {
  id: 'classic',
  name: 'Classic Controller',
  description: 'NES-style controller with D-pad and AB buttons',
  buttons: {
    dPad: [
      { id: 'up', label: '↑', hotkey: 'ArrowUp', description: 'Move Up' },
      { id: 'down', label: '↓', hotkey: 'ArrowDown', description: 'Move Down' },
      { id: 'left', label: '←', hotkey: 'ArrowLeft', description: 'Move Left' },
      { id: 'right', label: '→', hotkey: 'ArrowRight', description: 'Move Right' }
    ],
    actionButtons: [
      { id: 'a', label: 'A', hotkey: 'z', description: 'Primary Action' },
      { id: 'b', label: 'B', hotkey: 'x', description: 'Secondary Action' }
    ],
    systemButtons: [
      { id: 'start', label: 'Start', hotkey: 'Enter', description: 'Start/Pause' },
      { id: 'select', label: 'Select', hotkey: 'Shift', description: 'Select/Menu' }
    ]
  }
};

// Modern Xbox-style layout
export const MODERN_LAYOUT: GamepadConfig = {
  id: 'modern',
  name: 'Modern Controller',
  description: 'Xbox-style controller with dual analog sticks',
  buttons: {
    dPad: [
      { id: 'up', label: '↑', hotkey: 'ArrowUp', description: 'Move Up' },
      { id: 'down', label: '↓', hotkey: 'ArrowDown', description: 'Move Down' },
      { id: 'left', label: '←', hotkey: 'ArrowLeft', description: 'Move Left' },
      { id: 'right', label: '→', hotkey: 'ArrowRight', description: 'Move Right' }
    ],
    actionButtons: [
      { id: 'a', label: 'A', hotkey: 'z', description: 'Primary Action' },
      { id: 'b', label: 'B', hotkey: 'x', description: 'Secondary Action' },
      { id: 'x', label: 'X', hotkey: 'a', description: 'Tertiary Action' },
      { id: 'y', label: 'Y', hotkey: 's', description: 'Quaternary Action' }
    ],
    systemButtons: [
      { id: 'start', label: 'Start', hotkey: 'Enter', description: 'Start/Pause' },
      { id: 'select', label: 'Select', hotkey: 'Shift', description: 'Select/Menu' },
      { id: 'menu', label: 'Menu', hotkey: 'm', description: 'Game Menu' }
    ],
    analogSticks: [
      { id: 'leftStick', label: 'L', hotkey: 'q', description: 'Left Stick' },
      { id: 'rightStick', label: 'R', hotkey: 'e', description: 'Right Stick' }
    ]
  }
};

export const GAMEPAD_CONFIGS: GamepadConfig[] = [
  CLASSIC_LAYOUT,
  MODERN_LAYOUT
]; 