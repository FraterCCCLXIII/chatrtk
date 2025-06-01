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

class WebSpeechTtsPlayer implements TtsPlayer {
  private utterance: SpeechSynthesisUtterance | null = null;
  private synth: SpeechSynthesis;
  
  rate: number = 1;
  pitch: number = 1;
  volume: number = 1;
  voice: string = '';

  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    
    // Initialize with default voice
    const voices = this.synth.getVoices();
    const defaultVoice = voices.find(voice => voice.lang === 'en-US') || voices[0];
    if (defaultVoice) {
      this.voice = defaultVoice.name;
    }
  }

  async playText(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.utterance) {
        reject(new Error('Speech synthesis not initialized'));
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      // Configure the utterance
      this.utterance.text = text;
      this.utterance.rate = this.rate;
      this.utterance.pitch = this.pitch;
      this.utterance.volume = this.volume;

      // Set the voice
      const voices = this.synth.getVoices();
      const selectedVoice = voices.find(voice => voice.name === this.voice) || voices[0];
      if (selectedVoice) {
        this.utterance.voice = selectedVoice;
      }

      // Handle completion
      this.utterance.onend = () => resolve();
      this.utterance.onerror = (event) => reject(event);

      // Speak the text
      this.synth.speak(this.utterance);
    });
  }

  stop(): void {
    this.synth.cancel();
  }

  pause(): void {
    this.synth.pause();
  }

  resume(): void {
    this.synth.resume();
  }
}

// Get available voices
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis.getVoices();
}

// Get the TTS player instance
export function getTalkifyPlayer(): TtsPlayer {
  return new WebSpeechTtsPlayer();
}

// Initialize TTS
export async function setupTalkify(): Promise<void> {
  // For Web Speech API, we just need to wait for voices to be loaded
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve();
      };
    }
  });
} 