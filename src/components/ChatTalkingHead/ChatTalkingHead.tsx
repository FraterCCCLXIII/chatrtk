
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, Eye, EyeOff, MessageSquare, MessageSquareOff } from "lucide-react";
import TalkingHead from '../TalkingHead/TalkingHead';
import ApiKeyModal from '../ApiKeyModal/ApiKeyModal';
import './ChatTalkingHead.css';
import { useToast } from "@/hooks/use-toast";
import { ChatMessage, TextMessage, CardMessage } from "@/lib/types";
import { parseAIResponse, detectExpression } from "@/lib/aiParser";

interface ApiSettings {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
}

const ChatTalkingHead: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-message',
      type: 'text',
      text: "Hello! How can I help you today?",
      isUser: false,
      expression: 'happy'
    } as TextMessage,
    {
      id: 'welcome-card',
      type: 'card',
      title: 'Card Prototype Demo',
      content: 'This is a demonstration of the new card feature. Cards can contain interactive buttons that trigger actions.',
      isUser: false,
      actions: [
        { label: 'Show Demo Card', action: 'runFunction:demo' },
        { label: 'Settings', action: 'openModal:settings' }
      ]
    } as CardMessage
  ]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [currentExpression, setCurrentExpression] = useState<'neutral' | 'happy' | 'sad' | 'surprised' | 'angry' | 'thinking'>('happy');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHead, setShowHead] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [headHeight, setHeadHeight] = useState(300); // Initial height in pixels
  const [isDragging, setIsDragging] = useState(false);
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
    
    // Only animate for text messages
    if (lastMessage.type === 'text') {
      setCurrentSpeechText(lastMessage.text);
      setCurrentExpression(lastMessage.expression || 'neutral');
      setIsSpeaking(true);

      // Auto-stop talking after a delay based on message length
      const speakingTime = Math.max(2000, lastMessage.text.length * 50);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, speakingTime);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Save API settings
  const handleSaveSettings = (provider: string, apiKey: string, model: string, endpoint?: string) => {
    const newSettings = { provider, apiKey, model, endpoint };
    setApiSettings(newSettings);
    localStorage.setItem('apiSettings', JSON.stringify(newSettings));
  };

  // Handle card action
  const handleCardAction = (actionString: string) => {
    const [command, param] = actionString.split(':');
    
    switch (command) {
      case 'openModal':
        if (param === 'settings') {
          setIsModalOpen(true);
        }
        break;
        
      case 'runFunction':
        if (param === 'demo') {
          // Add a demo card as a response
          const demoCard: CardMessage = {
            id: `demo-card-${Date.now()}`,
            type: 'card',
            isUser: false,
            title: 'Demo Card',
            content: 'This is a demo card created by the action handler.',
            actions: [
              { label: 'Close', action: 'runFunction:dismiss' }
            ]
          };
          setMessages(prev => [...prev, demoCard]);
        } else if (param === 'dismiss') {
          // Do nothing, just acknowledge the action
          toast({
            title: "Action Received",
            description: "Dismiss action processed successfully.",
          });
        }
        break;
        
      default:
        console.warn('Unknown action:', actionString);
        toast({
          title: "Unknown Action",
          description: `The action "${actionString}" is not recognized.`,
          variant: "destructive",
        });
    }
  };

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: TextMessage = {
      id: `user-${Date.now()}`,
      type: 'text',
      text: inputText,
      isUser: true
    };
    setMessages([...messages, userMessage]);
    
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
      const errorMessage: TextMessage = {
        id: `error-${Date.now()}`,
        type: 'text',
        text: "Sorry, I encountered an error. Please check your API settings.",
        isUser: false,
        expression: 'sad'
      };
      setMessages(prev => [...prev, errorMessage]);
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

      // System prompt that includes card format instructions
      const systemPrompt = `You are a helpful assistant with emotions. Express happiness, sadness, surprise, anger, or thoughtfulness in your responses. Keep responses concise.

IMPORTANT: When asked to create a card, you MUST use the exact format below:

[CARD]{"title": "Card Title", "content": "Card content", "actions": [{"label": "Button Text", "action": "command:param"}]}[/CARD]

Do not describe creating a card - actually create one using the [CARD] format. The entire JSON object must be valid and enclosed in the [CARD] tags.

Available commands for actions:
- openModal:settings - Opens the settings modal
- runFunction:demo - Shows a demo card
- runFunction:dismiss - Dismisses/acknowledges an action

Example card formats:
1. Simple card:
[CARD]{"title": "Weather in New York", "content": "Currently 72°F and Sunny\\nHigh: 74°F\\nLow: 58°F"}[/CARD]

2. Card with actions:
[CARD]{"title": "Task List", "content": "- Create prototype\\n- Test functionality\\n- Deploy to production", "actions": [{"label": "Mark Complete", "action": "runFunction:dismiss"}, {"label": "Settings", "action": "openModal:settings"}]}[/CARD]

When asked about cards, weather, recipes, or any structured information, respond with a properly formatted card.`;

      // Convert messages to API format
      const apiMessages = messages.map(msg => {
        if (msg.type === 'text') {
          return {
            role: msg.isUser ? "user" : "assistant",
            content: msg.text
          };
        } else if (msg.type === 'card') {
          // For card messages, convert to a text representation for the API
          return {
            role: "assistant",
            content: `I sent a card titled "${msg.title}" with content: "${msg.content}"`
          };
        }
        return null;
      }).filter(Boolean);

      switch (apiSettings.provider) {
        case 'openai':
          apiUrl = 'https://api.openai.com/v1/chat/completions';
          headers['Authorization'] = `Bearer ${apiSettings.apiKey}`;
          requestBody = {
            model: apiSettings.model,
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              ...apiMessages,
              {
                role: "user",
                content: userInput
              }
            ],
            max_tokens: 500
          };
          break;

        case 'claude':
          apiUrl = 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = apiSettings.apiKey;
          headers['anthropic-version'] = '2023-06-01';
          requestBody = {
            model: apiSettings.model,
            max_tokens: 500,
            messages: [
              {
                role: "user",
                content: `${systemPrompt}\n\nRespond to: ${userInput}`
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
                content: systemPrompt
              },
              ...apiMessages,
              {
                role: "user",
                content: userInput
              }
            ],
            max_tokens: 500
          };
          break;
          
        case 'local':
          apiUrl = apiSettings.endpoint || 'http://localhost:1234/v1/chat/completions';
          requestBody = {
            model: apiSettings.model,
            messages: [
              {
                role: "system",
                content: systemPrompt
              },
              ...apiMessages,
              {
                role: "user",
                content: userInput
              }
            ],
            max_tokens: 500
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
      
      // Parse the response to potentially extract card data
      return parseAIResponse(content);
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  // Mock AI response for testing or when API key isn't configured
  const mockGenerateResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase();
    
    // For demo purposes, return different types of cards based on user input
    if (lowerInput.includes('card') || lowerInput.includes('demo')) {
      return parseAIResponse(`[CARD]{"title": "Demo Card", "content": "This is a demo card that shows how interactive cards work in the chat interface.", "actions": [{"label": "Show Another", "action": "runFunction:demo"}, {"label": "Settings", "action": "openModal:settings"}]}[/CARD]`);
    }
    
    // Task list card
    if (lowerInput.includes('task') || lowerInput.includes('todo') || lowerInput.includes('to-do')) {
      return parseAIResponse(`[CARD]{"title": "Task List", "content": "- Create card prototype\\n- Implement card parser\\n- Add interactive buttons\\n- Style the cards\\n- Test with different content", "actions": [{"label": "Mark Complete", "action": "runFunction:dismiss"}, {"label": "Add Task", "action": "runFunction:demo"}]}[/CARD]`);
    }
    
    // Weather card
    if (lowerInput.includes('weather') || lowerInput.includes('forecast')) {
      return parseAIResponse(`[CARD]{"title": "Weather Forecast", "content": "New York, NY\\n\\nCurrently: 72°F, Sunny\\nHigh: 75°F\\nLow: 58°F\\n\\nTomorrow: Partly cloudy, 70°F", "actions": [{"label": "Refresh", "action": "runFunction:demo"}]}[/CARD]`);
    }
    
    // Recipe card
    if (lowerInput.includes('recipe') || lowerInput.includes('cook') || lowerInput.includes('food')) {
      return parseAIResponse(`[CARD]{"title": "Simple Pasta Recipe", "content": "Ingredients:\\n- 1 lb pasta\\n- 2 cups marinara sauce\\n- 1 cup cheese\\n- Salt and pepper\\n\\nInstructions:\\n1. Cook pasta according to package\\n2. Heat sauce in a pan\\n3. Mix pasta and sauce\\n4. Top with cheese", "actions": [{"label": "Save Recipe", "action": "runFunction:dismiss"}]}[/CARD]`);
    }
    
    // Detect expression from user input (simplified for demo)
    let response: string;
    let expression: Expression = 'neutral';
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      response = "Hello there! How can I assist you today?";
      expression = 'happy';
    } else if (lowerInput.includes('sad') || lowerInput.includes('bad') || lowerInput.includes('sorry')) {
      response = "I'm sorry to hear that. Is there anything I can do to help?";
      expression = 'sad';
    } else if (lowerInput.includes('wow') || lowerInput.includes('amazing') || lowerInput.includes('really')) {
      response = "That's amazing! Tell me more about it!";
      expression = 'surprised';
    } else if (lowerInput.includes('angry') || lowerInput.includes('mad') || lowerInput.includes('upset')) {
      response = "I understand your frustration. Let's try to resolve this issue together.";
      expression = 'angry';
    } else if (lowerInput.includes('think') || lowerInput.includes('question') || lowerInput.includes('how')) {
      response = "That's an interesting question. Let me think about that for a moment...";
      expression = 'thinking';
    } else {
      response = "I see. Tell me more about what you're looking for.";
      expression = 'neutral';
    }

    return {
      id: `ai-${Date.now()}`,
      type: 'text',
      text: response,
      isUser: false,
      expression: expression
    };
  };

  // Handle resizing of the talking head container
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = Math.max(100, Math.min(600, moveEvent.clientY - 100)); // Min 100px, max 600px
      setHeadHeight(newHeight);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Toggle visibility of components
  const toggleHead = () => setShowHead(!showHead);
  const toggleChat = () => setShowChat(!showChat);

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
      <div className="controls-container">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleHead}
          title={showHead ? "Hide talking head" : "Show talking head"}
        >
          {showHead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleChat}
          title={showChat ? "Hide chat" : "Show chat"}
        >
          {showChat ? <MessageSquareOff className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsModalOpen(true)}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showHead && (
        <>
          <div 
            className="talking-head-container" 
            style={{ height: `${headHeight}px` }}
          >
            <TalkingHead 
              text={currentSpeechText}
              speaking={isSpeaking}
              expression={currentExpression}
            />
          </div>
          
          <div 
            className="resize-handle"
            onMouseDown={handleResizeStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="resize-handle-line"></div>
            <div className="resize-handle-dots">
              <div className="resize-dot"></div>
              <div className="resize-dot"></div>
              <div className="resize-dot"></div>
            </div>
          </div>
        </>
      )}
      
      {showChat && (
        <div className="chat-container">
          <ScrollArea className="chat-messages">
            {messages.map((message, index) => (
              message.type === 'card' ? (
                <div 
                  key={message.id || index} 
                  className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}
                >
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{message.content}</p>
                    </CardContent>
                    {message.actions && message.actions.length > 0 && (
                      <CardFooter className="flex gap-2">
                        {message.actions.map((action, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            onClick={() => handleCardAction(action.action)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </CardFooter>
                    )}
                  </Card>
                </div>
              ) : (
                <div 
                  key={message.id || index} 
                  className={`chat-message ${message.isUser ? 'user-message' : 'ai-message'}`}
                >
                  {message.text}
                </div>
              )
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
        </div>
      )}
      
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
