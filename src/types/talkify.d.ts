declare global {
  interface Window {
    talkify: {
      TtsPlayer: new () => TtsPlayer;
      config: {
        useSsml: boolean;
      };
    };
  }
}

export interface TtsPlayer {
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
  
  playText(text: string): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
}

declare module 'talkify-tts' {
  export { TtsPlayer };
} 