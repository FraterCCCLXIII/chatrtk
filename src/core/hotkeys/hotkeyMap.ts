import { Hotkey } from '@/types/hotkeys';

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
  }
}; 