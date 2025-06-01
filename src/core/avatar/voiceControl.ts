import { FaceTheme, HeadShape } from '@/types/avatar';

export interface VoiceState {
  isSpeaking: boolean;
  isListening: boolean;
  volume: number;
  rate: number;
  pitch: number;
}

export interface VoiceControl {
  currentVoiceState: VoiceState;
  setVoiceState: (state: Partial<VoiceState>) => void;
  resetVoiceState: () => void;
}

export const createVoiceControl = (): VoiceControl => {
  let currentVoiceState: VoiceState = {
    isSpeaking: false,
    isListening: false,
    volume: 1,
    rate: 1,
    pitch: 1
  };

  return {
    get currentVoiceState() {
      return currentVoiceState;
    },
    setVoiceState(state: Partial<VoiceState>) {
      currentVoiceState = { ...currentVoiceState, ...state };
    },
    resetVoiceState() {
      currentVoiceState = {
        isSpeaking: false,
        isListening: false,
        volume: 1,
        rate: 1,
        pitch: 1
      };
    }
  };
}; 