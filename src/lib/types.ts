// Message types
export type MessageType = "text" | "card";
export type Expression = 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';

// Base message type
export interface BaseMessage {
  id?: string;
  type: MessageType;
  isUser: boolean;
}

// Text message (existing type)
export interface TextMessage extends BaseMessage {
  type: "text";
  text: string;
  expression?: Expression;
}

// New card message type
export interface CardMessage extends BaseMessage {
  type: "card";
  title: string;
  content: string;
  actions?: {
    label: string;
    action: string; // e.g. "openModal:settings"
  }[];
}

// Union type for all message types
export type ChatMessage = TextMessage | CardMessage;

// AI Personality Profile
export interface AIPersonality {
  id: string;
  name: string;
  traits: string[];
  interests: string[];
  thoughtPatterns: string[];
  conversationStyle: string[];
  currentThoughts: Thought[];
  memory: Memory[];
}

// Individual thought with context and relevance
export interface Thought {
  id: string;
  content: string;
  category: 'observation' | 'question' | 'reflection' | 'connection' | 'curiosity';
  context?: string;
  relevance: number; // 0-1 scale of how relevant to current conversation
  timestamp: number;
  relatedThoughts?: string[]; // IDs of related thoughts
  expressed: boolean;
}

// Memory of past interactions or important information
export interface Memory {
  id: string;
  content: string;
  type: 'conversation' | 'preference' | 'fact' | 'insight';
  importance: number; // 0-1 scale
  timestamp: number;
  lastReferenced: number;
  referenceCount: number;
}