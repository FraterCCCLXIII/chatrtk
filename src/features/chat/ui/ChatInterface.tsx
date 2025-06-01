import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';
import { ScrollArea } from '@/ui/scroll-area';
import { useToast } from '@/shared/hooks/use-toast';
import { useAvatar } from '@/core/contexts/AvatarContext';
import { SpeakingMode } from '@/core/rig/modes/SpeakingMode';
import { AvatarSettings } from '@/avatar';
import { FaceTheme, HeadShape } from '@/types/avatar';

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

// Default head shape
const defaultHeadShape: HeadShape = 'circle';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const ChatInterface: React.FC = () => {
  const { state, setSpeaking, setText } = useAvatar();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setSpeaking(true);
    setText('Thinking...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `I received your message: "${inputText}"`,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setText(aiMessage.text);
    
    // Simulate speaking duration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSpeaking(false);
    setText('');
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <SpeakingMode
            theme={defaultTheme}
            shape={defaultHeadShape}
          />
        </div>
        
        <div className="flex-1 flex flex-col p-4 gap-4">
          <ScrollArea ref={scrollRef} className="flex-1">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </ScrollArea>
          
          <div className="flex gap-2">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="w-80 border-l p-4 overflow-y-auto">
          <AvatarSettings />
        </div>
      )}
    </div>
  );
};

export default ChatInterface; 