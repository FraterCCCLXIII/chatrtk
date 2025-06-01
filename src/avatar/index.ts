// Core avatar components
export { default as Kamiji } from './Kamiji';
export { useAvatar } from './useAvatar';

// Rig exports
export * from './rig/eyes';
export * from './rig/mouth';
export * from './rig/expressions';
export { default as AvatarRigEditor } from './rig/tools/AvatarRigEditor';

// UI components
export { default as AvatarSettings } from './ui/AvatarSettings';
export * from './ui/face';

// Re-export core avatar functionality
export * from '@/core/avatar';
export * from '@/core/rig/modes/AvatarSpeaking';
export type { AvatarSpeakingProps } from '@/core/rig/modes/AvatarSpeaking'; 