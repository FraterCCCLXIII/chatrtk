export type HotkeyCategory = 'navigation' | 'voice' | 'chat' | 'general';
export type HotkeyModifier = 'meta' | 'shift' | 'alt' | 'ctrl';

export interface Hotkey {
  key: string;
  description: string;
  category: HotkeyCategory;
  requiresModifier: boolean;
  modifier?: HotkeyModifier;
} 