
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import TalkingHead from '../TalkingHead/TalkingHead';
import './ChatTalkingHead.css';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  text: string;
  isUser: boolean;
  expression?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
}

const ChatTalkingHead: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    text: "Hello! How can I help you today?",
    isUser: false,
    expression: 'happy'
  }]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking'>('happy');
  const { toast } = useToast();

  // Detect when AI is speaking and set the current text
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.isUser || isSpeaking) return;

    setCurrentSpeechText(lastMessage.text);
    setCurrentExpression(lastMessage.expression || 'neutral');
    setIsSpeaking(true);

    // Auto-stop talking after a delay based on message length
    const speakingTime = Math.max(2000, lastMessage.text.length * 50);
    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, speakingTime);

    return () => clearTimeout(timer);
  }, [messages]);

  // Handle user message submission
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    setMessages([...messages, { text: inputText, isUser: true }]);
    
    // Clear input
    setInputText('');

    // Generate AI response after a short delay
    setTimeout(() => generateResponse(inputText), 1000);
  };

  // Generate mock AI response (in a real app, this would call an API)
  const generateResponse = (userInput: string) => {
    let response: ChatMessage;
    const lowerInput = userInput.toLowerCase();
    
    // Detect expression from user input (simplified for demo)
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      response = { 
        text: "Hello there! How can I assist you today?", 
        isUser: false,
        expression: 'happy'
      };
    } else if (lowerInput.includes('sad') || lowerInput.includes('bad') || lowerInput.includes('sorry')) {
      response = { 
        text: "I'm sorry to hear that. Is there anything I can do to help?", 
        isUser: false,
        expression: 'sad'
      };
    } else if (lowerInput.includes('wow') || lowerInput.includes('amazing') || lowerInput.includes('really')) {
      response = { 
        text: "That's amazing! Tell me more about it!", 
        isUser: false,
        expression: 'surprised'
      };
    } else if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('upset')) {
      response = { 
        text: "I understand your frustration. Let's try to resolve this issue together.", 
        isUser: false,
        expression: 'angry'
      };
    } else if (lowerInput.includes('think') || lowerInput.includes('question') || lowerInput.includes('how')) {
      response = { 
        text: "That's an interesting question. Let me think about that for a moment...", 
        isUser: false,
        expression: 'thinking'
      };
    } else {
      response = { 
        text: "I see. Tell me more about what you're looking for.", 
        isUser: false,
        expression: 'neutral'
      };
    }

    setMessages(prev => [...prev, response]);

    // Show toast notification
    toast({
      title: "New message",
      description: "The AI assistant has responded to your message.",
    });
  };

  return (
    <Card className="chat-talking-head">
      <div className="talking-head-container">
        <TalkingHead 
          text={currentSpeechText}
          speaking={isSpeaking}
          expression={currentExpression}
        />
      </div>
      
      <div className="chat-container">
        <ScrollArea className="chat-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}
            >
              {message.text}
            </div>
          ))}
        </ScrollArea>
        
        <div className="input-container">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} className="send-button">Send</Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatTalkingHead;
