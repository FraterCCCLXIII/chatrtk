import React, { useState, useRef } from 'react';
import { AvatarSpeaking } from '@/core/rig/modes/AvatarSpeaking';
import { FaceTheme, HeadShape } from '@/types/avatar';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { ScrollArea } from '@/ui/scroll-area';
import { Send, Mic, MicOff } from 'lucide-react';
import { useFloatingAnimation } from '@/core/hooks/useAnimations';
import './ChatAvatar.css';

// Default theme
const defaultTheme: FaceTheme = {
  id: 'default',
  name: 'Minty',
  description: 'The classic mint green face',
  previewColor: '#5ddbaf',
  screenColor: '#e2ffe5',
  faceColor: '#5daa77',
  mouthColor: '#5daa77',
  borderColor: '#333333',
  textColor: '#333333',
  backgroundColor: '#e2ffe5',
  tongueColor: '#ff7d9d',
  eyeColor: '#000000',
  strokeColor: '#333333',
  showStroke: true
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  expression?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
}

export const ChatAvatar: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking'>('neutral');
  const [currentFaceTheme, setCurrentFaceTheme] = useState<FaceTheme>(defaultTheme);
  const [currentHeadShape, setCurrentHeadShape] = useState<HeadShape>('circle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const floatingAnimation = useFloatingAnimation();

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      isUser: true
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: "I'm a simple AI assistant. I can help you with basic tasks.",
        isUser: false,
        expression: 'happy'
      };
      setMessages(prev => [...prev, aiMessage]);
      setCurrentExpression('happy');
      setIsSpeaking(true);
    }, 1000);
  };

  // Handle speaking state change
  const handleSpeakingChange = (speaking: boolean) => {
    setIsSpeaking(speaking);
    if (!speaking) {
      setCurrentExpression('neutral');
    }
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-avatar">
      <div className="avatar-container" style={floatingAnimation}>
        <AvatarSpeaking
          text={messages[messages.length - 1]?.text}
          speaking={isSpeaking}
          onSpeakingChange={handleSpeakingChange}
          expression={currentExpression}
          theme={currentFaceTheme}
          shape={currentHeadShape}
        />
      </div>
      <div className="chat-container">
        <ScrollArea className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user' : 'ai'}`}
            >
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="input-container">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAvatar; 