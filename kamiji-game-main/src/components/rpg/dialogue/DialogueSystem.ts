
import { DialogueTheme, DialogueMessage } from '../types';
import dialogueThemes from './dialogueThemes.json';

export class DialogueSystem {
  private themes: DialogueTheme;
  private lastMessageTime: number = 0;
  private messageFrequency: number = 8000; // 8 seconds

  constructor() {
    this.themes = dialogueThemes as DialogueTheme;
  }

  shouldShowMessage(): boolean {
    const now = Date.now();
    return now - this.lastMessageTime > this.messageFrequency;
  }

  getRandomMessage(context: {
    mood?: string;
    terrain?: string;
    timeOfDay?: string;
    interactionType?: string;
  }): string | null {
    if (!this.shouldShowMessage()) {
      return null;
    }

    let messages: DialogueMessage[] = [];
    
    // Collect messages based on context
    if (context.interactionType && this.themes[context.interactionType]) {
      messages = [...this.themes[context.interactionType]];
    } else {
      // Default to wandering messages
      messages = [...this.themes.wandering];
    }

    // Filter messages based on conditions
    const filteredMessages = messages.filter(msg => {
      if (!msg.conditions) return true;
      
      const { mood, terrain, timeOfDay } = msg.conditions;
      
      if (mood && context.mood !== mood) return false;
      if (terrain && context.terrain !== terrain) return false;
      if (timeOfDay && context.timeOfDay !== timeOfDay) return false;
      
      return true;
    });

    if (filteredMessages.length === 0) {
      // Fallback to basic wandering messages
      const fallback = this.themes.wandering.filter(msg => !msg.conditions);
      if (fallback.length > 0) {
        const randomMessage = fallback[Math.floor(Math.random() * fallback.length)];
        this.lastMessageTime = Date.now();
        return randomMessage.text;
      }
      return null;
    }

    const randomMessage = filteredMessages[Math.floor(Math.random() * filteredMessages.length)];
    this.lastMessageTime = Date.now();
    return randomMessage.text;
  }

  reset(): void {
    this.lastMessageTime = 0;
  }
}
