
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings } from "lucide-react";
import TalkingHead from '../TalkingHead/TalkingHead';
import ApiKeyModal from '../ApiKeyModal/ApiKeyModal';
import './ChatTalkingHead.css';
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  text: string;
  isUser: boolean;
  expression?: 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking';
}

interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4o',
    endpoint: ''
  });
  const { toast } = useToast();

  // Load API settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem('apiSettings');
    if (savedSettings) {
      setApiSettings(JSON.parse(savedSettings));
    }
  }, []);

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

  // Save API settings
  const handleSaveSettings = (provider: string, apiKey: string, model: string, endpoint?: string) => {
    const newSettings = { provider, apiKey, model, endpoint };
    setApiSettings(newSettings);
    localStorage.setItem('apiSettings', JSON.stringify(newSettings));
  };

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    setMessages([...messages, { text: inputText, isUser: true }]);
    
    // Store the input and clear it
    const userInput = inputText;
    setInputText('');

    // Check if API key is configured
    if (!apiSettings.apiKey) {
      setIsModalOpen(true);
      toast({
        title: "API Key Required",
        description: "Please configure your AI provider settings first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await generateAIResponse(userInput);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please check your API settings.",
        variant: "destructive",
      });
      
      // Add fallback response
      setMessages(prev => [...prev, {
        text: "Sorry, I encountered an error. Please check your API settings.",
        isUser: false,
        expression: 'sad'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI response using the configured API
  const generateAIResponse = async (userInput: string): Promise<ChatMessage> => {
    // If no API key, use mock response
    if (!apiSettings.apiKey) {
      return mockGenerateResponse(userInput);
    }

    try {
      let apiUrl: string;
      let requestBody: any;
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      switch (apiSettings.provider) {
        case 'openai':
          apiUrl = 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiSettings.apiKey}`;
          requestBody = {
            model: apiSettings.model,
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant with emotions. Express happiness, sadness, surprise, anger, or thoughtfulness in your responses. Keep responses concise."
              },
              ...messages.map(msg => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text
              })),
              {
                role: "user",
                content: userInput
              }
            ],
            max_tokens: 300
          };
          break;

        case 'claude':
          apiUrl = 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = apiSettings.apiKey;
          headers['anthropic-version'] = '2023-06-01';
          requestBody = {
            model: apiSettings.model,
            max_tokens: 300,
            messages: [
              {
                role: "user",
                content: `As an assistant with emotions, respond to: ${userInput}\nExpress happiness, sadness, surprise, anger, or thoughtfulness. Keep it concise.`
              }
            ]
          };
          break;
          
        case 'deepseek':
          apiUrl = 'https://api.deepseek.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiSettings.apiKey}`;
          requestBody = {
            model: apiSettings.model,
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant with emotions. Express happiness, sadness, surprise, anger, or thoughtfulness in your responses. Keep responses concise."
              },
              ...messages.map(msg => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text
              })),
              {
                role: "user",
                content: userInput
              }
            ],
            max_tokens: 300
          };
          break;
          
        case 'local':
          // Use our standalone proxy server to avoid CORS issues
          apiUrl = apiSettings.endpoint || 'http://localhost:3000/api/v1/chat/completions';
          requestBody = {
            model: apiSettings.model,
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant with emotions. Express happiness, sadness, surprise, anger, or thoughtfulness in your responses. Keep responses concise."
              },
              ...messages.map(msg => ({
                role: msg.isUser ? "user" : "assistant",
                content: msg.text
              })),
              {
                role: "user",
                content: userInput
              }
            ],
            max_tokens: 300
          };
          break;
          
        default:
          return mockGenerateResponse(userInput);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      let content;
      switch (apiSettings.provider) {
        case 'claude':
          content = data.content?.[0]?.text || "I'm not sure how to respond to that.";
          break;
        case 'openai':
        case 'deepseek':
        case 'local':
        default:
          content = data.choices?.[0]?.message?.content || "I'm not sure how to respond to that.";
          break;
      }
      
      // Detect expression from content
      const expression = detectExpression(content);
      
      return {
        text: content,
        isUser: false,
        expression
      };
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  // Mock AI response for testing or when API key isn't configured
  const mockGenerateResponse = (userInput: string): ChatMessage => {
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

    return response;
  };

  // Detect expression from text content
  const detectExpression = (content: string): 'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking' => {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('happy') || lowerContent.includes('glad') || lowerContent.includes('wonderful') || 
        lowerContent.includes('excellent') || lowerContent.includes('great')) {
      return 'happy';
    } else if (lowerContent.includes('sad') || lowerContent.includes('sorry') || lowerContent.includes('unfortunate') || 
               lowerContent.includes('regret')) {
      return 'sad';
    } else if (lowerContent.includes('wow') || lowerContent.includes('amazing') || lowerContent.includes('surprising') || 
               lowerContent.includes('unexpected') || lowerContent.includes('interesting')) {
      return 'surprised';
    } else if (lowerContent.includes('angry') || lowerContent.includes('frustrating') || lowerContent.includes('upset') || 
               lowerContent.includes('annoying')) {
      return 'angry';
    } else if (lowerContent.includes('think') || lowerContent.includes('consider') || lowerContent.includes('perhaps') || 
               lowerContent.includes('maybe') || lowerContent.includes('possibly')) {
      return 'thinking';
    } else {
      return 'neutral';
    }
  };

  return (
    <Card className="chat-talking-head">
      <div className="talking-head-container">
        <TalkingHead 
          text={currentSpeechText}
          speaking={isSpeaking}
          expression={currentExpression}
        />
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-4 right-4"
          onClick={() => setIsModalOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
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
          {isLoading && (
            <div className="chat-message ai-message">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
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
          <Button 
            onClick={handleSendMessage} 
            className="send-button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </div>

      <ApiKeyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveSettings}
        currentProvider={apiSettings.provider}
        currentApiKey={apiSettings.apiKey}
        currentModel={apiSettings.model}
        currentEndpoint={apiSettings.endpoint}
      />
    </Card>
  );
};

export default ChatTalkingHead;
