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