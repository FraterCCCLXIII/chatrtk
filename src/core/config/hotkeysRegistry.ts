import { Hotkey } from '@/types/hotkeys';

// Add a global state for hotkeys enabled
let hotkeysEnabled = true;

export const HOTKEYS: Record<string, Hotkey> = {
  // Navigation
  toggleHead: {
    key: 'h',
    description: 'Toggle head visibility',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },
  toggleChat: {
    key: 'c',
    description: 'Toggle chat visibility',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },
  openFaceSelector: {
    key: 'f',
    description: 'Open face selector',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },
  openFacialRigEditor: {
    key: 'e',
    description: 'Open facial rig editor',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },
  openSettings: {
    key: 's',
    description: 'Open settings',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },
  openGames: {
    key: 'g',
    description: 'Open RTK Arcade',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },
  openProjectInfo: {
    key: 'i',
    description: 'Open project info',
    category: 'navigation',
    requiresModifier: true,
    modifier: 'meta',
  },

  // Voice Controls
  toggleVoice: {
    key: 'v',
    description: 'Toggle voice',
    category: 'voice',
    requiresModifier: true,
    modifier: 'meta',
  },
  toggleMicrophone: {
    key: 'm',
    description: 'Toggle microphone',
    category: 'voice',
    requiresModifier: true,
    modifier: 'meta',
  },
  toggleAlwaysListen: {
    key: 'a',
    description: 'Toggle always listen',
    category: 'voice',
    requiresModifier: true,
    modifier: 'meta',
  },
  stopContinueAI: {
    key: ' ',
    description: 'Stop/Continue AI',
    category: 'voice',
    requiresModifier: false,
  },

  // Chat Controls
  sendMessage: {
    key: 'Enter',
    description: 'Send message',
    category: 'chat',
    requiresModifier: false,
  },
  newLine: {
    key: 'Enter',
    description: 'New line in chat',
    category: 'chat',
    requiresModifier: true,
    modifier: 'shift',
  },
  changeLanguage: {
    key: 'l',
    description: 'Change language',
    category: 'chat',
    requiresModifier: true,
    modifier: 'meta',
  },

  // General
  showHotkeys: {
    key: 'k',
    description: 'Show hotkeys',
    category: 'general',
    requiresModifier: true,
    modifier: 'meta',
  },
  closeModal: {
    key: 'Escape',
    description: 'Close any modal',
    category: 'general',
    requiresModifier: false,
  },
};

export const getHotkeysByCategory = (category: string) => {
  return Object.entries(HOTKEYS)
    .filter(([_, hotkey]) => hotkey.category === category)
    .map(([id, hotkey]) => ({ id, ...hotkey }));
};

export const getHotkeyDisplay = (hotkey: Hotkey) => {
  if (!hotkey.requiresModifier) {
    return hotkey.key;
  }
  
  const modifier = hotkey.modifier === 'meta' 
    ? (navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
    : hotkey.modifier.charAt(0).toUpperCase() + hotkey.modifier.slice(1);
    
  return `${modifier} + ${hotkey.key}`;
};

export const getHotkeyId = (event: KeyboardEvent): string | null => {
  // If hotkeys are disabled, return null
  if (!hotkeysEnabled) return null;

  const key = event.key.toLowerCase();
  const isMeta = event.metaKey;
  const isShift = event.shiftKey;
  const isAlt = event.altKey;
  const isCtrl = event.ctrlKey;

  return Object.entries(HOTKEYS).find(([_, hotkey]) => {
    if (hotkey.key.toLowerCase() !== key) return false;
    if (!hotkey.requiresModifier) return true;
    
    switch (hotkey.modifier) {
      case 'meta': return isMeta;
      case 'shift': return isShift;
      case 'alt': return isAlt;
      case 'ctrl': return isCtrl;
      default: return false;
    }
  })?.[0] || null;
};

// Add functions to manage hotkeys state
export const isHotkeysEnabled = () => hotkeysEnabled;

export const setHotkeysEnabled = (enabled: boolean) => {
  hotkeysEnabled = enabled;
  // Save to localStorage
  localStorage.setItem('hotkeysEnabled', String(enabled));
  // Dispatch event for components to react to the change
  window.dispatchEvent(new CustomEvent('hotkeysStateChanged', { detail: enabled }));
};

// Initialize hotkeys state from localStorage
export const initializeHotkeysState = () => {
  const savedState = localStorage.getItem('hotkeysEnabled');
  if (savedState !== null) {
    hotkeysEnabled = savedState === 'true';
  }
}; 